import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { User } from '../shared/user';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: string = undefined;
  username: string = undefined;
  constructor(private afs: AngularFirestore,
    private authService: AuthService) { 
      this.authService.getAuthState()
      .subscribe((user) => {
        if (user) {    
          this.userId = user.uid;
          this.username = user.email;   
        } else {
        }
      });
    }
}
