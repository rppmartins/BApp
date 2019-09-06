import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../../services/http-request.service'
import { DataService } from '../../services/data.service'
import { Storage } from '@ionic/storage'
import { Platform, LoadingController } from '@ionic/angular'

import { NotificationsEntry } from 'src/app/models/notifications-entry.model';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit{

  constructor(
    private router: Router,
    private platform : Platform,
    private http : HttpRequestService,
    private data : DataService,
    private storage : Storage,
    private loadingController : LoadingController,
  ){}

  private v_id

  notifications

  private loading
  
  async ngOnInit(){
    await this.getStoredInfo()
      .then(user => this.v_id = user.id)
    
    this.getNotifications()
      .then(_ => this.loading.dismiss())
  }

  ionViewDidEnter(){
    this.checkSubmission()
  }

  getStoredInfo(){
    return this.storage.get('user')
  }

  checkSubmission(){
    const n_id = this.data.getData('n_id')
    if(n_id != '') this.deleteInfo(parseInt(n_id))
  }

  async getNotifications(){

    this.loading = await this.loadingController.create({
      message: 'A obter notificações...'
    });
    this.loading.present()

    const data = this.data.getData('notifications')
    
    if(data != undefined && data != ''){
      this.notifications = data.map(entry => new NotificationsEntry(entry)).reverse()
      this.refresh()
    }
    else {
      await this.http.getNotifications(this.v_id)
        .then(data => {
          this.notifications = data.map(entry => new NotificationsEntry(entry)).reverse()
        })
        .catch(err => console.log('something went wrong with notifications...'))
    }
  }

  goBack(){
    this.saveInfo()
    this.router.navigate(["/tabs/profile"]) 
  }

  read(item, id){
    this.notifications.forEach(notification => {
      if(notification.id == id){
        notification.read = !notification.read
        notification.changed = !notification.changed
      }
    })
    item.close()
  }

  delete(item, id){
    item.close()
    this.deleteInfo(id)
  }

  async refresh(event?){
    const last_id = this.getLastNotificationId()

    await this.http.getLastNotifcations(this.v_id, last_id)
      .then(data => 
        this.notifications.unshift(...data.map(entry => new NotificationsEntry(entry)).reverse())
      )
      .then(_ => {if(event) event.target.complete()})
      .catch(err => {
        console.log('something went wrong pushing new notifications...')
      })
  }

  getLastNotificationId(){
    let last_id = Math.max.apply(Math, this.notifications.map(
      notification => { return notification.id; }
    ))

    if(last_id < 0) last_id = 0

    return last_id
  }

  saveInfo(){
    this.notifications.forEach(async notification => {
      if(notification.changed) {

        notification.changed = false

        const body = notification.toDao()  
        
        await this.http.updateNotification(notification.id, body)
          .then(_ => console.log('Saved'))
          .catch(err => console.log('something went wrong with saving notification...'))
      }
    })
  }

  async deleteInfo(id){
    await this.http.deleteNotification(id)
      .then(_ => {
        this.notifications = this.notifications.filter((n) => {
          return n.id != id
        })
      })
      .catch(_ => console.log('something went wrong with deleting notification...'))
  }

  goToNotification(id, c_id, type){
    this.saveInfo()
    const notification_routing = {
      q : `/questionnaires/${id}`,
      i : `/invitations/${id}`,
      t : `/thanks/${id}`
    }
    const extras = {
      state : {
        c_id : c_id
      }
    }
    this.router.navigate([notification_routing[type]], extras)
  }
}