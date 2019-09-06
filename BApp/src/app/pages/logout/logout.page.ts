import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage'

import { AngularFireAuth } from 'angularfire2/auth'
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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
    private google : GooglePlus
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
      ]
    });

    await alert.present();
  }

  async executeLogout(){
    await this.storage.get('user')
      .then(user => {
        console.log(user)
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
