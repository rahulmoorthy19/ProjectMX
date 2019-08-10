import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.css']
})
export class ViewtransactionComponent implements OnInit {

  brokers: any[];
  broker: User;
  constructor(private adminservice: AdminService) { }

  ngOnInit() {
    this.adminservice.getBrokers()
    .subscribe(brokers => {
      this.brokers = brokers;
    })
  }
  onSubmit(id: string)
  {
    this.adminservice.getBroker(id)
    .subscribe(broker => {
      this.broker = broker;
      console.log(this.broker._id);
      this.adminservice.blacklist(this.broker._id)
      this.delet(id);
    })
  }
  delet(id:string)
  {
    this.adminservice.deleteBroker(id);
  }

}
