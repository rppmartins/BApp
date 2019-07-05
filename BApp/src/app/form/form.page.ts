import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { HttpRequestService } from '../services/http-request.service'
import { DataService } from '../services/data.service'
import { Storage } from '@ionic/storage'


@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss']
})
export class FormPage {
  constructor(
    private router : Router,
    private http : HttpRequestService,
    private data : DataService,
    private storage : Storage
  ){
    this.login_info = this.data.getData('user')
  }

  private login_info
  private cities

  ngOnInit(){
    this.getCities()
  }

  getCities(){
    this.http.fetchCitiesPromise()
      .then(cities => this.formatCities(cities['data']))
      .then(cities => this.cities = cities.filter(city => {
        return city.split('-')[1] == undefined
      }))
      .catch(err => console.log('something went wrong getting cities...'))
  }

  formatCities(cities){
    return cities.map(city_obj => {
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
        this.storage.set('user', this.login_info)
        this.router.navigate(['/tabs/profile'])
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
      'Email': this.login_info['email'],
      'Birth_Date': info.birthdate.split("T")[0],
      'Observations': info.observations,
      'Spot': info.spot,
      'Type': 'Campanha'
    }
  }

  permitOnlyLetters(key){ return (key > 64 && key < 91) || (key > 96 && key < 123) || key == 32 }
  permitMaxSize(input, max){ return (input.target.value.toString().length < max) }
}