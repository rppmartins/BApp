import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpImageRequestService {

  constructor(private http : HttpClient) {}

  private default_image = "/assets/default_profile.jpg"

  private basic_url = 'https://bagv.azurewebsites.net/api/'
  private fetch_tries = 2
  
  getPicture(v_id){
    return this.fetchPromise('get', `picture/${v_id}`, { responseType: 'blob' })
  }
  uploadPicture(v_id, body){
    return this.fetchPromise('put', `picture/${v_id}`, body)
  }
  

  private fetchPromise(method, uri, headers?, body?){
    if(body) return this.http[method](`${this.basic_url}${uri}`, (body))
    return this.http[method](`${this.basic_url}${uri}`, headers)
  }
}
