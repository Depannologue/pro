import {Component, provide} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {Camera} from 'ionic-native';
import {TimerWrapper} from '@angular/core/src/facade/async';
import {SocketIoService} from './services/socket-io.service';
import {Http} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers:[SocketIoService]
})

export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform, private auth: AuthService) {
    this.rootPage = TabsPage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
    console.log(this.auth.user);

  }

}

ionicBootstrap(MyApp, [
  provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({noJwtError: true}), http);
    },
    deps: [Http]
  }),
  AuthService
])
