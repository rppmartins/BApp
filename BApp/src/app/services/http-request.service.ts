import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http : HttpClient) { }

  private tries = 3

  private basic_url = 'https://bagv-test.azurewebsites.net/api/'
  private api_key = ''

  private cities_url = 'http://api.ipma.pt/open-data/distrits-islands.json'

  fetchPromise(method, uri, body){
    
    console.log(uri)

    return this.http[method](`${this.basic_url}${uri}`, body).toPromise()
      .then(res => {
        this.tries = 3
        return res
      })
      .catch(err => {
        if(this.tries > 0) {
          this.tries -= 1
          this.fetchPromise(method, uri, body)
        }
        else console.log('something went wrong resolving fetch...')
      })
  }

  fetchCitiesPromise(){
      return this.http.get(this.cities_url).toPromise()
  }
}
