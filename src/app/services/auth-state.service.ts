import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

declare var gapi:any;

@Injectable()

export class AuthStateService {

  profile$ = new BehaviorSubject("hello world");
  authState$ = new BehaviorSubject(false);
  authInstance$ = new BehaviorSubject(null);
  content=[];

  loader$:any = Observable.bindCallback(gapi.load); // bind callback by observable
  reLoader$ = this.loader$('client:auth2'); // get gapi interface from callback

  constructor(
    private ngZone: NgZone
  ) {}

    getAuthInstance(){
      return this.authInstance$;
    }

    getAuthState () {
        return this.authState$
    }

    getProfile () {
      return this.profile$
    }


  // loadAuth() {
  //   let authOptions  = {
  //     client_id: '731057771960-tvdglt2iflc98e9cuoddpj7rc2qealjd.apps.googleusercontent.com',
  //     cookiepolicy: 'single_host_origin',
  //     scope: 'profile email'
  //   };
  //
  //
  //   return this.reLoader$
  //  // .map(() => gapi.auth2)  //ready loader will call gapi.auth2
  //   .mergeMap(()) => Observable.fromPromise(gapi.auth2.init(authOptions)) ) // with gapi loader create login stream
  //   .do((googleAuth) => this.stateWatcher()) //watch any login status change except init first time
  //   .do((googleAuth) =>{
  //     this.authState$.next(googleAuth.isSignedIn.get());
  //     this.authInstance$.next(googleAuth);
  //   }) // emit init state.
  //   .mergeMap(googleAuth => this.authInstance$ ) // for first time load, first time init, we alway check authInstance.
  // }
  //
  // stateWatcher() {
  //   gapi.auth2.getAuthInstance().isSignedIn.listen(authState => {
  //     console.info('authState changed', authState);
  //     this.authState$.next(authState) // state change ? emit it!
  //     this.authInstance$.next(gapi.auth2.getAuthInstance()); // AuthInstance change ? emit it!
  // });
  // }

  // =============
  loadClient(spreadsheetId,sheetName="Sheet1",range="A2:H") {
    console.log(spreadsheetId,sheetName,range)
    let clientOptions = {
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
     clientId: "731057771960-tvdglt2iflc98e9cuoddpj7rc2qealjd.apps.googleusercontent.com",
     scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
    }

    // let valueOptions = {
    //     spreadsheetId: '1vUJZUMnCGPxynU9B_6mLpopF0k2giyh4B7FD6A0ZMcw',
    //     range: 'Sheet1!A2:H',
    //   }

    let valueOptions = {
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!${range}`,
      }

    return this.reLoader$
    .mergeMap(loader =>Observable.fromPromise(gapi.client.init(clientOptions))) // with gapi loader create client stream from promise
    .map(() => gapi.client.sheets.spreadsheets)  //ready client stream with googlespreetsheet
    // .do(() => console.log("auth with spreadsheet", gapi.auth2.getAuthInstance()))
    .mergeMap(spreadsheets => Observable.fromPromise(spreadsheets.values.get(valueOptions))) // from spreadsheets create stream values
    .map(res => {
      return res.result.values
    }) // map result response to rows
    .flatMap(rows => rows) // take single observer(rows) and transform to list of rows ( 1 => n)
    .map(row => {
      return  this.createTableRow(
        row[0],
        row[1],
        this.convertTime(row[2],row[3],row[4],row[5],row[6],row[7]))
    })
    .toArray()


  }

  createTableRow(id?,message?, time?) {
   return {id,message, time}
  }

  convertTime(year?,month?,day?,hour?,minute?,second?) {
    let date = new Date(year, month, day, hour, minute, second).getTime();
    return date/1000;
  }

}
