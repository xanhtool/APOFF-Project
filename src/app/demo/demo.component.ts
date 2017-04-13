import { Component, OnInit, NgZone } from '@angular/core';
import { FacebookService } from '../services/facebook.service';

declare var gapi: any;
// declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  public client: any;
  public Materialize: any;
  wtf = "Just warm, loading...";
  public loggedIn: boolean ;
  public content = [];
  token = 'EAACEdEose0cBANhmv5Ix3dmZC9db6wcrGDxBrJPESDvBd0o39q7GvKVhdo77O7bwZBdLSAbHQBpcqdTaiy5d0tfZBbZBNf4KZAZCggLkdHLQyxA4T7jHmknE9d8hfvWoBVyOSocOkfsZBaxQ8ZASyOwWoYEMK65FAMDD7sTZB4QOL4WHtZAlL2ZCrivTpvH40PiJYIZD';
  fanpageID = '1545725292369883';
  spreadsheetID = '1vUJZUMnCGPxynU9B_6mLpopF0k2giyh4B7FD6A0ZMcw';

  constructor(
    private ngZone: NgZone,
    private facebookService: FacebookService
   ){

  }

  ngOnInit() {
  }



  ngAfterViewInit() {
    console.info('after viewinit !')
    gapi.load('client:auth2', () => {
      console.log('loading gapi')
      this.client = gapi.client.init({
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
       clientId: "731057771960-tvdglt2iflc98e9cuoddpj7rc2qealjd.apps.googleusercontent.com",
       scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
      })
      .then( () => {
        console.log('let see this client',this.client)
        console.log("then...")
      // // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    });
  });
 }

  ngAfterViewCheck() {
    console.info('afterview check')
    Materialize.updateTextFields();
  }

  updateSigninStatus(isSignedIn) {
    console.log('calling update Signin Status', isSignedIn);
    if (isSignedIn) {
      console.log("signedIn from demo");
      this.ngZone.run( () => {
        this.loggedIn = true;
      });

      console.log("logging status", this.loggedIn);
      this.listMajors();
    } else {
      console.log("not sign-in yet");
      this.ngZone.run(() => {
        this.loggedIn = false;
      });
      // that.loggedIn = false;
      console.log("logging status", this.loggedIn);
    }
  };


  appendPre(message, time) {
   this.ngZone.run( () => {
     this.content.push([message,time]);
     this.wtf = "changed";
   });
  }



  /**
  *  Sign in the user upon button click.
  */
  handleAuthClick() {
    console.log("clicked loggIn button")
     gapi.auth2.getAuthInstance().signIn();
     console.log("logging status", this.loggedIn);
   };

   /**
    *  Sign out the user upon button click.
    */
  handleSignoutClick() {
    console.log("clicked loggedOut button")
     gapi.auth2.getAuthInstance().signOut();
     console.log("logging status", this.loggedIn);
   };

  listMajors() {
    console.log('calling google sheet');
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetID,
        range: 'Sheet1!A2:H',
      }).then((response) => {
        var range = response.result;
        console.log(range);

        if (range.values.length > 0) {
         for (let i = 0; i < range.values.length; i++) {
           var row = range.values[i];
           // Print columns A and E, which correspond to indices 0 and 4.
           this.appendPre(row[1] , this.convertTime(row[2],row[3],row[4],row[5],row[6],row[7]));
         }
       } else {
         console.error('No data found.');
       }
       })
      , (response) => {
        console.error('Error: ' + response.result.error.message);
      }
  };

  convertTime(year,month,day,hour,minute,second) {
    let date = new Date(year, month, day, hour, minute, second).getTime();
    return date/1000;
  }


  onSignIn(googleUser) {
  console.log(googleUser);
  };

  sendToFacebook() {
    console.log("content infomation", this.content)
    this.content.map((i) => {
      this.facebookService.sendSchedulePosts(this.fanpageID,this.token,i[0],i[1])
      .subscribe(res => {
        console.log(res);
      })
    })
  }

}
