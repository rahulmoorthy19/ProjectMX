import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: string = undefined;
  username: string = undefined;
  private authState: Observable<firebase.User>;
  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.authState = this.afAuth.authState;
    this.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userId = user.uid
        this.username = user.email
      } else {
        this.currentUser = null;
      }
    });
  }

  getAuthState() {
    return this.authState;
  }

  signUp(user: any, user_category: string) {
    firebase.auth().createUserWithEmailAndPassword(user.username, user.password)
    .then(res => {
      this.afAuth.auth.signInWithEmailAndPassword(user.username, user.password)
      .then(res => {
        if (this.userId && user_category == "Client") {
          return this.afs.collection('clients').doc(this.userId).set({name: user.name,email: this.username,bank_name : user.bank_name, stock_balance: user.stock_balance, id:user.id,client_uid: this.userId});
        }
        else if (this.userId && user_category == "Broker")
        {
          return this.afs.collection('brokers').doc(this.userId).set({name: user.name,email: this.username,bank_name : user.bank_name, stock_balance: user.stock_balance, id:user.id, blacklisted: false,broker_uid: this.userId});
        }
        else {
          return Promise.reject(new Error('No User Logged In!'));
        }
        })
      }
    )
    .catch(function(error) {
      // Handle Errors here.
    });
  }

  logIn(user: any) {
    this.afAuth.auth.signInWithEmailAndPassword(user.username, user.password)
    .then(res => console.log(res))
    .catch(function(error) {
      // Handle Errors here.
    });
  }

  logOut() {
    this.afAuth.auth.signOut();
  }

  googleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
