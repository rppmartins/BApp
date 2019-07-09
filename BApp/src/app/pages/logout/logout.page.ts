import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage'

import { AngularFireAuth } from 'angularfire2/auth'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
//import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-logout',
  templateUrl: 'logout.page.html',
  styleUrls: ['logout.page.scss']
})
export class LogoutPage {
  constructor(
    private router: Router, 
    private alertController: AlertController,
    private storage : Storage,

    private afAuth : AngularFireAuth,
    private google : GooglePlus,
    //private facebook : Facebook
  )
  {}

  ionViewWillEnter(){
    this.showLogoutConfirmationAlert()
  }

  async showLogoutConfirmationAlert(){

    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Tem a certeza que quer terminar sessão?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            this.navigateToProfilePage()
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.executeLogout()
          }
        }
      ],
      //mode: 'ios'
    });

    await alert.present();
  }

  async executeLogout(){
    await this.storage.get('user')
      .then(user => {
        if(user.service == 'google'){
          this.afAuth.auth.signOut()
          this.google.logout()
        }
      })
      
      this.storage.remove('user')
      this.navigateToLoginPage()
  }
  
  navigateToLoginPage() { this.router.navigate(['/login']) }
  navigateToProfilePage() { this.router.navigate(['/tabs/profile']) }

}

/*
    this.nativeStorage.getItem('user').then( user => {
      
      if(user.service == 'google'){

        this.google.logout()
        .then(res => {
          this.nativeStorage.remove('user');
          this.navigateToLoginPage()
        },
        err => console.log(err)
        )
      }
      else if(user.service == 'facebook'){
        
        this.facebook.logout()
        .then(res =>{
          this.nativeStorage.remove('user');
          this.navigateToLoginPage();
        }, 
        error => console.log(error)
        )
      }
    })
    */
