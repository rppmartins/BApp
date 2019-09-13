import { Component, ɵConsole } from '@angular/core'
import { Router } from '@angular/router';
import { Platform, ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';

import { HttpRequestService } from '../../services/http-request.service'
import { HttpImageRequestService } from '../../services/http-image-request.service'
import { DataService } from '../../services/data.service'
import { Storage } from '@ionic/storage'

import { EditPage } from '../edit/edit.page'

import { Volunteer } from '../../models/volunteer.model'
import { VolunteerView } from '../../view-model/volunteer.view-model';
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
    private httpImage : HttpImageRequestService,
    private platform : Platform,
    private modalController: ModalController,
    private loadingController : LoadingController,
    private toastController : ToastController
  ){} 

  private stored_info
  
  private user

  user_view
  participations
  history

  private notifications_flag

  private loading
  loaded = false

  private default_image = "/assets/default_profile.jpg"

  async ngOnInit(){
    await this.getStoredInfo()
    await this.getProfileInfo()
      .then(_ => this.checkNotifications())
      .catch(err => {
        debugger
        this.presentToast()
      })
  }
  
  getStoredInfo(){
    return this.storage.get('user')
      .then(res => {
        console.log(res)
        if(res.profile_url == '' || res.profile_url == undefined){
          res['profile_url'] = this.default_image
        }
        return res
      })
      .then(user => this.stored_info = user)
  }

  async getProfileInfo(event?){
    this.loading = await this.loadingController.create({
      message: 'A obter dados...'
    });
    this.loading.present()

    this.getUser()
    this.getParticipations()
    this.getHistory()
      .then(_ => {
        this.loaded = true
        this.loading.dismiss()
      })
      .then(_ => {if(event) event.target.complete()})
      .catch(err => {
        this.presentToast(event)
      })
  }

  getUser(){
    return this.http.getVolunteer(this.stored_info.id, 'Id')
      .then(data => {
        console.log('got volunteer in profile')
        this.user = new Volunteer(data, this.stored_info.email)
        this.setView()
      })
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
  }

  getHistory(){
    return this.http.getHistory(this.stored_info.id)
      .then(data => {
        console.log('got history in profile')
        this.history = data.map(entry => new HistoryEntry(entry))
      })
  }

  checkNotifications() {
    this.http.getNotifications(this.stored_info.id)
      .then(data => {
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
        debugger
        const this_image = this.formatImage(image)
        
        this.stored_info['profile_url'] = this_image
        this.storage.set('user', this.stored_info)

        this.upload(image);
      },
      err => console.log(err),
      {
        sourceType: camera['PictureSourceType'].SAVEDPHOTOALBUM,
        destinationType: camera['DestinationType'].FILE_URI,
        quality: 100,
        encodingType: camera['EncodingType'].JPEG,
      }
    )
  }

  formatImage(url){
    if (!url) { return url }
    if (url.startsWith('/')) { return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url }
    if (url.startsWith('file://')) { return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_') }
    if (url.startsWith('content://')) { return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_') }
    return url;
  }

  async upload(image_uri: any) {
    this.loading = await this.loadingController.create({
      message: 'Gravando alterações...'
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
    const reader = new FileReader()

    reader.onloadend = () => {
      const form_data = new FormData();
      const image_blob = new Blob([reader.result], {type: image_file.type});
      
      form_data.append('file', image_blob, image_file.name);
      
      this.postImage(form_data);
    }
    reader.readAsArrayBuffer(image_file);
  }

  postImage(data) {
    debugger

    const body = { 'voluntaryImage' : data }

    this.createOrUpdate(body)
      .subscribe(
        data => this.loading.dismiss(), 
        error => {
          console.log(error)
          this.loading.dismiss()
        }
      )
  }

  createOrUpdate(data){
    return this.httpImage.uploadPicture(this.stored_info.id, data)
  }

  async presentToast(event?){
    if(event) event.target.complete()
    this.loading.dismiss()

    const toast = await this.toastController.create({
      header: 'Ocurreu um erro...',
      message: 'Por favor verifique a sua conexão.',
      duration: 10000
    });
    toast.present();
  }

  async editInfo(){
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