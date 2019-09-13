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
export class BrokerService {
  userId: string = undefined;
  username: string = undefined;s
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

    getTransactions(userid: string): Observable<Transaction[]> {
      console.log(userid)
        return this.afs.collection<Transaction>('transactions', ref => ref.where('broker_id', '==', userid).where('status', '==', 'pending')).snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Transaction;
            const _id = action.payload.doc.id;
            return { _id, ...data };
          });
        }));
    }
    getPrevTransactions(userid: string): Observable<Transaction[]> {
      return this.afs.collection<Transaction>('transactions', ref => ref.where('broker_id', '==', userid).where('status', '==', 'executed')).snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Transaction;
            const _id = action.payload.doc.id;
            return { _id, ...data };
          });
      }));
    }
    postTransaction(broker_id: string, amount: number,type: string,id: string,client_id: string,product_id: string,id1: string)
    {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      return this.http.post(baseURL + 'transactions',{'tid': id,'broker_id': broker_id,'quantity': amount,'type': type,'status': "pending",'client_id': client_id,'transaction_type': "P",'product_id': "PRID001",time_stamp: timestamp,'broker_uid': id1,'client_uid': id1})
      .pipe(catchError(error => this.processHTTPMsgService.handleError(error)));
    }
    postTransactionClient(broker_id: string, amount: number,type: string,id: string,client_id: string,product_id: string,cuid: string,buid: string)
    {
      var tr: string;
      if(broker_id == client_id)
      {
        tr = "P";
      }
      else
      {
        tr = "C";
      }
      return this.http.post(baseURL + 'execute',{'order_id': id,'tid': id,'broker_id': broker_id,'quantity': amount,'type': type,'status': "executed",'client_id': client_id,'transaction_type': tr,'product_id': "PRID001", 'client_uid': cuid, 'broker_uid': buid})
      .pipe(catchError(error => this.processHTTPMsgService.handleError(error)));
    }
    getClientId(id: string): Observable<User>
    {
      return this.afs.collection<User>('clients', ref => ref.where('id', '==', id)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const _id = action.payload.doc.id;
          return { _id, ...data };
        })[0];
      }));
    }
    // putTransaction(user: User) {
    //   if (this.userId) {
    //     return this.afs.collection('transactions').doc(id).update({status: "Executed"});
    //   } else {
    //     return Promise.reject(new Error('No User Logged In!'));
    //   }
    // }
    getBroker(): Observable<User> {
      return this.afs.doc<User>('brokers/' + this.userId).snapshotChanges()
      .pipe(map(action => {
          const data = action.payload.data() as User;
          const _id = action.payload.id;
          return { _id, ...data };
        }));
    } 
    putBroker(uid: string,amt: number,type: string) 
    {
      return this.http.put(baseURL + 'updates',{'uid': uid,'amt': amt,'type': type})
    }

}
