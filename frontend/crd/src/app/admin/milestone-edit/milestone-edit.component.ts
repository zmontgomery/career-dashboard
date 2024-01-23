import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service'; 
import { Subject, forkJoin, mergeMap, of, takeUntil } from 'rxjs';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.less']
})
export class MilestoneEditComponent {

  private destroyed$ = new Subject<any>();

  allMilestones: Array<Milestone> = new Array();
  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  public milestoneName: string = '';
  mYearLevel: YearLevel = YearLevel.Freshman; //default
  public currentMilestone: Milestone | undefined;

  milestoneForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private milestoneService: MilestoneService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      //TODO: the param is name for now but change to ID later (maybe)
      this.milestoneName = decodeURIComponent(params['name']);
    });

    // this.milestoneService.getMilestones()
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((milestones: Milestone[]) => {
    //     milestones.forEach((milestone) => {
    //       if (this.milestoneName != '' && milestone.name == this.milestoneName) {
    //         this.currentMilestone = milestone;
    //       }
    //       this.allMilestones.push(milestone);
    //     });

    //     this.createMilestoneForm()
    // });

    this.milestoneService.getMilestones()
      .pipe(takeUntil(this.destroyed$),
        mergeMap((milestones: Milestone[]) => {
          milestones.forEach((milestone) => {
            if (this.milestoneName != '' && milestone.name == this.milestoneName) {
              this.currentMilestone = milestone;
            }
            this.allMilestones.push(milestone);
          });

          if(!this.currentMilestone)
            return of(YearLevel.Freshman)

          return of(this.currentMilestone.yearLevel);
        }),
        mergeMap((currentYear: YearLevel) => {
          //TODO: retrieve all tasks
          //

          return of(1) //this will be all tasks or smth
        })
      ).subscribe((num: number) => {
            this.createMilestoneForm();
      });

  }

  createMilestoneForm() {
    if (this.currentMilestone) {
      this.milestoneForm = new FormGroup({
        description: new FormControl(this.currentMilestone.description),
        level: new FormControl(this.currentMilestone.yearLevel, Validators.required),
        tasks: new FormControl('') //TODO: this
      })
    }
    else {
      this.milestoneForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        level: new FormControl('', Validators.required),
        tasks: new FormControl('')
      })
    }
  }

  back() {
    this.router.navigate(['/admin/milestones']);
  }

  saveMilestone() {
    //TODO: this
  }

}
