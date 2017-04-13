import { Component, OnInit } from '@angular/core';
import {MdDialog} from '@angular/material';
import {DialogComponent } from './dialog.component';

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
     $('.button-collapse').sideNav('show');
     $('.button-collapse').sideNav({
       closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
     });
     $(".fuck").click(function(){
               $(this).hide();
               });
    });
  }

  ngOnInit() {
  }



}
