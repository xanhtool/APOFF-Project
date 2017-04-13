import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

declare var gapi: any;
// declare var GoogleAuth:any;

@Injectable()
export class GgService {
  clientOptions = {
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
     clientId: "731057771960-tvdglt2iflc98e9cuoddpj7rc2qealjd.apps.googleusercontent.com",
     scope: "https://www.googleapis.com/auth/spreadsheets"
   };

   loader$:any = Observable.bindCallback(gapi.load); // bind callback by observable
   reLoader$ = this.loader$('client:auth2'); // get gapi interface from callback

   loginStatus$ = new BehaviorSubject(null);

   spreadsheetId:any;
   sheetId:any;
   messagesNumber$ = new Subject();
   imagesNumber$ = new Subject();

  constructor() {
    this.reLoader$
    .mergeMap(loader => Observable.fromPromise(gapi.client.init(this.clientOptions))) // with gapi loader create client stream from promise
    .do(() => this.loginStatus$.next(gapi.auth2.getAuthInstance().isSignedIn.get())) // emit the first state
    .do(() => gapi.auth2.getAuthInstance().isSignedIn.listen((res) => {
      console.log(res);
      this.loginStatus$.next(res);
    })) // watch signin or out status
    .subscribe((res) => {

    })
  }

  getLoginStatus() {
    return this.loginStatus$;
  }

  loginGG() {
    gapi.auth2.getAuthInstance().signIn();
  }

  loadSheet(model) {
    this.spreadsheetId = model.spreadsheetId;
    let valueOptions = {
        spreadsheetId: this.spreadsheetId,
        range:`${model.sheetName || 'Sheet1'}!${model.range || 'A2:H'}`,
      }

    // console.log(valueOptions)
    // console.log('is sheets undefined?', gapi.client.sheets)
    if (gapi.client.sheets) { // make sure GapiClientSheets actually ready

      let sheetValues$:any = Observable.fromPromise(gapi.client.sheets.spreadsheets.values.get(valueOptions));
      return sheetValues$
      .do(this.resetSheetRowColor())
      .map(res => res.result.values) // map result response to rows
      .do(x => this.messagesNumber$.next(x.length))
      .flatMap(rows => rows) // take single observer(rows) and transform to list of rows ( 1 => n)
      .map(row => this.createTableRow(
          row[0],
          row[1],
          row[2],
          row[3]+" "+row[4]+"/"+row[5]+"/"+row[6],
          this.convertTime(row[3],row[4],row[5],row[6]))
      )
      .filter(x => this.filterContent(x))
      .toArray()
      ;
    }

  }

  loadSheetImages(model) {
    this.spreadsheetId = model.spreadsheetId;
    let valueOptions = {
        spreadsheetId: this.spreadsheetId,
        range:`${model.sheetName || 'Sheet1'}!${model.range || 'A2:H'}`,
      }

    // console.log(valueOptions)
    // console.log('is sheets undefined?', gapi.client.sheets)
    if (gapi.client.sheets) { // make sure GapiClientSheets actually ready

      let sheetValues$:any = Observable.fromPromise(gapi.client.sheets.spreadsheets.values.get(valueOptions));
      return sheetValues$
      .do(this.resetSheetRowColor())
      .map(res => res.result.values) // map result response to rows
      .do(x => this.imagesNumber$.next(x.length))
      .flatMap(rows => rows) // take single observer(rows) and transform to list of rows ( 1 => n)
      .map(row => this.createTableImagesRow(
          row[0],
          row[1],
          row[2],
          row[3]+" "+row[4]+"/"+row[5]+"/"+row[6],
          this.convertTime(row[3],row[4],row[5],row[6]))
      )
      .filter(x => this.filterContent(x))
      .toArray()
      ;
    }

  }

  totalMessages() {
    return this.messagesNumber$;
  }

  totalImages() {
    return this.imagesNumber$;
  }


  createTableRow(id?,message?,link?, time?,timestamp?) {
   return {id,message,link, time,timestamp}
  }

  createTableImagesRow(id?,caption?,imageUrl?, time?,timestamp?) {
   return {id,caption,imageUrl, time,timestamp}
  }

