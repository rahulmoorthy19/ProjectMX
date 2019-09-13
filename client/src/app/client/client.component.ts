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
  id: string;
  prod: string;
  client_id: string;
  brok_id: string;
  brokers : User[];
  errmsg: string = undefined;
  products: any[];
  brok1: string;
  cli1: string;
  constructor(private clientservice: ClientService) { }

  ngOnInit() {
    this.clientservice.getBrokers()
      .subscribe(users => {
        this.brokers = users;
        console.log(this.brokers);
        this.clientservice.getClient()
        .subscribe(user => {
          this.user = user;
          this.client_id = user.id;
          this.cli1 = user._id;
          console.log(this.user)
          this.clientservice.getProducts()
          .subscribe(products => {
            this.products = products;
          })
        })
    })
  }
  onSubmit()
  {
    if(this.amount > this.user.stock_balance && this.type == "sell")
    {
      this.errmsg = "You cannot sell stocks greater than your current stock amount"
    }
    else{
      var val = Math.floor(1000 + Math.random() * 9000);
      console.log(val);
      this.id = "TID" + val.toString();
      console.log(this.brok)
      this.clientservice.getBrokerId(this.brok)
      .subscribe(broker => {
        console.log(broker);
        this.brok_id = broker.id;
        this.brok1 = broker._id;
        this.clientservice.postTransaction(this.brok_id,this.amount,this.type,this.id,this.client_id,this.prod,this.brok1,this.cli1)
        .subscribe(product =>  {
          console.log(product);
        });
      })
    }
  }
  oncl()
  {
    console.log("Hii");
  }
}
