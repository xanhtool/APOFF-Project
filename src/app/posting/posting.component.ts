import { Component, OnInit, NgZone } from '@angular/core';

import { Angulartics2 } from 'angulartics2';

import { FbService } from '../services/fb.service';
import { GgService } from '../services/gg.service'
import {MdSnackBar} from '@angular/material';

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'app-posting',
  templateUrl: './posting.component.html',
  styleUrls: ['./posting.component.scss']
})
export class PostingComponent implements OnInit {
  fanpageLoading: boolean;
  userToken: string;
  content = [];
  contentImages = [];
  selectedFanpage: any;
  shit ="ahihi";
  loading: any;
  fbModel = {fanpageUrl:""};
  ggModel = {spreadsheetId:""};
  ggModelImages = {spreadsheetId:""};
  status = {};
  fanpageName: string;
  fanpageList:any;
  totalMessagesNumber: any = 0;
  totalMessageImagesNumber: any = 0;
  imageMode:boolean = false;

  ngAfterViewCheck() {
    Materialize.updateTextFields();
  }

  ngOnInit() {
  }

  constructor(
    // private authStateService: AuthStateService,
    private ngZone: NgZone,
    private fbService: FbService,
    private ggService: GgService,
    public snackBar: MdSnackBar,
    private angulartics2: Angulartics2
  ) {
    // update text field
    $(document).ready(function() {
       Materialize.updateTextFields();
      //  $('select').material_select();
    });
    // facebook watcher
    this.fbService.getLoginStatus().subscribe((res)=>{
      console.log('is fb login?', res)
      if (res && res.status == 'connected') {
        this.status['fbStatus'] = 'checked';
        this.getFanpage()
      } else this.status['fbStatus'] = 'unchecked';
    })

    // google watcher
    this.ggService.getLoginStatus().subscribe(res => {
      // console.log(`is gg login ?`,res);
      if (res == true) {
        this.ngZone.run(() => this.status['ggStatus'] = 'checked');
      } else this.status['ggStatus'] = 'unchecked';


    })

  }

  change(event){
    if (event == '1') {
      this.imageMode = true;
      //Track: chế độ đăng bài
      this.angulartics2.eventTrack.next({ action: 'Chọn chế độ', properties: { category: 'Chế độ đăng bài', label: 'Đăng bài kèm ảnh' }});
    }
    else this.imageMode = false;

  }


  checkSheet(ggModel){
    //Track: chế độ đăng bài
    if(this.imageMode == false) {
      this.angulartics2.eventTrack.next({ action: 'Chọn chế độ', properties: { category: 'Chế độ đăng bài', label: 'Đăng bài thông thường' }});
    }

    if(ggModel.spreadsheetId && ggModel.spreadsheetId.length > 0) {
      this.loading = true;
      if (ggModel.spreadsheetId.includes("https://docs.google.com/")) ggModel.spreadsheetId = ggModel.spreadsheetId.split('/')[5]; // select only spreaedsheet ID
      else ggModel.spreadsheetId = ggModel.spreadsheetId
      // this.ggService.getSheetId(ggModel)
      this.ggService.totalMessages().subscribe(number => {
        this.ngZone.run(()=>{
          this.totalMessagesNumber = number;
        })
      })

      this.ggService.loadSheet(ggModel)
      .subscribe(res=>{
      this.ngZone.run(() =>{
        this.content = res;

        this.loading = false;
        console.info(`valid data ${this.content.length}/${this.totalMessagesNumber}`)
        this.snackBar.open('Sync data successfuly from google SpreadSheet', '', {
          duration: 3000
        });
      })
    },(err) =>{
      this.ngZone.run(() =>{
        this.loading = false;
        if (err.result && err.result.error.code == 403)   this.snackBar.open('You need to login your google account', '', {
            duration: 3000
          });
        else if (err.result)   this.snackBar.open(err.result.error.message, '', {
            duration: 3000
          });
        else    this.snackBar.open(err, '', {
            duration: 3000
          });
      })
    })
    }
  }

  totalMessagesSentToFacebook:any;

