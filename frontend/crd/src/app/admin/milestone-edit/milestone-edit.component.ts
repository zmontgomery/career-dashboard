import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { Subject, catchError, concatMap, forkJoin, mergeMap, of, takeUntil, throwError } from 'rxjs';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TaskService } from 'src/app/util/task.service';
import { Task } from 'src/domain/Task';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.less']
})
export class MilestoneEditComponent {

  private destroyed$ = new Subject<any>();

  allMilestones: Array<Milestone> = new Array();
  allTasks: Array<Task> = new Array();
  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  public milestoneName: string = '';
  private milestoneParam!: number;
  mYearLevel: YearLevel = YearLevel.Freshman; //default
  yearTasks: Array<Task> = new Array(); //only display tasks of the same year
  public currentMilestone!: Milestone;
  assignedTasks: Array<Task> = new Array();

  milestoneForm!: FormGroup;
  dataLoaded: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private milestoneService: MilestoneService,
    private taskService: TaskService,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    public http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // actually the milestone id
      this.milestoneParam = +decodeURIComponent(params['name']);
    });

    // FIXME this should be able to be undefined and not force refresh but after creating a milestone the current
    //  milestone is null if this is no set to always fetch
    // this.milestoneService.getMilestones(undefined, true)
    this.milestoneService.getMilestones(true, true)
      .pipe(takeUntil(this.destroyed$),
        mergeMap((milestones: Milestone[]) => {
          milestones.forEach((milestone) => {
            // saves specific fields of the milestone currently being edited
            if (milestone.milestoneID == this.milestoneParam) {
              this.milestoneName = milestone.name;
              this.currentMilestone = milestone;
              this.mYearLevel = milestone.yearLevel;
            }
            this.allMilestones.push(milestone);
          });

          return this.taskService.getTasks(true)
        })
      ).subscribe((tasks: Task[]) => {
            this.allTasks = tasks;
            this.yearTasks = tasks.filter(task => {
              return task.yearLevel == this.mYearLevel
            });
            this.dataLoaded = true;

            //only create the form once we've received all milestones and tasks from the API
            this.createMilestoneForm();
      });
  }

  /**
   * Creates the FormGroup either using the provided milestone data or blank
   */
  createMilestoneForm() {
    if (this.currentMilestone) {
      this.milestoneForm = this.formBuilder.group({
        name: [this.currentMilestone.name], //this field is hidden if the milestone already exists
        description: [this.currentMilestone.description],
        tasks: this.listTasks()
      });
    }
    // this technically won't be used since the milestone create functionality was moved
    else {
      this.milestoneForm = this.formBuilder.group({
        name: [null, Validators.required],
        description: [null],
        tasks: this.listTasks()
      });
    }

  }

  /**
   * Creates the FormControl array for the task checkboxes
   * Checks off assigned tasks and disables unavailable tasks
   */
  listTasks() {
    const taskControlArray = this.yearTasks.map(task => {
      // check off all tasks currently assigned to the milestone
      if (this.currentMilestone && task.milestoneID == this.currentMilestone.milestoneID) {
        this.assignedTasks.push(task);
        return this.formBuilder.control(true);
      }

      // if this task is already assigned to another milestone, we can't add it to this one
      // it will display anyway in case the admin wants to edit it
      else if (task.milestoneID) {
        return this.formBuilder.control({ value: false, disabled: true });
      }

      // the task has no milestone and so it is free to assign to this one
      return this.formBuilder.control(false)
    });

    return this.formBuilder.array(taskControlArray);
  }

  /**
   * Necessary to loop through the task controls
   */
  get tasks() {
    return this.milestoneForm.get('tasks') as FormArray;
  }

  /**
   * Handles the on change for the task checkboxes to add/remove task from assignedTasks
   */
  assignTask(e: any, selectedTask: Task) {
    if (e.checked) {
      this.assignedTasks.push(selectedTask);
    }
    else {
      const index = this.assignedTasks.indexOf(selectedTask);
      if (index > -1) {
        this.assignedTasks.splice(index, 1);
     }
    }
  }

  /**
   * Essentially just converts the task form control from AbstractControl to FormControl
   * Otherwise angular doesn't recognize this as a FormControl
   */
  getFormControlTask(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  /**
   * Return to the main milestone page
   */
  back() {
    this.router.navigate(['/admin/milestones']);
  }

  /**
   * Takes milestone data from the form and sends the update milestone request
   */
  saveMilestone() {
    const updateData: any = {};

    updateData.id = this.currentMilestone.milestoneID as unknown as number;
    if (this.milestoneForm.get('description')) {
      updateData.description = this.milestoneForm.get('description')!.value;
    }

    // the updateData only includes the taskIDs
    updateData.tasks = [];
    this.assignedTasks.forEach(task => {
      updateData.tasks.push(task.taskID);
    });

    const url = constructBackendRequest(Endpoints.EDIT_MILESTONE)
    this.http.post(url, updateData).subscribe(milestone => {
      if (milestone) {
        console.log("milestone updated");
        console.log(milestone);
        this.openSnackBar("Milestone Updated!");
        this.back();
      }
      else {
        this.openSnackBar("Something Went Wrong!");
      }
    });
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

  /**
   * Admin is able to edit tasks directly from the edit milestone page
   */
  openTaskEditModal(name: string, task: Task | null) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      name: name,
      task: task
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TaskEditModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      // refresh the milestone edit page to update the task list
      // this erases any unsaved changes to the milestone
      this.ngOnInit();
    })
  }

}
