import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../services/http-request.service'
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit{

  private v_id
  private notifications
  
  constructor(
    private router: Router,
    private http : HttpRequestService,
    private data : DataService
  ){}

  ngOnInit(){
    this.v_id = 1
    this.getNotifications()
  }

  ionViewWillEnter(){
    this.checkSubmission()
  }

  checkSubmission(){
    const n_id = this.data.getData('n_id')
    if(n_id != '') this.deleteInfo(n_id)
  }

  getNotifications(){ //if & else needed?
    const notifications = this.data.getData('notifications')
    if(notifications != undefined && notifications != ''){
      this.notifications = this.formatData(notifications)
      this.refresh()
    }
    else {
      this.http.fetchPromise('get', `volunteers/${this.v_id}/notifications`, '')
        .then(data => { this.notifications = this.formatData(data.message) })
        .catch(err => console.log('something went wrong with notifications...'))
    }
  }

  goBack(){
    this.saveInfo()
    this.router.navigate(["/tabs"]) 
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

  refresh(event?){
    const last_id = this.getLastNotificationId()

    this.http.fetchPromise('get', `volunteers/${this.v_id}/notifications?last_id=${last_id}`, '')
      .then(data => this.notifications.unshift(...this.formatData(data.message)))
      .then(_ => {if(event) event.target.complete()})
      .catch(err => console.log('something went wrong pushing new notifications...'))
  }

  getLastNotificationId(){
    return Math.max.apply(Math, this.notifications.map(
      notification => { return notification.id; }
    ))
  }

  formatData(data){
    return data.map(value => {
      return {
        id : value['Id'],
        c_id : value['C_Id'],
        name : value['C_Name'],
        type : value['Type'],
        read : value['Read'],
        changed : false
      }
    }).reverse()
  }

  deleteInfo(id){
    this.http.fetchPromise('delete', `notifications/${id}`, '')
      .then(_ => {
        this.notifications = this.notifications.filter((n) => {
          return n.id != id
        })
      })
      .catch(_ => console.log('something went wrong with deleting notification...'))
  }

  saveInfo(){
    this.notifications.forEach(notification => {
      if(notification.changed) {

        notification.changed = false

        const body = {
          Id : notification.id,
          C_Id : notification.c_id,
          Name : notification.name,
          Type : notification.type,
          Read : notification.read
        }

        this.http.fetchPromise('put', `notifications/${notification.id}`, body)
          .then(_ => console.log('Saved'))
          .catch(err => console.log('something went wrong with saving notification...'))
      }
    })
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