import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class HttpImageRequestService {

  constructor(
    private http : HttpClient,
    private storage : Storage,
    //private network : Network
  ){}

  private default_image = "/assets/default_profile.jpg"

  private basic_url = 'https://bagv.azurewebsites.net/api/'
  private fetch_tries = 2

  
  getPicture(v_id){
    return this.fetchPromise('get', `picture/${v_id}`, '', {responseType: 'blob'})
  }
  uploadPicture(v_id, body){
    return this.fetchPromise('put', `picture/${v_id}`, body)
  }
  

  private fetchPromise(method, uri, body, header?){

    const url = `${this.basic_url}${uri}`

    if(header) return this.http[method](url, header)
    return this.http[method](url, body)
  }
}
