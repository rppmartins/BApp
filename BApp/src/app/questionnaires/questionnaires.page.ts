import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../services/http-request.service'
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-questionnaire',
  templateUrl: 'questionnaires.page.html',
  styleUrls: ['questionnaires.page.scss']
})
export class QuestionnairePage {

  private c_id
  private n_id

  constructor(
    public router: Router,
    private route : ActivatedRoute,
    private http : HttpRequestService,
    private data : DataService
  ){
    this.route.queryParams.subscribe(_ => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.c_id = this.router.getCurrentNavigation().extras.state.c_id;
      }
    })

    this.n_id = this.route.snapshot.paramMap.get('id')
  }

  goBack(submit){ 
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
    console.log('n_id: ' + this.n_id + ' & c_id: ' + this.c_id)

    const body = {
      "CampaignId": this.c_id,
      "First_Participation": form['first_time'],
      "Local": form['spot'] != undefined ? form['spot'] : null,
      "Period": form['time'] != undefined ? form['time'] : null,
      "DayTimeParticipation": form['day_time'],
      "Evaluation_Campaign": form['organization'],
      "Evaluation_WareHouse": form['behavior'],
      "Self_Evaluation": form['help'],
    }

    this.http.fetchPromise('post', `questionnaires`, body)
      .catch(err => console.log('something went wrong submitting questionnaire...'))
  }
}