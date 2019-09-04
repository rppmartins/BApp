import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participations } from '../models/participations.model';

@Injectable({
  providedIn: 'root'
})  
export class HttpRequestService {

  constructor(private http : HttpClient) { }

  private fetch_tries = 3

  private basic_url = 'https://bagv.azurewebsites.net/api/'
  private api_key = ''
  
  //-------------------------------------------------------------------------Volunteer
  createVolunteer(body){
    return this.fetchPromise('post', `volunteers`, body)
  }
  getVolunteer(identifier, filter){
    return this.fetchPromise('get', `volunteers/${identifier}?filter=${filter}`, '')
      .then(volunteers => { if(volunteers != undefined) return volunteers[0] })
  }
  updateVolunteer(v_id, body){
    return this.fetchPromise('put', `volunteers/${v_id}`, body)
  }
  //-------------------------------------------------------------------------Picture
  createPicture(body){
    return this.fetchPromise('post', `picture`, body)
  }
  getPicture(v_id){
    return this.fetchPromise('get', `picture/${v_id}`, '')
  }
  updatePicture(v_id, body){
    return this.fetchPromise('put', `picture/${v_id}`, body)
  }
  //-------------------------------------------------------------------------Participations
  getParticipations(v_id){
    return this.fetchPromise('get', `volunteers/${v_id}/participations`, '')
      .then(participations => { if(participations != undefined) return participations[0] })
  }
  //-------------------------------------------------------------------------History
  getHistory(v_id){
    return this.fetchPromise('get', `volunteers/${v_id}/historic`, '')
  }
  //-------------------------------------------------------------------------Notifications
  getNotifications(v_id){
    return this.fetchPromise('get', `volunteers/${v_id}/notifications`, '')
  }
  getLastNotifcations(v_id, last_id){
    return this.fetchPromise('get', `volunteers/${v_id}/notifications/${last_id}`, '')
  }
  updateNotification(n_id, body){
    return this.fetchPromise('put', `notification/${n_id}`, body)
  }
  deleteNotification(n_id){
    return this.fetchPromise('delete', `notification/${n_id}`, '')
  }
  //-------------------------------------------------------------------------Invitations
  answerInvitation(body){
    return this.fetchPromise('post', `answer`, body)
  }
  //-------------------------------------------------------------------------Questionnaires
  answerQuestionnaire(body){
    return this.fetchPromise('post', `questionnaires`, body)
  }
  //-------------------------------------------------------------------------Trophies
  getTrophies(){
    return this.fetchPromise('get', `trophies`, '')
  }
  //-------------------------------------------------------------------------CheckIn
  checkIn(v_id, c_id){
    return this.fetchPromise('post', `volunteer/${v_id}/campaign/${c_id}`, {'Certified': false})
  }
  //-------------------------------------------------------------------------Cities
  fetchCitiesPromise(){
    const cities_url = 'http://api.ipma.pt/open-data/distrits-islands.json'
    return this.http.get(cities_url).toPromise()
  }


  private fetchPromise(method, uri, body){
    console.log(uri)

    return this.http[method](`${this.basic_url}${uri}`, body).toPromise()
      .then(res => {
        this.fetch_tries = 2
        return res
      })
      .catch(err => {
        console.log(`error -> ${JSON.stringify(err.error.error)}`)

        console.log(`tries = ${this.fetch_tries}`)
        if(this.fetch_tries > 0) {
          this.fetch_tries -= 1
          this.fetchPromise(method, uri, body)
        }
        else {
          console.log('something went wrong resolving fetch...')
          this.fetch_tries = 2
          return null
        }
      })
  }
}