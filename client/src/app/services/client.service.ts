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
export class ClientService {
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
    getBrokers(): Observable<User[]> {
      return this.afs.collection<User>('brokers').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        });
      }));
    }
    getClient(): Observable<User> {
      return this.afs.doc<User>('clients/' + this.userId).snapshotChanges()
      .pipe(map(action => {
          const data = action.payload.data() as User;
          const _id = action.payload.id;
          return { _id, ...data };
        }));
    }
    postTransaction(bank_name: string, broker: string,broker_id: string, amount: number,type: string)
    {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      if (this.userId) {
        return this.afs.collection('transactions').add({userid: this.userId,user: this.username, bank_name: bank_name, broker: broker,broker_id: broker_id,amount: amount,type: type,status: "Requested", date: timestamp, detail: "New"});
      } else {
        return Promise.reject(new Error('No User Logged In!'));
      }
    }
    getBrokerId(name: string): Observable<User>
    {
      return this.afs.collection<User>('brokers', ref => ref.where('name', '==', name)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        })[0];
      }));
    }
    getTransactions(userid: string): Observable<Transaction[]> {
      console.log(userid)
        return this.afs.collection<Transaction>('transactions', ref => ref.where('userid', '==', userid).where('detail', '==', 'New')).snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Transaction;
            const _id = action.payload.doc.id;
            return { _id, ...data };
          });
        }));
    }
}
