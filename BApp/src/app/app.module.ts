import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Authentication
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { GooglePlus } from '@ionic-native/google-plus/ngx'

//Requirements
import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

//Services
import { HttpClientModule } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyBu4nLX9UgqjU-3xLLQpXABr2OaggDyqgQ",
  authDomain: "bancoalimentar-1991.firebaseapp.com",
  databaseURL: "https://bancoalimentar-1991.firebaseio.com",
  projectId: "bancoalimentar-1991",
  storageBucket: "",
  messagingSenderId: "518579261265",
  appId: "1:518579261265:web:d88be0cae42b44a6"
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(), //Storage aka SharedPreferences
    AngularFireModule.initializeApp(firebaseConfig), //Google login
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GooglePlus,           //used to login with google
    BarcodeScanner,       //used to scan QR Codes
    LocalNotifications,   //used to send Notifications
    //Camera,             //used to access camera
    File,                 //used to upload file
    WebView,              //??
    FilePath
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
