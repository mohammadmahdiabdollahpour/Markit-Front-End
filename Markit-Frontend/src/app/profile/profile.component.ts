import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@services';
import {Calendar, User} from '@models';
import {MatSnackBar} from '@angular/material';
import {UserService} from '@app/_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  image = '../../assets/images/user-logo.png'; // todo image should be replaced with image that server gives for each individual

  user: User;
  loading = false;

  constructor(private service: UserService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loading = true;

    this.service.getAll().subscribe((response) => {
      this.user = response as User;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  onUpdateProfile(uFirstName, uLastName, uEmail) {
    let updatedProfile: any = {};

    if (uFirstName !== this.user.firstName) {
      updatedProfile.firstName = uFirstName;
      // console.log(`uFirstName is: ${uFirstName}   userFirstName is: ${this.user.firstName}`);
    }
    if (uLastName !== this.user.lastName) {
      updatedProfile.lastName = uLastName;
      // console.log(`uFirstName is: ${uLastName}   userFirstName is: ${this.user.lastName}`);
    }
    if (uEmail !== this.user.email) {
      updatedProfile.email = uEmail;
      // console.log(`uFirstName is: ${uEmail}   userFirstName is: ${this.user.email}`);
    }

    console.log(`update profile data: ${updatedProfile}`);

    this.service.partialUpdate(updatedProfile)
      .subscribe((value: User) => {
          this.snackBar.open('User profile updated successfully!', 'Dismiss', {duration: 1000});
          // this.loading = false;

          console.log(value);
        }, err => {
          // this.loading = false;
          this.snackBar.open('User profile updating failed!', 'Dismiss', {duration: 1000});

          console.log(err);
        }
      );
  }
}
