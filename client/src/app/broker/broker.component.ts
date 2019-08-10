import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { ClientService } from '../services/client.service'
import { BrokerService } from '../services/broker.service';
@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  user: User;
  type: string;
  brok: string;
  amount: number;
  id: string;
  prod: string;
  client_id: string;
  brok_id: string;
  brokers : User[];
  broker: User;
  errmsg: string = undefined;
  products: any[];
  id1: string;
  constructor(private clientservice: ClientService, private brokerservice: BrokerService) { }

  ngOnInit() {
    this.brokerservice.getBroker()
    .subscribe(broker => {
      console.log(broker)
      this.user = broker
      this.id1 = broker._id;
      this.client_id = this.user.id;
      this.brok_id = this.client_id;
      console.log(this.client_id,this.user);
      this.clientservice.getProducts()
      .subscribe(products => {
        this.products = products;
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
      this.id = "TID" + val.toString()
      console.log(this.client_id,this.brok_id)
        this.brokerservice.postTransaction(this.brok_id,this.amount,this.type,this.id,this.client_id,this.prod,this.id1)
        .subscribe(product =>  {
          console.log(product);
        });
    }
  }
}
