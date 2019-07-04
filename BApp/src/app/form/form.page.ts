import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpRequestService } from '../services/http-request.service';

@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss']
})
export class FormPage {
  constructor(
    private router : Router,
    private http : HttpRequestService
  ){}

  ngOnInit(){
    this.getLoginInfo()
    this.getCities()
  }

  private v_email
  private cities = []

  getLoginInfo(){
    //get from native storage
    this.v_email = "rppmartins1996@hotmail.com"
  }

  getCities(){
    this.http.fetchCitiesPromise()
      .then(data => this.formatCities(data['data']))
      .then(data => this.cities = data.filter(city => {
        return city.split('-')[1] == undefined
      }))
      .catch(err => console.log('something went wrong getting cities...'))
  }

  formatCities(data){
    return data.map(city_obj => {
      return city_obj['local']
    })
  }

  register(form){
    const body = JSON.stringify(
      this.formatInfo(form.form.value)
    )

    this.http.fetchPromise('post','volunteers', body)
      .then(res => {
        console.log(res)
        this.router.navigate(['/tabs'])
      })
      .catch(err => {
        console.log(`something went wrong with form! : ${err}`)
        this.router.navigate(['login'])
      })
  }

  formatInfo(info){
    return {
      'Name' : info.name,
      'NIF': info.nif,
      'Picture' : '',
      'Nationality': info.nationality,
      'City' : info.city,
      'Address': info.address,
      'ZipCode': `${info.zipcode_frst_number}-${info.zipcode_scnd_number} ${info.locality.toUpperCase()}`,
      'Phone': info.cellphone,
      'Telephone': info.phone,
      'Email': this.v_email,
      'Birth_Date': info.birthdate.split("T")[0],
      'Observations': info.observations,
      'Spot': info.spot,
      'Type': 'Campanha'
    }
  }

  permitOnlyLetters(key){ return (key > 64 && key < 91) || (key > 96 && key < 123) || key == 32 }
  permitMaxSize(input, max){ return (input.target.value.toString().length < max) }
}