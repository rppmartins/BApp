import { Component} from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private alertController : AlertController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage : Storage,
  ){
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
      .then(async () => {
      
        if(await this.checkLogin()){
          this.splashScreen.hide();
          this.navigateToProfilePage()
        }
        else{ 
          this.splashScreen.hide();
          this.navigateToLoginPage()
        }

        this.statusBar.hide()
        this.splashScreen.hide();
      })

      
      this.platform.backButton.subscribeWithPriority(999990,  async () => {

        const n_types = ['questionnaires', 'invitations', 'thanks']
        const n_tabs = ['trophies', 'scan', 'notifications']

        if(n_types.some(type => this.platform.url().includes(type))){
          this.navigateToNotificationsPage()
        }
        else if(n_tabs.some(tab => this.platform.url().includes(tab))){
          this.navigateToProfilePage()
        }
        else if(this.platform.url().includes('form')){
          this.navigateToLoginPage()
        }
        else this.showBackAlert()
      });
      
  }
  
  checkLogin(){
    return this.storage.get('user')
      .then(user => { return user != null })
      .catch(err => console.log('something went wrong getting v_id...'))
  }

  async showBackAlert(){
    const alert = await this.alertController.create({
      header: 'Sair',
      message: 'Tem a certeza que quer sair?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            //
          }
        },
        {
          text: 'Sim',
          handler: () => {
            navigator['app'].exitApp()
          }
        }
      ]
    });
  
    await alert.present();
  }

  navigateToLoginPage() { this.router.navigate(['/login']) }
  navigateToProfilePage() { this.router.navigate(['/tabs/profile']) }
  navigateToNotificationsPage() { this.router.navigate(['/notifications']) }
}
