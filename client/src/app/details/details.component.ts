import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  graphs: any = [];
  graph: any[];
  len: number;
  constructor(private route: ActivatedRoute,
    private location: Location,private adminservice: AdminService) { }

  ngOnInit() {
    this.route.params.pipe(switchMap((params: Params) => { return this.adminservice.getGraphs(params['id']); }))
    .subscribe(graphs => {
      this.graph = graphs;
      this.len = this.graph.length
      // this.graph.forEach((graph) => {
      //   this.graphs.push(graph)
      // })
      console.log(this.graphs);
    });
  }

}