  convertTime(time,day,month,year) {
    // console.log(`${time}/${day}/${month}/${year}`)
    let hour = time.split(":")[0]
    let minute = time.split(":")[1]
    let date = new Date(year, month-1, day, hour, minute).getTime();
    return date/1000;
  }

  getSheetId(){
    let sheetId$ = new Subject();
    var request = {
      // The spreadsheet to request.
      spreadsheetId: this.spreadsheetId,  // TODO: Update placeholder value.
      // The ranges to retrieve from the spreadsheet.
      ranges: ['A2:H'],  // TODO: Update placeholder value.
      // True if grid data should be returned.
      // This parameter is ignored if a field mask was set in the request.
      includeGridData: false,  // TODO: Update placeholder value.
    };

    gapi.client.sheets.spreadsheets
    .get(request)
    .execute((response) => {
            // console.log(response);
            // console.info(`sheetID: ${response.sheets[0].properties.sheetId}`)
            if (response.sheets) sheetId$.next(response.sheets[0].properties.sheetId)
            else sheetId$.next(response)

            // return response.sheets[0].properties.sheetId
          })
    return sheetId$;
  }

  changeSheetRowColor(spreadsheetId, rowIndex) {
    let requests = [];
    this.getSheetId().subscribe(sheetId => {
      // console.info("that shit",sheetId);
     requests.push({
       updateCells: {
         start: {sheetId: sheetId, rowIndex: rowIndex, columnIndex: 7},
         rows: [{
           values: [
             {
               userEnteredFormat: {
                 backgroundColor: {red: 1},
                 horizontalAlignment : "CENTER",
                 verticalAlignment: "MIDDLE",
                 textFormat: {
                   foregroundColor: {
                     "red": 1.0,
                     "green": 1.0,
                     "blue": 1.0
                   },
                   "fontSize": 12,
                   "bold": false
                 }
               },
               userEnteredValue: {stringValue:"Thời gian không hợp lệ" } // this will change current cell
           },
            //  {userEnteredValue: {stringValue:"Thời gian không hợp lệ" }} // this will going to the next cell
           ]
         }],
         fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,verticalAlignment,horizontalAlignment)'
       }
     })

     let batchUpdateRequest =  {requests: requests}

     gapi.client.sheets.spreadsheets
     .batchUpdate({
             spreadsheetId: this.spreadsheetId,
             resource: batchUpdateRequest
           })
     .execute((response) => {
            //  console.log(response);
             return response;
           })


    });


  }


  resetSheetRowColor() {
    let requests = [];
    this.getSheetId().subscribe(sheetId => {
      requests.push( {
        updateCells: {
          range: {
            sheetId: sheetId,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: 7,
            endColumnIndex: 8,
          },
          // start: {sheetId: sheetId, rowIndex: rowIndex, columnIndex: 6},
          rows: [{
            values: [
              {
                userEnteredFormat: {
                  backgroundColor: {
                    "red": 1,
                    "green": 1,
                    "blue": 1
                  },

                },
                userEnteredValue: {stringValue:" " }
            }]
          }],
          fields: 'userEnteredValue,userEnteredFormat.backgroundColor'
        }
       });
     let batchUpdateRequest =  {requests: requests}

     gapi.client.sheets.spreadsheets
     .batchUpdate({
             spreadsheetId: this.spreadsheetId,
             resource: batchUpdateRequest
           })
     .execute((response) => {
            //  console.log(response);
             return response;
           })
    });
  }



  filterContent(x){
    // console.log(x)
    let now = new Date();
    let selectedTime = new Date(x.timestamp*1000);
    let minTime = new Date(now);
    let MaxTime = new Date(now);

    minTime.setMinutes(now.getMinutes() + 10);
    MaxTime.setMonth(now.getMonth() + 6);

    if (minTime < selectedTime && selectedTime < MaxTime) {
      console.log(minTime,selectedTime,MaxTime)
      // this.changeSheetRowColor(this.spreadsheetId,x.id)
      return x;
    } else this.changeSheetRowColor(this.spreadsheetId,x.id);
  }

}
