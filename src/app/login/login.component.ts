import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { GapiService } from '../services/gapi.service';
import { AuthStateService } from '../services/auth-state.service';
declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth2: any;
  isSignedIn = null;
  isSignedIn2 = null;

  ngOnInit() {
  }


  constructor(
    private ngZone: NgZone,
    private gapiService: GapiService,
    private authStateService: AuthStateService
  ) {
      authStateService.getAuthState().subscribe(state =>{
        ngZone.run(() => {
          this.isSignedIn2 = state;
          console.log('isSingedIn2 ?', this.isSignedIn2);
        })
      });

 }


 ngAfterViewInit() {
  gapi.load('client:auth2',  () => {

    this.auth2 = this.gapiService.load();

    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': param => this.onSignIn(param)
    });
  });
 }

  onSignIn (googleUser) {
    this.ngZone.run(() => {
      this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      console.log('login status', this.isSignedIn)
    });
  // gapi.load('client:auth2', (response) => {
  //   console.log('let see gapi load client auth2 response', response)
  // }) || IT'S NOTHING !!!!!!!!!

  };

  handleSignoutClick() {
     gapi.auth2.getAuthInstance().signOut();
   };

}
