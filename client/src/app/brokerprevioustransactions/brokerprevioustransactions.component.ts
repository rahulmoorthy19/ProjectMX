import { Component, OnInit } from '@angular/core';
import { BrokerService } from '../services/broker.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-brokerprevioustransactions',
  templateUrl: './brokerprevioustransactions.component.html',
  styleUrls: ['./brokerprevioustransactions.component.css']
})
export class BrokerprevioustransactionsComponent implements OnInit {

  userId: string = undefined;
  user: User;
  type: string;
  brok: string;
  amount: number;
  client_id: string;
  product_id: string;
  brokers : User[];
  errmsg: string = undefined;
  userid: string = undefined;
  transactions: Transaction[];
  constructor(private brokerservice: BrokerService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthState()
        .subscribe((user) => {
        if (user) {
          this.userid = user.uid;
          this.brokerservice.getBroker()
          .subscribe(broker => {
            this.user = broker;
            this.userId = broker.id;
            console.log(this.userId);
            this.brokerservice.getPrevTransactions(this.userId)
            .subscribe(transactions => {
              this.transactions = transactions;
              console.log(this.transactions);
            })
          })
          
        }
      });
  }

}
