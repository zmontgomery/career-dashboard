import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.less']
})
export class MilestoneEditComponent {

  milestoneName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      //TODO: the param is name for now but change to ID later (maybe)
      this.milestoneName = decodeURIComponent(params['name']);
    });

    //TODO: retrieve the milestone data 

    //TODO: retrieve all active tasks
  }

  back() {
    this.router.navigate(['/admin/milestones']);
  }

  saveMilestone() {
    //TODO: this
  }

}
