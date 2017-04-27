import { Component, OnInit } from '@angular/core';
import {MdDialog} from '@angular/material';

declare var $:any;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  pageName = "Thông tin";
  constructor(
    public dialog: MdDialog
  ) {
   $(document).ready(function(){
     $('.materialboxed').materialbox();
     $('.collapsible').collapsible();
     $('.button-collapse').sideNav({
       closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
     });
    });
  }

  ngOnInit() {
  }

  reInitCollapsible() {
    console.log('reinit')
    $('.collapsible').collapsible()
  }



}
