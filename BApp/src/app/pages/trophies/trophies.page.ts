import { Component } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service'
import { TrophiesEntry } from 'src/app/models/trophies-entry.model';
import { HttpImageRequestService } from 'src/app/services/http-image-request.service';

@Component({
  selector: 'app-trophies',
  templateUrl: 'trophies.page.html',
  styleUrls: ['trophies.page.scss']
})
export class TrophiesPage {
  constructor(
    private http: HttpRequestService,
    private httpImage: HttpImageRequestService
  ){}

  private default_image = "/assets/default_profile.jpg"

  participants

  ngOnInit(){
    this.getTopParticipants()
  }

  getTopParticipants(event?){
    this.http.getTrophies()
      .then(data => {
        this.participants = data.map(entry => new TrophiesEntry(entry))
      })
      .then(_ => {
        if(event) event.target.complete()
        this.setAvatars()
      })
      .catch(_ => console.log('something went wrong getting trophies...'))
  }

  setAvatars(){
    this.participants.forEach(participant => {
      this.getAvatar(participant)
    })
  }

  getAvatar(participant){
    this.httpImage.getPicture(participant.id)
      .subscribe(data => {
        this.createImageFromBlob(participant,data);
      }, error => {
        participant['avatar'] = this.default_image
      });
  }

  createImageFromBlob(participant, image) {
    let reader = new FileReader();
    reader.onloadend = () => {
      participant['avatar']= reader.result
    };
 
    reader.readAsDataURL(image)
 }
  
}
