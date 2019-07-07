import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service'
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-thanks',
  templateUrl: 'thanks.page.html',
  styleUrls: ['thanks.page.scss']
})
export class ThanksPage {

  constructor(
    private router: Router,
    private platform : Platform,
    private route : ActivatedRoute,
    private data : DataService
  ){}

  private n_id
  private subBackEvent

  ngOnInit(){
    this.n_id = this.route.snapshot.paramMap.get('id')
    
    this.initBackButtonHandler()
  }

  ionViewWillLeave(){
    this.subBackEvent && this.subBackEvent();
  }

  initBackButtonHandler(){
    this.subBackEvent = this.platform.backButton.subscribeWithPriority(999999,  () => {
      this.goBack()
    })
  }

  goBack(submit?){ 
    if(submit){
      this.data.setData('n_id', this.n_id)
    }
    this.router.navigate(["/notifications"])
  }

  submit(form?){
    this.goBack(true)
  }
}