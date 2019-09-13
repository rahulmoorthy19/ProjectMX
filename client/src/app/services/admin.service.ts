import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { User } from '../shared/user'
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../shared/transaction';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  userId: string = undefined;
  username: string = undefined;s
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
    getAdmin(): Observable<any> {
      return this.afs.doc('admin/' + this.userId).snapshotChanges()
      .pipe(map(action => {
          const data = action.payload.data() as any;
          const _id = action.payload.id;
          return { _id, ...data };
        }));
    }
    postthreshold(time: number, profit: number) 
    {
      console.log(this.userId)
      return this.afs.collection('admin').doc(this.userId).update({threshold_time: time, threshold_profit: profit});

    }
    getBrokers(): Observable<any>
    {
      return this.afs.collection('blacklist').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as any;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        });
      }));
    }
    getGraphs(id:string): Observable<any>
    {
      return this.afs.doc('blacklist/' + id).snapshotChanges()
      .pipe(map(action => {
          const data = action.payload.data() as any;
          const _id = action.payload.id;
          return { _id, ...data };
      }));
    }
    blacklist(id: string)
    {
      return this.afs.collection('brokers').doc(id).update({blacklisted: true});
    }
    getBroker(id: string): Observable<any>
    {
      return this.afs.collection<User>('brokers', ref => ref.where('id', '==', id)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        })[0];
      }));
    }
    deleteBroker(id:string)
    {
      return this.afs.collection('blacklist').doc(id).delete();
    }
}
