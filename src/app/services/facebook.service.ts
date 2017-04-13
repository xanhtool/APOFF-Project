import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions } from '@angular/http';


@Injectable()
export class FacebookService {
  fanpageID;
  constructor(private http: Http) {  }

  sendSchedulePosts(fanpageID,token, message, time) {
    console.log("sending scheduled posts....")
    let apiUrl = 'https://graph.facebook.com/'+fanpageID+'/feed?';
    let payload = {
      access_token : token,
      published : false,
      message : message,
      scheduled_publish_time: time
    }
    console.log(payload)

    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(apiUrl, payload, options)
    .map((res) => res.json());


  }

}
