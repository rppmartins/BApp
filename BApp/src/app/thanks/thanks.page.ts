import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-thanks',
  templateUrl: 'thanks.page.html',
  styleUrls: ['thanks.page.scss']
})
export class ThanksPage {

  private n_id

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private data : DataService
  ){}

  ngOnInit(){
    this.n_id = this.route.snapshot.paramMap.get('id')
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