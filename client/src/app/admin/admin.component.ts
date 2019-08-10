import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  threshold_time: number;
  threshold_profit: number
  constructor(private adminservice: AdminService) { }

  ngOnInit() {
  }
  onSubmit()
  {
    this.adminservice.postthreshold(this.threshold_time,this.threshold_profit)
  }

}
