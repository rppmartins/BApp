import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../services/http-request.service'
import { DataService } from '../../services/data.service'

import { Questionnaire } from '../../models/questionnaire.model'

@Component({
  selector: 'app-questionnaire',
  templateUrl: 'questionnaires.page.html',
  styleUrls: ['questionnaires.page.scss']
})
export class QuestionnairePage {
  constructor(
    public router: Router,
    private route : ActivatedRoute,
    private http : HttpRequestService,
    private data : DataService
  ){
    this.route.queryParams.subscribe(_ => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.campaign_info = this.router.getCurrentNavigation().extras.state.campaign_info;
      }
    })

    this.n_id = this.route.snapshot.paramMap.get('id')
  }
  
  campaign_info
  private n_id

  goBack(submit?){ 
    if(submit){ this.data.setData('n_id', this.n_id) }
    this.router.navigate(["/notifications"])
  }

  submit(form){
    this.saveInfo(form.form.value)
    this.goBack(true)
  }

  async saveInfo(form){
    debugger

    console.log('n_id: ' + this.n_id + ' & c_id: ' + this.campaign_info.c_id)

    const body = new Questionnaire(this.campaign_info.c_id, form).toDao()

    await this.http.answerQuestionnaire(body)
      .catch(err => console.log('something went wrong submitting questionnaire...'))
  }
}