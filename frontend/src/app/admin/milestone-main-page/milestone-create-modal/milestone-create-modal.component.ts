import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MilestoneCreateModalConfig } from './milestone-create-modal.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Milestone, MilestoneJSON, YearLevel } from 'src/domain/Milestone';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";


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
    private _snackBar: MatSnackBar,
    public router: Router,
    public milestoneService: MilestoneService,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

      this.yearLevel = this.modalData.yearLevel;
  }

  ngOnInit() {
    // the following is actually called when leaving the modal
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

  /**
   * The form only includes the milestone name
   * Year level is determined by what year tab the user created the milestone from
   */
  createForm() {
    this.milestoneForm = this.formBuilder.group({
      name: [null, Validators.required],
    });
  }

  /**
   * Sends the new milestone data
   */
  newMilestone() {
    const newData: any = {};

    if (!this.milestoneForm.get('name')?.value) {
      this.openSnackBar("Please add a milestone name");
      return;
    }

    newData.name = this.milestoneForm.get('name')!.value;
    newData.yearLevel = this.yearLevel;

    const url = constructBackendRequest(Endpoints.CREATE_MILESTONE);
    this.http.post(url, newData).subscribe(data => {
      const newJSON = data as MilestoneJSON;
      const newMilestone = new Milestone(newJSON);
      // in case the returned milestone is empty
      if(!newMilestone.name) {
        this.openSnackBar("Something went wrong creating milestone");
        this.closeModal();
      }

      // automatically navigates to the edit page for this new milestone
      const encodedName = encodeURIComponent(newMilestone.milestoneID);
      this.router.navigate(['/admin/milestone-edit', encodedName]);
      this.closeModal();
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  openSnackBar(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    durationInSeconds: number = 3,
  ) {
    this._snackBar.open(message, 'close', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: durationInSeconds * 1000,
    });
  }

}

