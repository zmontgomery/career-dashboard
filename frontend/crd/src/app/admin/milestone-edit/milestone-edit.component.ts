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
  private milestoneParam: string = '';
  mYearLevel: YearLevel = YearLevel.Freshman; //default
  yearTasks: Array<Task> = new Array(); //only display tasks of the same year
  public currentMilestone: Milestone | undefined;
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
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.milestoneParam = decodeURIComponent(params['name']);
    });

    this.milestoneService.getMilestones()
      .pipe(takeUntil(this.destroyed$),
        mergeMap((milestones: Milestone[]) => {
          // if we are creating a new milestone
          if (YearLevel[this.milestoneParam as keyof typeof YearLevel]) {
            this.mYearLevel = YearLevel[this.milestoneParam as keyof typeof YearLevel];
            this.milestoneName = '';
            this.milestoneParam = '';
          }

          milestones.forEach((milestone) => {
            if (this.milestoneParam != '' && milestone.milestoneID == +this.milestoneParam) {
              this.milestoneName = milestone.name;
              this.currentMilestone = milestone;
              this.mYearLevel = milestone.yearLevel;
            }
            this.allMilestones.push(milestone);
          });

          return this.taskService.getTasks()
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

  createMilestoneForm() {
    if (this.currentMilestone) {
      this.milestoneForm = this.formBuilder.group({
        name: [this.currentMilestone.name],
        description: [this.currentMilestone.description],
        tasks: this.listTasks()
      });
    }
    else {
      this.milestoneForm = this.formBuilder.group({
        name: [null, Validators.required],   //this field is hidden if the milestone already exists
        description: [null],
        tasks: this.listTasks()
      });
    }

  }

  listTasks() {
    const taskControlArray = this.yearTasks.map(task => {
      if (this.currentMilestone && task.milestoneID == this.currentMilestone.milestoneID) {
        this.assignedTasks.push(task);
        return this.formBuilder.control(true);
      }

      //if this task is already assigned to another milestone, we can't add it to this one
      //it will display anyway in case the admin wants to edit it
      else if (task.milestoneID) {
        return this.formBuilder.control({ value: false, disabled: true });
      }

      //the task has no milestone and so it is free to assign to this one
      return this.formBuilder.control(false)
    });

    return this.formBuilder.array(taskControlArray);
  }

  get tasks() {
    return this.milestoneForm.get('tasks') as FormArray;
  }

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

  getFormControlTask(control: AbstractControl): FormControl {
    return control as FormControl;  //otherwise angular doesn't recognize this as a FormControl
  }

  back() {
    this.router.navigate(['/admin/milestones']).then(() => {
      window.location.reload();
    });
  }

  saveMilestone() {
    if (this.currentMilestone) {
      const updateData: any = {};

      updateData.id = this.currentMilestone.milestoneID as unknown as number;
      if (this.milestoneForm.get('description')) {
        updateData.description = this.milestoneForm.get('description')!.value;
      }

      updateData.tasks = [];
      this.assignedTasks.forEach(task => {
        updateData.tasks.push(task.taskID);
      });

      const url = constructBackendRequest(Endpoints.EDIT_MILESTONE)
      this.http.post(url, updateData).subscribe(milestone => {
        if (milestone) {
          window.alert("Milestone updated");
        }
        else {
          window.alert("Something went wrong");
        }
          this.back();
        });
    }
    else {
      if(!this.milestoneForm.get('name')?.value) {
        window.alert("Please add a milestone name"); // probably change to a better error message
        return;
      }

      const newData: any = {};
      newData.name = this.milestoneForm.get('name')!.value;
      newData.yearLevel = this.mYearLevel;

      if (this.milestoneForm.get('description')) {
        newData.description = this.milestoneForm.get('description')!.value;
      }

      newData.tasks = [];
      this.assignedTasks.forEach(task => {
        newData.tasks.push(task.taskID);
      });

      const url = constructBackendRequest(Endpoints.CREATE_MILESTONE)
      this.http.post(url, newData).subscribe(milestone => {
        if (milestone) {
          console.log(milestone)
          window.alert("Milestone created");
        }
        else {
          window.alert("Something went wrong");
        }
          this.back();
        });
      }
  }

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
      //TODO: successful save popup?
      this.taskService.getTasks(true);
      this.ngOnInit();
    })
  }

}
