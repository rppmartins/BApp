import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service'
import { HttpRequestService } from '../../services/http-request.service'
import { isNumber } from 'util';

import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth'
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {

  constructor(
    private router: Router,
    private platform : Platform,
    private loadingController : LoadingController,
    private alertController : AlertController,
    private http : HttpRequestService,
    private storage : Storage,
    private data : DataService,

    private afAuth : AngularFireAuth, 
    private google : GooglePlus,
  )
  {}

  async loginWithGoogle(){

    const loggedUser = await this.google.login({
      'webClientId' : '518579261265-ggj6b72t0penj2n2k1frrs9pvd1faojt.apps.googleusercontent.com',
      'offline' : true,
      'scopes' : 'profile email'
    })
    .catch(err => console.log('something went wrong getting google plus user...'))

    await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(loggedUser.idToken)
    ) 
    .catch(err => console.log('something went wrong authenticating google plus user...'))

    const user = {
      name : loggedUser.displayName,
      email : loggedUser.email,
      profile_url : loggedUser.imageUrl,
      service : 'google'
    }

    this.executeLogin(user)
  }

  async executeLogin(user){
    debugger

    let route = 'form'

    await this.apiLogin(user.email)

    debugger
    
    const volunteer = await this.tryGetVolunteer(user.email)
    const user_id = volunteer != undefined ? volunteer['Id'] : null

    debugger

    if(user_id != null && isNumber(user_id) && user_id >= 0){
      user['id'] = user_id
      this.storage.set('user', user)
      
      route = 'profile'
    }
    else {
      console.log(user)
      this.data.setData('user', user)
    }

    this.navigate(route)
  }

  apiLogin(email){
    return this.http.login({'Email' : email})
      .then(token => this.data.setData('token', `Bearer ${token}`))
      .catch(err => {
        console.log(err)
        this.navigate('login')
      })
  }

  tryGetVolunteer(user_email){
    return this.http.getVolunteer(user_email, 'Email')
  }

  navigate(route){
    const routes = {
      'form' : '/form',
      'profile' : '/tabs/profile',
      'login' : '/login'
    }
    return this.router.navigate([routes[route]])
  }
  
  async fakeLogin(){
    
    let user = {
      name : 'Rodrigo Martins',
      email : 'rppmartfghjbins1996@gmail.com', 
      profile_url : '',
      service : 'none'
    }

    this.executeLogin(user)
  }
}