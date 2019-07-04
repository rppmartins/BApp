import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = {};
 
  constructor() { }
 
  setData(id, data) {
    this.data[id] = data;
  }
 
  getData(id) {
    const return_data = this.data[id]
    if(return_data != undefined){
      delete this.data[id]

      return return_data
    }
    return ''
  }
}
