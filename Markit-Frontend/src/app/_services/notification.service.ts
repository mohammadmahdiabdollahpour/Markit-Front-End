import { Injectable } from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {Notification} from '@models';
import {AuthenticationService} from '@app/_services/auth.service';
import {from, Observable, of, BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  ws = webSocket('');
  notifs: Notification[] = [
  ];

  notifsSubject: BehaviorSubject<Notification[]>;

  private seenEndpoint = `${environment.apiUrl}notification/seen/`;

  constructor(private authService: AuthenticationService,
              private http: HttpClient) {
    this.notifsSubject = new BehaviorSubject<Notification[]>(this.notifs);

    const wsUrl = `ws://194.5.193.99:8000/ws/notification/${this.authService.currentUserValue.key}/`;
    this.ws = webSocket(wsUrl);
    this.ws.pipe(
      filter((d: Notification) => d.additionalData.notif_creator !== this.authService.currentUserValue.email)
    ).subscribe((d: Notification) => {
      const nf = this.notifsSubject.getValue();
      nf.push(d);
      this.notifsSubject.next(nf);
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifsSubject.asObservable();
  }

  seenNotification(notifId: number): void {
    this.http.post(`${this.seenEndpoint}${notifId}/`, { }).subscribe(d => {
      const nf = this.notifsSubject.getValue();
      nf.splice(nf.findIndex(n => n.id === notifId), 1);
      this.notifsSubject.next(nf);
    });
  }
}
