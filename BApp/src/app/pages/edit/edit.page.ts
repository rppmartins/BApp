import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { HttpRequestService } from '../../services/http-request.service'

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.page.html',
  styleUrls: ['edit.page.scss']
})
export class EditPage {
  
  constructor(
    private modalController : ModalController,
    private navParams: NavParams,
    private http : HttpRequestService
  ){
    //this.v_id = this.route.snapshot.paramMap.get('id')
  }

  user_info = null
  cities

  private changed_info

  private changed_date
  private changed_zip

  private loaded

  ngOnInit(){
    /*
    const header_name = this.navParams.get('header_name');
    this.user_info = this.navParams.get('user_info');

    console.log(JSON.stringify(header_name))
    console.log(JSON.stringify(this.user_info))
    */

  }
  
  ionViewWillEnter(){
    const header_name = this.navParams.get('header_name');
    this.user_info = this.navParams.get('user_info');

    console.log(JSON.stringify(header_name))
    console.log(JSON.stringify(this.user_info))

    this.formatUserInfo("Rodrigo Martins")
    this.getCities()
  }

  formatUserInfo(header_name){

    debugger

    this.user_info['header_name'] = header_name

    const zipcode = this.user_info['zipcode'].split(' ')
    const numbers = zipcode[0].split('-')

    this.user_info['frst_zip'] = numbers[0]
    this.user_info['scnd_zip'] = numbers[1]
    this.user_info['thrd_zip'] = zipcode.slice(1, zipcode.length).join(' ')

    this.user_info['birth_date'] = this.user_info['birth_date'].split('T')[0]

    this.loaded = true

    debugger
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

  change_value(target){
    if(target.name == 'birth_date'){ this.changed_date = target.value.split("T")[0] }
    else if(target.name == 'frst_zip' || target.name == 'scnd_zip' || target.name == 'thrd_zip'){
      this.changed_zip = true
    }

    this.user_info[`${target.name}`] = target.value
    this.changed_info = true
  }

  save(){
    if(this.changed_date != null) this.user_info['birth_date'] = this.changed_date
    
    if(this.changed_zip)
      this.user_info['zipcode'] = `${this.user_info['frst_zip']}-${this.user_info['scnd_zip']} ${this.user_info['thrd_zip']}`
   
    delete this.user_info['frst_zip']
    delete this.user_info['scnd_zip']
    delete this.user_info['thrd_zip']

    this.dismiss()
  }

  cancel(){
    this.changed_info = false
    this.dismiss()
  }

  async dismiss(){
    if(this.changed_info) await this.modalController.dismiss(this.user_info);
    else await this.modalController.dismiss();
  }

  permitOnlyLetters(key){ return (key > 64 && key < 91) || (key > 96 && key < 123) || key == 32 }
  permitMaxSize(input, max){ return (input.target.value.toString().length < max) }
  
}