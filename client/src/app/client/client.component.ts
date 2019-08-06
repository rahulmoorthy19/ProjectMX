import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  user: User;
  type: string;
  brok: string;
  amount: number;
  brok_id: string;
  brokers : User[];
  errmsg: string = undefined;
  constructor(private clientservice: ClientService) { }

  ngOnInit() {
    this.clientservice.getBrokers()
      .subscribe(users => {
        this.brokers = users;
        console.log(this.brokers);
        this.clientservice.getClient()
        .subscribe(user => {
          this.user = user;
          console.log(this.user)
        })
    })
  }
  onSubmit()
  {
    if(this.amount > this.user.stock_balance && this.type == "Sell")
    {
      this.errmsg = "You cannot sell stocks greater than your current stock amount"
    }
    else{
      this.clientservice.getBrokerId(this.brok)
      .subscribe(broker => {
        this.brok_id = broker._id;
        this.clientservice.postTransaction(this.user.bank_name,this.brok,this.brok_id,this.amount,this.type)
      })
    }
  }
}
