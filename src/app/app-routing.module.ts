import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PostingComponent } from './posting/posting.component';
// import { DemoComponent } from './demo/demo.component';
// import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  {path:'',
    component: HomeComponent},
  {path:'about',
    component: AboutComponent},
  {path:'posting',
  component: PostingComponent},
  // {path:'demo',
  //   component: DemoComponent},
  {path:'**',
    component:HomeComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
  })

  export class AppRoutingModule {}
