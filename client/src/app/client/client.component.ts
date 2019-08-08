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
      this.clientservice.getBrokerId(this.brok)
      .subscribe(broker => {
        this.brok_id = broker.id;
        this.clientservice.postTransaction(this.brok_id,this.amount,this.type,this.id,this.client_id,this.prod)
        .subscribe(product =>  {
          console.log(product + "Succesfull");
        });
      })
    }
  }
}
