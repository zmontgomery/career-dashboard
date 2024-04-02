import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksModalComponent } from './tasks-modal.component';
import { Task, TaskType } from '../../domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskSubmitButtonModule } from '../task-submit-button/task-submit-button.module';
import { SubmissionContentModule } from '../submissions/submission-content/submission-content.module';
import { taskJSON } from '../util/task.service.spec';
import { TaskService } from '../util/task.service';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {userJSON} from "../security/auth.service.spec";
import { User } from '../security/domain/user';
import { AuthService } from '../security/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;
  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
  let authSvcSpy: jasmine.SpyObj<AuthService> = createSpyObj('AuthService', [], {user$: of(new User(userJSON))})
  let dialogMock = {
    close: () => { }
    };

  const testTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    });

  const dialogData = {
    task: testTask,
    overdue: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TaskSubmitButtonModule, MatIconModule, SubmissionContentModule, HttpClientModule, MatSnackBarModule, NoopAnimationsModule],
      declarations: [TasksModalComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        {provide: AuthService, useValue: authSvcSpy}
      ],
      teardown: { destroyAfterEach: false }
    }).compileComponents();
    fixture = TestBed.createComponent(TasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
