import { Injectable, NgZone } from '@angular/core';
import { Observable,  BehaviorSubject, Subject } from 'rxjs';
import { Http,Headers, RequestOptions } from '@angular/http';

declare var FB: any;

@Injectable()

export class FbService {
  sentImagesNumber$:any = new BehaviorSubject(0);
  sentMessagesNumber$:any = new BehaviorSubject(0);
  fanpageList$ = new Subject();
  loginStatus$ = new BehaviorSubject(null);
  loader$:any = Observable.bindCallback(FB.init);
  reloader$ = this.loader$({
    appId      : '1632085807093668',
    xfbml      : true,
    version    : 'v2.8',
    status: true,
  });

  constructor(
    private http:Http,
    private ngZone: NgZone
  ) {

    FB.init({
      appId      : '1632085807093668',
      xfbml      : true,
      version    : 'v2.8',
      status: true,
    })

    // FB.login();

    // FB.getLoginStatus(function(response){
    //   console.log('getLoginStatus',response)
    // });
    //
    // FB.Event.subscribe('auth.statusChange', function(response) {
    //     if(response.status == 'connected') {
    //         console.log("connected")
    //     }
    // });
    //
    // FB.Event.subscribe('auth.authResponseChange',res => console.log(res));
    // FB.Event.subscribe('auth.statusChange', res => console.log(res));

    FB.Event.subscribe('auth.statusChange', (res) => {
      console.log('auth status', res)
      this.loginStatus$.next(res)
      if(res.authResponse) {
        this.getFanpageList(res.authResponse.accessToken).subscribe(res =>{
          this.fanpageList$.next(res.data)
        })
      };
    });


  }

  loginFB(){
    let FBlogin$:any = Observable.bindCallback(FB.login);
     return FBlogin$(()=>{}, {scope:'publish_actions,manage_pages,publish_pages'});
  }

  logoutFB(){
    let FBlogout$:any = Observable.bindCallback(FB.logout);
     return FBlogout$();
  }

  syncFanpage(url) {
    let FBapi$:any = Observable.bindCallback(FB.api); // bind callback by
    return FBapi$(url)
  }

  getLoginStatus() {
    return this.loginStatus$;
  }

  sendImagePosts(listPost,fanpage,fbModel) {
    let apiUrl = 'https://graph.facebook.com/'+fanpage.id+'/photos?';
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    let sentImagesNumber = 0;
    //overide token
    if (fbModel.token) fanpage.access_token = fbModel.token;

    // return this.http.post(apiUrl, payload, options).map((res) => res.json())
    listPost.map(post => {
      let payload = {
        access_token : fanpage.access_token,
        published : false,
        caption : post.caption,
        url: post.imageUrl,
        scheduled_publish_time: post.timestamp
      }
      this.http.post(apiUrl, payload, options)
      .map((res) => res.json())
      .subscribe((res) => {
        // console.info("Đã gửi facebook thành công!",res);
        sentImagesNumber += 1;
        this.sentImagesNumber$.next(sentImagesNumber);
        post['status'] = {
          success: true,
          title:"Success",
          message:"Success Posted to Facebook",
          id: res.id
        }
      },
      (err) => {
        err = JSON.parse(err._body).error;
        // console.info("err",err)
        post['status'] = {
          success: false,
          title:err.type,
          message:err.message
        }
        // console.error('jsoned error body jsonpharse',err)
        // console.log(post.status)

      })
    })

    return Observable.from(listPost)
  }

  sendPosts(listPost,fanpage,fbModel) {
    // console.log("sending scheduled posts....")
    let apiUrl = 'https://graph.facebook.com/'+fanpage.id+'/feed?';
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    let sentMessagesNumber = 0;
    //overide token
    if (fbModel.token) fanpage.access_token = fbModel.token;

    // return this.http.post(apiUrl, payload, options).map((res) => res.json())
    listPost.map(post => {
      let payload = {
        access_token : fanpage.access_token,
        published : false,
        message : post.message,
        link: post.link,
        scheduled_publish_time: post.timestamp
      }
      this.http.post(apiUrl, payload, options)
      .map((res) => res.json())
      .subscribe((res) => {
        // console.info("Đã gửi facebook thành công!",res);
        sentMessagesNumber += 1;
        this.sentMessagesNumber$.next(sentMessagesNumber);
        post['status'] = {
          success: true,
          title:"Success",
          message:"Success Posted to Facebook",
          id: res.id
        }
      },
      (err) => {
        err = JSON.parse(err._body).error;
        post['status'] = {
          success: false,
          title:err.error_user_title,
          message:err.error_user_msg
        }
        // console.error('jsoned error body jsonpharse',err)
        // console.log(post.status)

      })
    })

    return Observable.from(listPost)
  }

  totalSentMessagesNumber() {
    return this.sentMessagesNumber$;
  }

  totalSentImagesNumber() {
    return this.sentImagesNumber$;
  }

  getFanpageList(token) {
      console.log("token",token)
      let apiUrl = 'https://graph.facebook.com/'+`me/accounts?access_token=${token}`;
      return this.http.get(apiUrl).map(res=> res.json())
  }

  fanpageList() {
    return this.fanpageList$;
  }

}