  sendToFacebook(fbModel){
    this.fbService.sendPosts(this.content,this.selectedFanpage,fbModel)
    .subscribe((res) => {
      console.log("content",res);
      this.content.map(post => {
        post['status'] = res['status']
      })
      this.fbService.totalSentMessagesNumber().subscribe(res=> {
        console.log("total",res);
        this.ngZone.run(() =>{
          this.totalMessagesSentToFacebook = res;
          //TRACK: totalMessagesSentToFacebook:
          this.ggService.getUserProfile().subscribe((res) =>{
            this.angulartics2.eventTrack.next(
              {
                action: 'Gửi bài viết',
                properties: { category: res.U3, label: 'Số bài viết đã gửi' }
              }
            );
          });
          // ENDTRACK
        })
      })
    })

  }

  loginFB(){
    this.fbService.loginFB().subscribe(res=>{
      console.log('login info',res)
    });

  }

  logoutFB(){
    this.status['fbStatus'] = null
    this.fbService.logoutFB().subscribe();
  }

  loginGG() {
    this.ggService.loginGG();
  }

  syncFanpage(fbModel?) {
    // console.log(fbModel.fanpageUrl.length)
    if(fbModel.fanpageUrl.length > 0) this.fbService.syncFanpage(fbModel.fanpageUrl).subscribe(res => {
      // console.log(res)
      this.fanpageName = res.name
      this.fbModel['fanpageID'] = res.id
      if (res.name) this.status['fanpageID'] = 'checked';

    });
  }

  getFanpage() {
    console.log('get fanpage')
    // if (this.userToken && this.userToken != '') {
    this.fanpageLoading = true;
    this.fbService.fanpageList()
    .subscribe(res => {
      console.info('what the fucking is',this.selectedFanpage)
      console.log("the response from Observer fanpageList",res)
      this.fanpageLoading = false;
      this.ngZone.run(()=>{
        console.log("object?",typeof(res),res)
        this.fanpageList = res;
        console.log(this.fanpageList);
      })
    })

    // }
  }

  filterContent(list){
    let now = new Date();
    let filteredList = list.filter((x) => {
      let selectedTime = new Date(x.timestamp*1000);
      let minTime = new Date(now);
      let MaxTime = new Date(now);
      minTime.setMinutes(now.getMinutes() + 10);
      MaxTime.setMonth(now.getMonth() + 6);
      // d1 = new Date (),
      // d2 = new Date ( d1 );
      // d2.setMinutes ( d1.getMinutes() + 30 );


      if (minTime < selectedTime && selectedTime < MaxTime) {
        console.log(minTime,selectedTime,MaxTime)
        return x;
      };
    })
    return filteredList;
  }

  checkSheetImages(ggModelImages){

    if(ggModelImages.spreadsheetId && ggModelImages.spreadsheetId.length > 0) {
      this.loading = true;
      if (ggModelImages.spreadsheetId.includes("https://docs.google.com/")) ggModelImages.spreadsheetId = ggModelImages.spreadsheetId.split('/')[5]; // select only spreaedsheet ID
      else ggModelImages.spreadsheetId = ggModelImages.spreadsheetId
      this.ggService.totalImages().subscribe(number => {
        this.ngZone.run(()=>{
          this.totalMessageImagesNumber = number;
        })
      })

      this.ggService.loadSheetImages(ggModelImages)
      .subscribe(res=>{
      this.ngZone.run(() =>{
        this.contentImages = res;
        this.loading = false;
        console.info(`valid data ${this.contentImages.length}/${this.totalMessageImagesNumber}`)
        this.snackBar.open('Sync data successfuly from google SpreadSheet', '', {
          duration: 3000
        });
      })
    },(err) =>{
      this.ngZone.run(() =>{
        this.loading = false;
        if (err.result && err.result.error.code == 403)   this.snackBar.open('You need to login your google account', '', {
            duration: 3000
          });
        else if (err.result)   this.snackBar.open(err.result.error.message, '', {
            duration: 3000
          });
        else    this.snackBar.open(err, '', {
            duration: 3000
          });
      })
    })
    }
  }

  totalImagesSentToFacebook:any;

  sendImagesToFacebook(fbModel){
    this.fbService.sendImagePosts(this.contentImages,this.selectedFanpage,fbModel)
    .subscribe((res) => {
      console.log("content",res);
      this.contentImages.map(post => {
        post['status'] = res['status']
      })
      this.fbService.totalSentImagesNumber().subscribe(res=> {
        console.log("total",res);
        this.ngZone.run(() =>{
          this.totalImagesSentToFacebook = res;
        })
      })
    })

  }


}
