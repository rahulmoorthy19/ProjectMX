import { Component, OnInit } from '@angular/core';
import { BrokerService } from '../services/broker.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-brokertransactions',
  templateUrl: './brokertransactions.component.html',
  styleUrls: ['./brokertransactions.component.css']
})
export class BrokertransactionsComponent implements OnInit {

  user: User;
  type: string;
  brok: string;
  amount: number;
  clientid: string;
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
          this.brokerservice.getTransactions(this.userid)
            .subscribe(transactions => {
              this.transactions = transactions;
              console.log(this.transactions);
              this.brokerservice.getBroker()
                .subscribe(user => {
                  this.user = user;
                  console.log(this.user)
        })
            })

          }
      });
  }
  onSubmit(id: string,type: string,user: string,amount: number )
  {
    // if(amount >  && this.type == "Sell")
    // {
    //   this.errmsg = "You cannot sell stocks greater than your current stock amount"
    // }
    // else{
      this.brokerservice.getClientId(user)
      .subscribe(broker => {
        this.clientid = broker._id;
        this.brokerservice.postTransaction(this.user.bank_name,user,this.clientid,amount,type);
        this.brokerservice.putTransaction(id);
      })
    // }
  }


}
