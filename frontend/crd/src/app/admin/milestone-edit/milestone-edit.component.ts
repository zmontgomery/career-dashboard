import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service'; 
import { Subject, forkJoin, mergeMap, of, takeUntil } from 'rxjs';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TaskService } from 'src/app/util/task.service';
import { Task } from 'src/domain/Task';
import { MatFormFieldControl } from '@angular/material/form-field';

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
  mYearLevel: YearLevel = YearLevel.Freshman; //default
  yearTasks: Array<Task> = new Array(); //only display tasks of the same year
  public currentMilestone: Milestone | undefined;

  milestoneForm!: FormGroup;
  dataLoaded: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private milestoneService: MilestoneService,
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      //TODO: the param is name for now but change to ID later (maybe)
      this.milestoneName = decodeURIComponent(params['name']);
    });

    this.milestoneService.getMilestones()
      .pipe(takeUntil(this.destroyed$),
        mergeMap((milestones: Milestone[]) => {
          // if we are creating a new milestone
          if (YearLevel[this.milestoneName as keyof typeof YearLevel]) {
            this.mYearLevel = YearLevel[this.milestoneName as keyof typeof YearLevel];
            this.milestoneName = '';
          }

          milestones.forEach((milestone) => {
            if (this.milestoneName != '' && milestone.name == this.milestoneName) {
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
    this.milestoneForm = this.formBuilder.group({
      name: [null, Validators.required],   //this field is hidden if the milestone already exists
      description: [null],
      level: [this.mYearLevel, Validators.required],  //IFF we want to be able to edit year levels
      tasks: this.listTasks()
    });

    if (this.currentMilestone) {
      //even if the name field is hidden, this prevents it from being marked as incomplete
      this.milestoneForm.get('name')?.setValue(this.currentMilestone.name);
      this.milestoneForm.get('desciption')?.setValue(this.currentMilestone.description);
    }
  }

  listTasks() {
    const taskControlArray = this.yearTasks.map(task => {
      if (this.currentMilestone && task.milestoneID == this.currentMilestone.milestoneID) {
        return this.formBuilder.control(true)
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

  getFormControlTask(control: AbstractControl): FormControl {
    return control as FormControl;  //otherwise angular doesn't recognize this as a FormControl
  }

  //IFF we want to be able to edit year levels
  switchYear(year: YearLevel) {
    alert("WARNING: switching year level will reset all assigned tasks");
    //IFF we want to be able to edit year levels, change the list of tasks shown
  }

  back() {
    this.router.navigate(['/admin/milestones']);
  }

  saveMilestone() {
    //TODO: check that all fields are in
    console.log("saving!");
  }

}
