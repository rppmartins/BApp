import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage : Storage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
      .then(async () => {
      
        if(await this.checkLogin()){
          this.navigateToProfilePage()
          this.splashScreen.hide();
        }
        else{ 
          this.navigateToLoginPage()
          this.splashScreen.hide();
        }

        this.statusBar.styleDefault();
        this.splashScreen.hide();
      })
  }
  
  checkLogin(){
    return this.storage.get('user')
      .then(user => { return user != null })
      .catch(err => console.log('something went wrong getting v_id...'))
  }

  navigateToLoginPage() { this.router.navigate(['/login']) }
  navigateToProfilePage() { this.router.navigate(['/tabs']) }
}
