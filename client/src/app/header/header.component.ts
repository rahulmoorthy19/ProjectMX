import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import { User } from '../shared/user';
import { from } from 'rxjs';
import { UserService } from '../services/userservice.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user = {username: '', password: ''};
  user1 = {username: '', password: '', name: '',bank_name: '', stock_balance: 0, id: ''};
  users : User;
  user_category: string;
  username : string;
  userna : string;
  usern : boolean = false;
  userid: string;
  errMess: string;
  category: string;
  constructor(private authService: AuthService, private userservice: UserService) { }

  ngOnInit() {
    this.authService.getAuthState()
        .subscribe((user) => {
        if (user) {
          // User is signed in.
          this.username = user.displayName ? user.displayName : user.email;
          this.userna = this.username;
          this.usern = true;
          // alert('Welcome ' + this.username);
        } else {
          // alert('Wrong Password or Username');
          this.usern = false;
          this.username = undefined;
        }
      });
  }
  onSubmitlogin() {
    console.log('User: ', this.user);
    this.authService.logIn(this.user)
  }
  onSubmitsign() {
    var val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);
    if(this.user_category == "Client")
    {
      this.user1.id = "CLI" + val.toString();
    }
    else if(this.user_category == "Broker")
    {
      this.user1.id = "BRK" + val.toString();
    }
    console.log(this.user1.id);
    this.authService.signUp(this.user1, this.user_category);
  }
  googleLogin() {
    this.authService.googleLogin();
  }
  // info()
  // {
  //   this.authService.logIn(this.user1)
  //   setTimeout(() => {
  //     this.add()    
  //   }, 7000);
  // }
  // add()
  // {
  //     this.userservice.postUser(this.user1.name,this.user1.bank_name,this.user1.stock_balance,this.user_category);
  // }


  logOut() {
    this.username = undefined;
    this.authService.logOut();
  }

}
