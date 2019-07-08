import { Component } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service'

@Component({
  selector: 'app-trophies',
  templateUrl: 'trophies.page.html',
  styleUrls: ['trophies.page.scss']
})
export class TrophiesPage {

  private participants

  constructor(private http: HttpRequestService){}

  ngOnInit(){
    this.getTopParticipants()
  }

  getTopParticipants(){
    
    this.http.fetchPromise('get', `trophies`, '')
      .then(data => this.participants = this.formatData(data.message))
      .then(_ => this.setAvatars())
      .catch(_ => console.log('something went wrong getting trophies...'))
  }

  formatData(data){
    return data.map(value => {
      return {
        id : value['Id'],
        name : value['Name'],
        participations : value['Participations']
      }
    })
    .sort((a,b) => b.participations - a.participations)
  }

  setAvatars(){
    this.participants.forEach( async participant => {
      participant['avatar'] = await this.getAvatar(participant.id)
    })
  }

  getAvatar(id){
    return this.http.fetchPromise('get', `pictures/${id}`, '')
      .then(data => data.message)
      .catch(_ => console.log('something went wrong getting avatar...'))
  }
  
}
