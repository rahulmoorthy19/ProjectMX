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
export class BrokerService {
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

    getTransactions(userid: string): Observable<Transaction[]> {
      console.log(userid)
        return this.afs.collection<Transaction>('transactions', ref => ref.where('broker_id', '==', userid).where('status', '==', "Requested")).snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Transaction;
            const _id = action.payload.doc.id;
            return { _id, ...data };
          });
        }));
    }
    postTransaction(bank_name: string, user: string,userid: string, amount: number,type: string)
    {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      if (this.userId) {
        return this.afs.collection('transactions').add({userid: userid,user: user, bank_name: bank_name, broker: this.username,broker_id: this.userId,amount: amount,type: type,status: "Executed", date: timestamp, detail: "Previous"});
      } else {
        return Promise.reject(new Error('No User Logged In!'));
      }
    }
    getClientId(name: string): Observable<User>
    {
      return this.afs.collection<User>('clients', ref => ref.where('email', '==', name)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        })[0];
      }));
    }
    putTransaction(id: string) {
      if (this.userId) {
        return this.afs.collection('transactions').doc(id).update({status: "Executed"});
      } else {
        return Promise.reject(new Error('No User Logged In!'));
      }
    }
    getBroker(): Observable<User> {
      return this.afs.doc<User>('brokers/' + this.userId).snapshotChanges()
      .pipe(map(action => {
          const data = action.payload.data() as User;
          const _id = action.payload.id;
          return { _id, ...data };
        }));
    }
}
