// app/services/auth/auth.ts

import {Storage, LocalStorage} from 'ionic-angular';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable, NgZone,Output,
EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {User} from './user'
// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  @Output() change = new EventEmitter();

  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({clientID: 'S4DOqtyvY43iQkGuDWpiR9YQk6FvDm2g', domain: 'depannologue.eu.auth0.com'});
  lock = new Auth0Lock('S4DOqtyvY43iQkGuDWpiR9YQk6FvDm2g', 'depannologue.eu.auth0.com', {
    auth: {
      redirect: false,
      params: {
        scope: 'openid offline_access',
      }
    }
  });
  local: Storage = new Storage(LocalStorage);
  refreshSubscription: any;
  user: any;
  id_token: string
  zoneImpl: NgZone;

  constructor(private authHttp: AuthHttp, zone: NgZone) {
    this.zoneImpl = zone;
    // Check if there is a profile saved in local storage
    this.local.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });
    this.local.get('id_token').then(id_token => {
      this.id_token = id_token;
    }).catch(error => {
      console.log(error);
    });
    this.lock.on('authenticated', authResult => {
      this.local.set('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }
        profile.user_metadata = profile.user_metadata || {};
        this.local.set('profile', JSON.stringify(profile));
        this.local.set('depannologue_id', profile.user_metadata.depannologue_id)
        this.user = profile;
      });

      this.lock.hide();

      this.local.set('refresh_token', authResult.refreshToken);
      this.zoneImpl.run(() => this.user = authResult.profile);
    });

  }

  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
  }

  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
  }
}
