import { Component, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EditModal } from '../modals/edit-modal.page';
import { HttpRequestService } from '../services/http-request.service'
import { DataService } from '../services/data.service'
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(
    private router : Router,
    public modalController: ModalController,
    private http : HttpRequestService,
    private data : DataService,
    private storage : Storage
  ){
    this.stored_info = this.storage.get('user')
  } 

  private stored_info
  
  private user
  private user_view

  private participations
  private history

  private notifications_flag

  ngOnInit(){
    this.user_view = {}
    this.participations = {}

    this.notifications_flag = false

    this.getUser()
    this.getParticipations()
    this.getHistory()
  }

  ionViewWillEnter(){
    this.checkNotifications()
  }

  getStoredInfo(){
    this.storage.get('user')
      .then(info => this.stored_info = info)
      .catch(err => console.log('something went wrong getting stored info...'))
  }

  getUser(){
    this.http.fetchPromise('get', `volunteers/${this.stored_info.email}?filter=Email`, '')
      .then(data => {
        this.user = this.formatUser(data.message)
        this.setView()
      })
      .then(_ => { if(this.stored_info.id == undefined) this.storeInfo() })
      .catch(err => console.log(`something went wrong with user! : ${err}`))
  }

  storeInfo(){
    this.stored_info['id'] = this.user.id
    this.storage.set('user', this.stored_info)
  }

  formatUser(data){
    return {
      id : data['Id'],
      profile_url : `picture/${data['Id']}`,
      user_name : data['Name'],
      nif: data['NIF'],
      birth_date : data['Birth_Date'],
      nationality: data['Nationality'],
      city: data['City'],
      address: data['Address'],
      zipcode: data['Zipcode'],
      email: 'rppmartins1996@hotmail.com',
      cellphone: data['Telephone'],
      phone: data['Phone'],
    }
  }

  setView(){
    const full_name = this.user['user_name'].split(' ')
    
    let header_name = `${full_name[0]} `
    if(full_name.length > 1) header_name +=  `${full_name[full_name.length-1]}`

    this.user_view = {
      header_name : header_name,
      name : this.user['user_name'],
      profile_url: this.user['profile_url'],
      info : {
        'Numero identificação fiscal: ':`${this.user['nif']}`,
        'Idade: ':`${this.getAge(this.user['birth_date'])} anos`,
        'Nacionalidade: ':`${this.user['nationality']}`,
        'Cidade: ':`${this.user['city']}`,
        'Morada: ':`${this.user['address']}`,
        'Código Postal: ':`${this.user['zipcode']}`,
        'Email: ':`${this.user['email']}`,
        'Telemovel: ':`${this.user['cellphone']}`,
        'Telefone: ':`${this.user['phone']}`
      }
    }
  }

  getAge(birth_date){
    const birth_arr = birth_date.split("-")
    const birth_year = birth_arr[0]
    const birth_month = birth_arr[1]
    const birth_day = birth_arr[2]

    const curr_date = new Date()
    const curr_year = curr_date.getFullYear()
    const curr_month = curr_date.getMonth()+1
    const curr_day = curr_date.getDate()

    let age = curr_year - parseInt(birth_year)

    if(birth_month > curr_month) age -= 1
    else if(birth_month == curr_month && birth_day > curr_day) age -= 1

    return age
  }

  getParticipations(){
    this.http.fetchPromise('get', `/volunteers/${this.stored_info.id}/participations`, '')
      .then(data => this.participations = this.formatParticipations(data.message))
      .catch(err => console.log('something went wrong getting participations...'))
  }

  formatParticipations(data){
    return {
      supermarket : data['Supermarket'],
      warehouse: data['Warehouse']
    }
  }

  getHistory(){
    this.http.fetchPromise('get', `volunteers/${this.stored_info.id}/history`, '')
      .then(data => {
        this.history = this.formatHistory(data.message)
      })
      .catch(err => console.log(`something went wrong with history! : ${err}`))
  }

  formatHistory(data){
    return data.map(value => {
      return {
        text : value['Text'],
        time : value['Time']
      }
    })
  }

  checkNotifications() {
    this.http.fetchPromise('get', `volunteers/${this.stored_info.id}/notifications`, '')
      .then(data => {
        this.data.setData('notifications', data.message)
      
        if(data.message.some(value => { return !value.read }))
          this.notifications_flag = true
      })
      .catch(err => console.log('something went wrong with check notifications...'))
  }

  async presentEditModal(){
    const modal = await this.modalController.create({
      component : EditModal,
      componentProps: {
        header_name : this.user_view['header_name'],
        user_info : this.user
      }
    })

    modal.onDidDismiss().then((new_user) => {
      if (new_user !== null && new_user.data != null) {
        this.user = new_user.data
        this.saveInfo()
        this.setView()
      }
   });
    return await modal.present();
  }

  saveInfo(){

    let body = JSON.stringify({
      'Name': this.user['name'],
      'NIF': this.user['nif'],
      'Picture': this.user['profile_url'],
      'Phone': this.user['cellphone'],
      'Telephone': this.user['phone'],
      'Birth_Date': this.user['birthdate'],
      'Nationality': this.user['nationality'],
      'Address': this.user['address'],
      'Locality': this.user['locality'],
      'ZipCode': this.user['name']
    })

    this.http.fetchPromise('put', `volunteers/${this.stored_info.id}`, body)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  goToNotifications(){
    if(this.notifications_flag) this.notifications_flag = false;

    this.router.navigate(['/notifications'])
  }
}
