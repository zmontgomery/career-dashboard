import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksModalComponent } from './tasks-modal.component';
import { Task, TaskType } from '../../domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskSubmitButtonModule } from '../task-submit-button/task-submit-button.module';
import { taskJSON } from '../util/task.service.spec';
import { TaskService } from '../util/task.service';

describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;
  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
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
    task: testTask
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TaskSubmitButtonModule],
      declarations: [TasksModalComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
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
