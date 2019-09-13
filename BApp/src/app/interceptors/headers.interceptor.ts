import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { DataService } from '../services/data.service'

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private storage : Storage,
        private data : DataService,
        private toastController: ToastController
    ){}

    private outsider = 'http://api.ipma.pt/open-data/distrits-islands'

    intercept(request: HttpRequest<any>, next: HttpHandler){

        const split_url = request.url.split('/')
        const token = this.data.getData('token') //passar do serviço para storage

        debugger

        if(request.url == this.outsider) return next.handle(request)

        if (token != '') {
            request = request.clone({
                setHeaders: { 'Authorization' : token }
            })
            console.log(token)
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: { 'Content-Type': 'application/json' }
            })
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) console.log('event -> ', event)
                return event
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    if (error.error.success === false)  this.presentToast('Login failed')
                    else this.router.navigate(['/login'])
                }
                return throwError(error);
            })
        )
    }

    private async presentToast(msg) {
        const toast = await this.toastController.create({
          message: msg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
}