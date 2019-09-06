import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Platform } from '@ionic/angular';
import { HttpRequestService } from '../../services/http-request.service'
import { DataService } from '../../services/data.service'
import { Storage } from '@ionic/storage'
import { Volunteer } from 'src/app/models/volunteer.model';


@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss']
})
export class FormPage {
  
  constructor(
    private router : Router,
    private platform : Platform,
    private http : HttpRequestService,
    private data : DataService,
    private storage : Storage
  ){ }

  login_info
  cities

  ngOnInit(){
    this.login_info = this.data.getData('user')
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

  async register(form){

    debugger
    
    const form_values = this.getValues(form.form.value)

    const body = new Volunteer(form_values, this.login_info['email']).toDao()

    await this.http.createVolunteer(body)
      .then(user_id => {

        debugger
        this.login_info['id'] = user_id['ID']
        this.storage.set('user', this.login_info)
        
        this.router.navigate(['/tabs/profile'])
      })
      .catch(err => {
        console.log(`something went wrong with form! : ${err}`)
        this.router.navigate(['/login'])
      })
  }

  getValues(form){
    return {
      Name : `${form['name']}`,
      NIF : `${form['nif']}`,
      Phone : `${form['cellphone']}`,
      Telephone : `${form['phone']}`,
      Birth_Date : `${form['birthdate']}`,
      Nationality : `${form['nationality']}`,
      Address : `${form['address']}`,
      Locality : `${form['city']}`,
      ZipCode : `${form['zipcode_frst_number']}-${form['zipcode_scnd_number']} ${form['locality'].toUpperCase()}`,
      Observations : `${form['observations']}`
    }
  }

  permitOnlyLetters(key){ return (key > 64 && key < 91) || (key > 96 && key < 123) || key == 32 }
  permitMaxSize(input, max){ return (input.target.value.toString().length < max) }
}