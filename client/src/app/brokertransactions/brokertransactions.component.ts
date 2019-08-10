import { Component, OnInit } from '@angular/core';
import { BrokerService } from '../services/broker.service';
import { User } from '../shared/user';
import { Transaction } from '../shared/transaction';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-brokertransactions',
  templateUrl: './brokertransactions.component.html',
  styleUrls: ['./brokertransactions.component.css']
})
export class BrokertransactionsComponent implements OnInit {

  userId: string = undefined;
  user: User;
  users: any;
  usersss: User;
  type: string;
  brok: string;
  amount: number;
  uid: string;
  client_id: string;
  stock: number;
  product_id: string;
  brokers : User[];
  errmsg: string = undefined;
  userid: string = undefined;
  transactions: Transaction[];
  constructor(private brokerservice: BrokerService, private authService: AuthService,private clientservice: ClientService) { }

  ngOnInit() {
    this.authService.getAuthState()
        .subscribe((user) => {
        if (user) {
          this.userid = user.uid;
          this.brokerservice.getBroker()
          .subscribe(broker => {
            this.users = broker;
            this.userId = broker.id;
            console.log(this.userId);
            this.brokerservice.getTransactions(this.userId)
            .subscribe(transactions => {
              this.transactions = transactions;
              console.log(this.transactions);
            })
          })
        }
      });
  }
  onSubmit(broker_id: string,tid: string,type: string,amount: number,product_id: string,client_id: string,buid: string,cuid: string)
  {
      // if(amount > 12)
      // {
      //   amount = amount/2;
      // }
      // console.log(this.userId,amount,type,tid,client_id,product_id)
      if(client_id == broker_id)
      {
      //   this.clientservice.getBrokerIdd(this.userId)
      //   .subscribe(broker => {
      //     this.usersss = broker;
      //     // this.stock = this.usersss.stock_balance;
      //     this.uid = this.usersss._id;
      //   });
      // transaction.broker_id,transaction._id,transaction.type,transaction.quantity, transaction.product_id, transaction.client_id,transaction.broker_uid,transaction.client_uid
          console.log(broker_id,amount,type,tid,client_id,product_id,cuid,buid)
            this.brokerservice.postTransactionClient(broker_id,amount,type,tid,client_id,product_id,cuid,buid)
            // broker_id: string, amount: number,type: string,id: string,client_id: string,product_id: string,cuid: string,buid: string
            .subscribe(product =>  {
              // window.location.reload();
              console.log("Hii");
          });
        }
        // broker_id: string, amount: number,type: string,id: string,client_id: string,product_id: string,uid: string
        else
        {
        //   this.brokerservice.getClientId(client_id)
        // .subscribe(client => {
        //   // this.stock = client.stock_balance;
        //   this.uid = client._id;
        console.log(broker_id,amount,type,tid,client_id,product_id,cuid,buid)
        this.brokerservice.postTransactionClient(broker_id,amount,type,tid,client_id,product_id,cuid,buid)
            .subscribe(product =>  {
              // window.location.reload();
              console.log("Hii");
            });
        }
      // {
      //   this.brokerservice.getClientId(client_id)
      //   .subscribe(client => {
      //     this.stock = client.stock_balance;
      //     this.uid = client._id;
      //     if(type == "buy")
      //     {
      //       amt = this.stock + amount;
      //       this.brokerservice.postTransactionClient(this.userId,amount,type,tid,client_id,product_id,this.uid)
      //       .subscribe(product =>  {
      //         // // this.brokerservice.putBroker(this.uid,amt,"C");
      //         this.update(this.uid,amt,"C");
      //       });
      //     }
      //     else
      //     {
      //       amt = this.stock - amount;
      //       this.brokerservice.postTransactionClient(this.userId,amount,type,tid,client_id,product_id,this.uid)
      //       .subscribe(product =>  {
      //         // // this.brokerservice.putBroker(this.uid,amt,"C");
      //         this.update(this.uid,amt,"C");
      //       console.log(product);
      //       });
      //     }
      //   });
      // }
  }
}
  // update(uid: string,amt: number,type :string)
  // {
  //   console.log("Hiii")
  // }
