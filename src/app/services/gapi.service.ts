import { Injectable } from '@angular/core';
import { AuthStateService } from './auth-state.service';


declare var gapi: any;

@Injectable()
export class GapiService {
  auth2:any;

  constructor(
    private authStateService: AuthStateService
  ) {

   }

  // this is simple authenticate version 1
  load() {
      console.log("start authentication at service...")
      this.auth2 = gapi.auth2.init({
        client_id: '731057771960-tvdglt2iflc98e9cuoddpj7rc2qealjd.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      return this.auth2;
  }

  load2() {
      // this.authStateService.loadAuth()

  }

}
