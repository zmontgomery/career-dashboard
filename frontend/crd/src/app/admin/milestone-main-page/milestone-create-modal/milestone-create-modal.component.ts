import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MilestoneCreateModalConfig } from './milestone-create-modal.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Milestone, MilestoneJSON, YearLevel } from 'src/domain/Milestone';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service'; 


@Component({
  selector: 'app-milestone-create-modal',
  templateUrl: './milestone-create-modal.component.html',
  styleUrls: ['./milestone-create-modal.component.less']
})
@Injectable()
export class MilestoneCreateModalComponent implements OnInit {

  yearLevel: YearLevel

  milestoneForm!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<MilestoneCreateModalComponent>,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router,
    private milestoneService: MilestoneService,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

      this.yearLevel = this.modalData.yearLevel;
  }

  ngOnInit() { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(function () {
          // otherwise it navigates to the bottom of the page
          window.scrollTo({top: 0, left: 0, behavior: "instant"});
      },200); // scrolling doesn't work without a timeout (???? idk)
      }
    });

    this.createForm();
  }

  createForm() {
    this.milestoneForm = this.formBuilder.group({
      name: [null, Validators.required],   //this field is hidden if the task already exists
    });
  }

  newMilestone() {
    const newData: any = {};

    if (!this.milestoneForm.get('name')?.value) {
      window.alert("Please add a milestone name");
      return;
    }

    newData.name = this.milestoneForm.get('name')!.value;
    newData.yearLevel = this.yearLevel;

    const url = constructBackendRequest(Endpoints.CREATE_MILESTONE);
    this.http.post(url, newData).subscribe(data => {
      const newJSON = data as MilestoneJSON;
      const newMilestone = new Milestone(newJSON);
      if(!newMilestone.name) {
        window.alert("Something went wrong");
        this.closeModal();
      }

      // refresh cache before rerouting
      this.milestoneService.getMilestones(true).subscribe(data => {
        const encodedName = encodeURIComponent(newMilestone.milestoneID);
        this.router.navigate(['/admin/milestone-edit', encodedName], {
          state: { scrollToTop: true }
        });
        this.closeModal();
      });
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

}

