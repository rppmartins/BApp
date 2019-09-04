import { Component } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service'
import { TrophiesEntry } from 'src/app/models/trophies-entry.model';

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
    
    this.http.getTrophies()
      .then(data => this.participants = data.map(entry => new TrophiesEntry(entry)))
      .then(_ => this.setAvatars())
      .catch(_ => console.log('something went wrong getting trophies...'))
  }

  setAvatars(){
    this.participants.forEach( async participant => {
      participant['avatar'] = await this.getAvatar(participant.id)
    })
  }

  getAvatar(id){
    return this.http.getPicture(id)
      .then(data => data.message)
      .catch(_ => console.log('something went wrong getting avatar...'))
  }
  
}
