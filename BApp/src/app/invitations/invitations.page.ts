import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../services/http-request.service'
import { DataService } from '../services/data.service'
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-invitation',
  templateUrl: 'invitations.page.html',
  styleUrls: ['invitations.page.scss']
})
export class InvitationPage {

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private http : HttpRequestService,
    private data : DataService,
    private storage : Storage
  ){
    this.route.queryParams.subscribe(_ => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.c_id = this.router.getCurrentNavigation().extras.state.c_id;
      }
    })

    this.n_id = this.route.snapshot.paramMap.get('id')
  }

  async ngOnInit(){
    await this.getStoredInfo()
      .then(user => this.v_id = user.id)
  }

  private v_id
  private c_id
  private n_id
  
  getStoredInfo(){
    return this.storage.get('user')
  }

  goBack(submit?){
    if(submit){
      this.data.setData('n_id', this.n_id)
    }
    this.router.navigate(["/notifications"]) 
  }

  submit(form){
    this.saveInfo(form.form.value)
    this.goBack(true)
  }

  saveInfo(form){
    console.log('v_id: ' + this.v_id + ', n_id: ' + this.n_id + ' & c_id: ' + this.c_id)

    const body = {
      'CampaignId' : this.c_id,
      'VolunteerId' : this.v_id,
      'Participation' : form['participation'],
      'DayTime' : form['day_time'] != undefined ? form['day_time'] : null
    }

    this.http.fetchPromise('post', `invitations`, body)
      .catch(err => console.log('something went wrong submitting questionnaire...'))
  }
}