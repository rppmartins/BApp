import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http : HttpClient) { }

  private basic_url = 'https://bagv-test.azurewebsites.net/api/'
  private api_key = ''

  private cities_url = 'http://api.ipma.pt/open-data/distrits-islands.json'

  fetchPromise(method, uri, body){
    return this.http[method](`${this.basic_url}${uri}`, body).toPromise()
  }

  fetchCitiesPromise(){
      return this.http.get(this.cities_url).toPromise()
  }
}
