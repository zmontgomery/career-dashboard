import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskMainPageComponent } from './task-main-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';
import { Task, TaskType } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { TaskService } from 'src/app/util/task.service';
import {MatSnackBarModule} from "@angular/material/snack-bar";


describe('TaskMainPageComponent', () => {
  let component: TaskMainPageComponent;
  let fixture: ComponentFixture<TaskMainPageComponent>;
  let httpMock: HttpTestingController;
  //@ts-ignore
  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
  taskServiceSpy.getTasks.and.returnValue(of([new Task({
    name: 'task name',
    description: "description",
    id: 1,
    isRequired: true,
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT,
    artifactName: 'test artifact'
  }),new Task({
    name: 'task name',
    description: "description",
    id: 2,
    isRequired: true,
    yearLevel: YearLevel.Sophomore,
    milestoneID: 4,
    taskType: TaskType.ARTIFACT,
    artifactName: 'test artifact'
  })]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskMainPageComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatTabsModule,
        MatListModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [MatDialog,{provide: TaskService, useValue: taskServiceSpy},],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(TaskMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate task map', () => {
    expect(component.taskMap.get(YearLevel.Freshman)?.length).toEqual(1);
    expect(component.taskMap.get(YearLevel.Sophomore)?.length).toEqual(1);
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
