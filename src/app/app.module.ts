import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Addition angular modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Additon Component
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PostingComponent } from './posting/posting.component';
// import {DialogComponent } from './about/dialog.component';
// import { LoginComponent } from './login/login.component';
// import { DemoComponent } from './demo/demo.component';
// import { TutorialComponent } from './tutorial/tutorial.component';

// Addition Modules
import { MaterialModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import { Angulartics2Module, Angulartics2GoogleTagManager  } from 'angulartics2';

// Addtition providers
// import  { GapiService } from './services/gapi.service';
// import { AuthStateService } from './services/auth-state.service';
// import { FacebookService } from './services/facebook.service';
import  { FbService } from './services/fb.service';
import { GgService } from './services/gg.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PostingComponent,
    // DialogComponent,
    // TutorialComponent,
    // LoginComponent,
    // DemoComponent,
  ],
  //  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    [MaterialModule.forRoot()],
    AppRoutingModule,
    Ng2PageScrollModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleTagManager  ])
  ],
  providers: [
    FbService,
    GgService,
    // GapiService,
    // AuthStateService,
    // FacebookService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
