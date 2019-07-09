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
    .catch(err => console.log('somethign went wrong getting google plus user...'))

    await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(loggedUser.idToken)
    ) 
    .catch(err => console.log('somethign went wrong authenticating google plus user...'))

    const user = {
      name : loggedUser.displayName,
      email : loggedUser.email,
      profile_url : loggedUser.imageUrl,
      service : 'google'
    }

    this.executeLogin(user)
  }

  async executeLogin(user){
    let route = 'form'

    const volunteer = await this.checkVolunteerExistence(user)
    const id = volunteer != undefined ? volunteer['id'] : null

    if(id != null && isNumber(id) && id >= 0){

      user['id'] = id
      this.storage.set('user', user)
      
      route = 'profile'
    }
    else {
      this.data.setData('user', user)
    }

    this.navigate(route)
  }

  checkVolunteerExistence(user){
    return this.http.fetchPromise('get', `volunteers/${user.email}?filter=Email`, '')
  }

  navigate(route){
    const routes = {
      'form' : '/form',
      'profile' : '/tabs/profile'
    }
    return this.router.navigate([routes[route]])
  }
  
  fakeLogin(){
    let user = {
      email : 'rppmartins1996@hotmail.com',
    }
    let route = 'form'

    const volunteer = this.checkExistence(user)
    const id = volunteer != undefined ? volunteer['id'] : null

    if(id != null && isNumber(id) && id >= 0){
      user['id'] = id
      this.storage.set('user', user)
      
      route = 'profile'
    }
    else {
      console.log(user)
      this.data.setData('user', user)
    }

    this.navigate(route)
  }
  checkExistence(user_info){
    return {id : 1}
  }

  /*
  async loginWithGoogle(){
    const loading = await this.loadingController.create({
      message: 'Where connecting you to Google...'
    });
    this.presentLoading(loading)

    this.google.login({
      'scopes': '',
      'webClientId': '534192712541-85pcfqgla352ebtdjfu2s3de0al85aep.apps.googleusercontent.com',
      'offline': true
    })
    .then(user => {
      loading.dismiss();

      this.nativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl,
        service: 'google'
      })
      .then(() =>{
        const user_info = {email: user.email, token : user.accessToken}

        if(this.checkVolunteerExistence(user_info)) this.navigateToProfilePage()
        else this.navigateToFormPage()
      }, 
      error =>{
        console.log(error);
      })

      loading.dismiss();
    }, 
    err =>{
      console.log(err)
      loading.dismiss();
    });
  }
  
  async loginWithFacebook(){
    const loading = await this.loadingController.create({
			message: 'Where connecting you to Facebook...'
		});
    
    this.presentLoading(loading);
    //let permissions = new Array<string>();    

    const permissions = ["public_profile", "email"];
    
    this.facebook.login(permissions)
    .then(response => {
      let user_id = response.authResponse.userID

      this.facebook.api("/me?fields=name,email", permissions)
      .then(user => {
        user.picture = "https://graph.facebook.com/" + user_id + "/picture?type=large"

        this.nativeStorage.setItem('user',{
          name: user.name,
          email: user.email,
          picture: user.picture,
          service: 'facebook'
        })
        .then(() => {
          this.navigateToProfilePage()
          loading.dismiss();
        },
        error => {
          console.log(error)
          loading.dismiss()
        })
      })
    },
    error => {
      console.log(error);
			loading.dismiss();
    })
  }
  */
}