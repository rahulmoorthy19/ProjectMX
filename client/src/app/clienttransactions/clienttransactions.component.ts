import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';
import { AuthService } from '../services/auth.service';
import { BrokerService } from '../services/broker.service';

@Component({
  selector: 'app-clienttransactions',
  templateUrl: './clienttransactions.component.html',
  styleUrls: ['./clienttransactions.component.css']
})
export class ClienttransactionsComponent implements OnInit {

  userid: string = undefined;
  userId: string = undefined;
  transactions: any[];
  constructor(private clientservice: ClientService, private authService: AuthService,private brokerservice: BrokerService) { }

  ngOnInit() {
    this.authService.getAuthState()
        .subscribe((user) => {
        if (user) {
          this.userid = user.uid;
          this.clientservice.getClient()
          .subscribe(client => {
            this.userId = client.id;
            this.clientservice.getTransactions(this.userId)
            .subscribe(transactions => {
              this.transactions = transactions;
              console.log(this.transactions);
            })
          })
          }
      });
  }

}
