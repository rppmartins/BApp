import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../services/data.service'
import { isNumber } from 'util';

//import { GooglePlus } from '@ionic-native/google-plus/ngx';
//import { Facebook } from '@ionic-native/facebook/ngx'

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
    private storage : Storage,
    private data : DataService,

    //private google : GooglePlus,
    //private facebook : Facebook
  )
  {}

  private subBackEvent

  FB_APP_ID = 2275465636046649;
  users = [
    {
      id : 1,
      email: "rppmartins1996@hotmail.com",
      //token: "trcyub5467yhb"
    }
  ]
  
  ngOnInit(){
    this.initBackButtonHandler()
  }

  ionViewWillLeave(){
    // Unregister the custom back button action for this page
    this.subBackEvent && this.subBackEvent();
  }

  initBackButtonHandler() {
    this.subBackEvent = this.platform.backButton.subscribe(999999,  () => {
        //alert("back pressed home" + this.constructor.name)
        navigator['app'].exitApp()
    })
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

  async presentLoading(loading) {
		return await loading.present();
  }

  fakeloginWithFacebook(){
    const user = {
      email : 'rppmartins1996@hotmail.com',
      //token : 'trcyub5467yhb'
    }
    this.fakeLogin(user)
  }
  fakeloginWithGoogle(){
    const user = {
      email : 'rppmartins1996@gmail.com',
      //token : 'trcyub5467yhb'
    }
    this.fakeLogin(user)
  }

  fakeLogin(form){
    let user = form
    let route = 'form'

    const volunteer = this.checkVolunteerExistence(user)
    const id = volunteer != undefined ? volunteer.id : null

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

  checkVolunteerExistence(user_info){
    return this.users.find(user => {
      return user.email == user_info.email
    })
  }

  navigate(route){
    const routes = {
      'form' : '/form',
      'profile' : '/tabs/profile'
    }

    return this.router.navigate([routes[route]])
  }
}