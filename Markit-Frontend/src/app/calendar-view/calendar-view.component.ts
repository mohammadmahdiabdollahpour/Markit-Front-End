import { Component, OnInit } from '@angular/core';
import { Calendar, Post } from '@models';
import { PostService, CalendarService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  allCalendars: Calendar[];
  calendar: Calendar;
  calendarId: number;
  calendarName;
  loading = false;
  returnUrl = `calendars/${this.calendarId}/posts`;
  selectedCalendar: Calendar;
  dataSource: Post[]; // data source is posts
  collaborators;
  moreThanFour = false;
  posts;

  isInTrueDate(date1: Date, date2): boolean {
    const date = new Date(date2);
    return date1.getDate() === date.getDate()
        && date1.getMonth() === date.getMonth()
        && date1.getFullYear() === date.getFullYear();
  }

  constructor(private postService: PostService,
              private calendarService: CalendarService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.collaborators = [
      {
        name: 'test1',
        role: 'Manager'
      },
      {
        name: 'test2',
        role: 'Editor'
      },
      {
        name: 'test3',
        role: 'Owner'
      },
      {
        name: 'test4',
        role: 'Viewer'
      },
    ];
  }

  get isTwitterConnected() {
    return this.calendar ? this.calendar.connectedPlatforms.split('/').includes('Twitter') : false;
  }

  ngOnInit() {
    this.loading = true;

    this.route.paramMap.subscribe(params => {
      this.calendarId = +params.get('calendarId');
      // console.log(this.calendarId);

      this.calendarService.get(this.calendarId).subscribe(value => {
        // console.log('post list view calendar service 1', value);
        this.calendar = value as Calendar;
        this.calendarName = (value as Calendar).name;
      }, err => {
        console.log('post list view calendar service error', err);
        this.loading = false;
      });

      this.postService.getCalendarPosts(this.calendarId)
        .subscribe(postResponse => {
          // console.log('post list view calendar service 2', postResponse);
          this.posts = postResponse as Post[];
          // console.log(this.dataSource);
          this.loading = false;
        });
    }, err => {
      console.log('post list view post service error', err);
      this.loading = false;
    });

    this.calendarService.getAll().subscribe((allCalendarsResponse) => {
      this.allCalendars = allCalendarsResponse as Calendar[];
      // this.calendar = this.allCalendars.filter(v => v.id === this.calendarId)[0];
      // console.log('calendar is now this:', this.calendarId, this.calendar.name);
    }, err => {
      console.log(err);
    });
  }

  deleteCalendar() {
    this.calendarService.delete(this.calendarId).subscribe(response => {
      console.log(response);
      this.snackBar.open('Calendar has been deleted successfully!', 'Dismiss', {duration: 2000});
      this.router.navigate(['/']);
    }, err => {
      console.log(err);
      this.snackBar.open('Failed to delete calendar!', 'Dismiss', {duration: 2000});
    });
  }

}
