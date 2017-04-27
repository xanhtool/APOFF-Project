import { Component, NgZone, OnInit } from '@angular/core';
import { Angulartics2GoogleTagManager  } from 'angulartics2';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

declare var $:any;
declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "Welcome to Quyền Anh's posting system!";
  logo = "XanhTool";
  pageName = "Facebook Schedule Posting System"

  profile;

  ngOnInit() {}

  constructor(
    // private authStateService: AuthStateService,
    private ngZone: NgZone,
    angulartics2GoogleTagManager : Angulartics2GoogleTagManager 
  ) {
    $(document).ready(function(){
      $('.collapsible').collapsible('show');
      $(".button-collapse").sideNav({
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
       draggable: true // Choose whether you can drag to open on touch screens
      });
      // $(".collapsible-header").css("line-height", "2.5rem");
        // $(".collapsible-header").css("padding", "1rem");
    });




  }

  /**
  *  Sign in the user upon button click.
  */
  signIn() {
     gapi.auth2.getAuthInstance().signIn();
   };

   /**
    *  Sign out the user upon button click.
    */
  signOut() {
     gapi.auth2.getAuthInstance().signOut();
   };

}
