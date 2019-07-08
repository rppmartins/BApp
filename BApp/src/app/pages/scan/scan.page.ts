import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { HttpRequestService } from '../../services/http-request.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  constructor(
    private router : Router,
    private platform : Platform,
    private storage : Storage,
    private qrScanner: BarcodeScanner, 
    private alertController: AlertController,
    private localNotifications: LocalNotifications,
    private request : HttpRequestService
  ){}

  private v_id

  async ngOnInit(){
    await this.storage.get('user')
      .then(user => this.v_id = user.id)
  }

  ionViewWillEnter(){
    this.scanCode(); 
  }

  betaScan(){
    const campaign_info_str = `{ 
      "ba_indentifier": "https://www.bancoalimentar.pt/", 
      "campaign_id": 2, "campaign_name": "Lisboa 18/19" 
    }`

    const campaign_info = JSON.parse(campaign_info_str)

    if(campaign_info.ba_indentifier != undefined){ 
      this.presentConfimationAlert(campaign_info.campaign_id, campaign_info.campaign_name)
    }
    else this.presentErrorAlert()
  }
  
  scanCode(){
    this.qrScanner.scan()
      .then(qrData => {
        if(qrData.text != ''){
          try {
            const campaign_info = JSON.parse(qrData.text)
    
            if(campaign_info.ba_indentifier != undefined){ 
              this.presentConfimationAlert(
                campaign_info.campaign_id, campaign_info.campaign_name)
            }
          } 
          catch (error) { this.presentErrorAlert() }
        }      
      })
  }

  async presentConfimationAlert(campaign_id, campaign_name) {
    const alert = await this.alertController.create({
      header: 'Check In',
      subHeader: 'Está prestes a participar numa campanha.',
      message: `Aceita participar na campanha ${campaign_name}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            this.scheduleNotification(
              'Participação Recusada', 'Você recusou participar nesta campanha.'
            )
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.checkIn(campaign_id)
              .then(_ => 
                this.scheduleNotification(
                  'Participação Aceite', 'A sua participação nesta campanha foi aceite.'
              ))
              .catch(err => console.log(err))
          }
        }
      ],
      mode: 'ios'
    });

    await alert.present();
  }

  async presentErrorAlert(){
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Erro de leitura.',
      message: `O código obtido não corresponde a uma campanha do Banco Alimentar!`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //
          }
        }
      ],
      mode: 'ios'
    })

    await alert.present();
  }

  scheduleNotification(title, text) {
    this.localNotifications.schedule({
      id: 1,
      title: title,
      text: text,
      trigger: { in: 2, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true // Show the notification while app is open
    });
  }

  checkIn(campaign_id){

    return this.request.fetchPromise(`post`, `volunteer/${this.v_id}/campaign/${campaign_id}`, '')
      .then(res => console.log(res))
      .catch(_ => console.log('something went wrong cheking in...'))
  }
}