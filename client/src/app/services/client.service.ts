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
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  userId: string = undefined;
  username: string = undefined;
  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { 
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
    postTransaction(broker_id: string, amount: number,type: string,id: string,client_id: string,product_id: string,broker_uid: string,client_uid: string)
    {
      console.log(broker_id,amount,type,id,client_id);
      return this.http.post(baseURL + 'transactions',{'tid': id,'broker_id': broker_id,'quantity': amount,'type': type,'status': "pending",'client_id': client_id,'transaction_type': "C",'product_id': "PRID001",'broker_uid': broker_uid,'client_uid': client_uid})
      .pipe(catchError(error => this.processHTTPMsgService.handleError(error)));
    }
    getBrokerId(id: string): Observable<User>
    {
      return this.afs.collection<User>('brokers', ref => ref.where('name', '==', id)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        })[0];
      }));
    }
    getBrokerIdd(id: string): Observable<User>
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
    getTransactions(userid: string): Observable<any[]> {
      console.log(userid)
        return this.afs.collection('transactions', ref => ref.where('client_id', '==', userid)).snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as any;
            const _id = action.payload.doc.id;
            return { _id, ...data };
          });
        }));
    }
    getProducts()
    {
      return this.afs.collection('products').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as any;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        });
      }));
    }
}
