import { Component, ɵConsole } from '@angular/core'
import { Router } from '@angular/router';
import { Platform, ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { EditPage } from '../edit/edit.page'
import { HttpRequestService } from '../../services/http-request.service'
import { DataService } from '../../services/data.service'
import { Storage } from '@ionic/storage'
import { finalize } from 'rxjs/operators';

import { Volunteer } from '../../models/volunteer.model'
import { VolunteerView } from '../..//view-model/volunteer.view-model';
import { HistoryEntry } from '../../models/history-entry.model'
import { Participations } from '../../models/participations.model';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(
    private router : Router,
    private storage : Storage,
    private data : DataService, 
    private http : HttpRequestService,
    private platform : Platform,
    private modalController: ModalController,
    private loadingController : LoadingController,
    private toastController : ToastController,
    private alertController : AlertController
  ){} 

  private stored_info
  
  private user
  private user_view

  private participations
  private history

  private notifications_flag
  private new_image_flag = false

  private loading

  private loaded = false

  async ngOnInit(){
    
    await this.getStoredInfo()
      .then(user => this.stored_info = user)
      .then(async _ => {
        await this.getUser()
        await this.getParticipations()
        await this.getHistory()
      })
      .then(_ => {
        this.loaded = true
        this.checkNotifications()
      })
      .catch(err => alert(err))
  }
  
  getStoredInfo(){
    return this.storage.get('user')
      .then(res => {
        if(res.profile_url == '' || res.profile_url == undefined){
          res['profile_url'] = "/assets/default_profile.jpg"
        }
        return res
      })
  }

  getUser(){
    return this.http.getVolunteer(this.stored_info.id, 'Id')
      .then(data => {
        console.log('got volunteer in profile')
        this.user = new Volunteer(data, this.stored_info.email)
        this.setView()
      })
      .catch(err => console.log(`something went wrong with user! : ${err}`))
  }

  setView(){
    this.user_view = new VolunteerView(this.user, this.stored_info['name'], this.stored_info['profile_url'])
  }
  
  getParticipations(){
    return this.http.getParticipations(this.stored_info.id)
      .then(data => {
        this.participations = new Participations(data)  
      })
      .then(_ => console.log('got participations in profile'))
      .catch(err => console.log('something went wrong getting participations...'))
  }

  getHistory(){
    return this.http.getHistory(this.stored_info.id)
      .then(data => {
        console.log('got history in profile')
        this.history = data.map(entry => new HistoryEntry(entry))
      })
      .catch(err => console.log(`something went wrong with history! : ${err}`))
  }

  checkNotifications() {
    this.http.getNotifications(this.stored_info.id)
      .then(data => {
        debugger

        this.data.setData('notifications', data)
      
        if(data.some(value => { return !value['Display'] }))
          this.notifications_flag = true
      })
      .catch(err => {
        this.notifications_flag = false
        console.log('something went wrong with check notifications...')
      })
  }

  uploadImage(){
    const camera = navigator['camera']

    camera.getPicture(
      image => {
        const this_image = this.formatImage(image)
        if(this.stored_info['profile_url'] == undefined){

          this.stored_info['profile_url'] = this_image
          this.storage.set('user', this.stored_info)
          
          this.new_image_flag = true
        }
        this.user_view['profile_url'] = this_image
        this.upload(image);
      },
      err => console.log(err),
      {
        sourceType: camera['PictureSourceType'].PHOTOLIBRARY,
        destinationType: camera['DestinationType'].FILE_URI,
        quality: 100,
        encodingType: camera['EncodingType'].JPEG,
      }
    )
  }

  formatImage(url){
    debugger
    if (!url) { return url }
    if (url.startsWith('/')) { return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url }
    if (url.startsWith('file://')) { return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_') }
    if (url.startsWith('content://')) { return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_') }
    return url;
  }

  async upload(image_uri: any) {
    this.loading = await this.loadingController.create({
      message: 'Uploading...'
    });

    this.loading.present();

    window['resolveLocalFileSystemURL'](
      image_uri,
      entry => {
        entry['file'](file => this.readFile(file))
      }
    )
  }

  readFile(image_file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const form_data = new FormData();
      const image_blob = new Blob([reader.result], {type: image_file.type});
      form_data.append('file', image_blob, image_file.name);
      this.postData(form_data);
    };
    reader.readAsArrayBuffer(image_file);
  }

  postData(data, id?) {

    const body = {
      'VoluntaryId' : id,
      'VoluntaryImage' : data
    }

    createOrUpdate(this.new_image_flag, body, id)
      .then(res => {
        finalize(this.loading.dismiss()) //this.showToast(true)
      })
      .catch(err => console.log(err)) //this.showToast(false)

    function createOrUpdate(is_new, data, v_id?){
      return is_new ? this.http.createPicture(data) : this.http.updatePicture(v_id, data)
    }
  }

  editInfo(){
    this.presentEditModal()
  }

  async presentEditModal(){
    const modal = await this.modalController.create({
      component : EditPage,
      componentProps: {
        'header_name' : this.user_view['header_name'],
        'user_info' : this.user
      }
    })
    modal.onDidDismiss().then((new_user) => {
      if (new_user !== null && new_user.data != null) {
        this.user = new_user.data
        this.setView()
        this.saveInfo()
      }
    })
    modal.present();
  }

  saveInfo(){
    console.log(this.user)
    const body = this.user.toDao()

    this.http.updateVolunteer(this.stored_info.id, body)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  goToNotifications(){
    if(this.notifications_flag) this.notifications_flag = false;

    this.router.navigate(['/notifications'])
  }
}