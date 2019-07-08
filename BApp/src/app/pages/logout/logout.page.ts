import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage'

//import { GooglePlus } from '@ionic-native/google-plus/ngx';
//import { Facebook } from '@ionic-native/facebook/ngx';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';

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

    //private google : GooglePlus,
    //private facebook : Facebook,
    //private nativeStorage : NativeStorage
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
      mode: 'ios'
    });

    await alert.present();
  }

  executeLogout(){
    this.storage.remove('user')
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
    this.navigateToLoginPage()
  }
  
  navigateToLoginPage() { this.router.navigate(['/login']) }
  navigateToProfilePage() { this.router.navigate(['/tabs']) }

}
