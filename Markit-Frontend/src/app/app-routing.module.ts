import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import {CalendarsComponent} from '@app/calendars/calendars.component';
import {NewCalendarComponent} from '@app/new-calendar/new-calendar.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'calendars', component: CalendarsComponent},
  { path: 'calendars/create/', component: NewCalendarComponent},
  // { path: 'calendars/:id۰', component: PostsComponent}
  // { path: 'calendars/:id/create', component: NewPostComponent}

  // { path: 'no-access', component: }

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
