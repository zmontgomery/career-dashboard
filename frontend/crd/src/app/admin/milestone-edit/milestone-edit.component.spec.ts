import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MilestoneEditComponent } from './milestone-edit.component';
import { BehaviorSubject, of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { Milestone, YearLevel } from 'src/domain/Milestone';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { Task } from 'src/domain/Task';
import { TaskService } from 'src/app/util/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TaskEditModalModule } from '../task-edit-modal/task-edit-modal.module';
import { MatDialog, MatDialogConfig, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';


describe('MilestoneEditComponent', () => {
  let component: MilestoneEditComponent;
  let fixture: ComponentFixture<MilestoneEditComponent>;
  let httpMock: HttpTestingController;
  const paramMap = new BehaviorSubject(convertToParamMap({ name: 'name'  }));
  const activatedRouteMock = {
    params: paramMap.asObservable(),
  };

  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    events: [],
    tasks: [],
    description: "testing"
  }))));

  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
  taskServiceSpy.getTasks.and.returnValue(of(Array(new Task({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    description: "description",
    isRequired: true,
    submission: "submission",
    milestoneID: 1,
    needsArtifact: true,
    taskType: "artifact"
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule, 
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        NoopAnimationsModule,
        TaskEditModalModule,
        MatDialogModule,
        HttpClientTestingModule, 
        HttpClientModule, 
      ],
      declarations: [MilestoneEditComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteMock},
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: TaskService, useValue: taskServiceSpy},
        MatDialog
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(MilestoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should open the TaskEditModal in a MatDialog', () => {
    spyOn(component.matDialog,'open').and.callThrough();
    component.openTaskEditModal("testing", null);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      name: "testing",
      task: null
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(TaskEditModalComponent, dialogConfig);
  });
});
