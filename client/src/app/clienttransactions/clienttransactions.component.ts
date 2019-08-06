import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-clienttransactions',
  templateUrl: './clienttransactions.component.html',
  styleUrls: ['./clienttransactions.component.css']
})
export class ClienttransactionsComponent implements OnInit {

  userid: string = undefined;
  transactions: Transaction[];
  constructor(private clientservice: ClientService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthState()
        .subscribe((user) => {
        if (user) {
          this.userid = user.uid;
          this.clientservice.getTransactions(this.userid)
            .subscribe(transactions => {
              this.transactions = transactions;
              console.log(this.transactions);
            })
          }
      });
  }

}
