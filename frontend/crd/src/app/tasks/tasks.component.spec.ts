import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TasksComponent} from './tasks.component';
import {of} from "rxjs";
import {YearLevel} from "../../domain/Milestone";
import {Task, TaskType} from "../../domain/Task";
import {TaskService} from "../util/task.service";
import createSpyObj = jasmine.createSpyObj;
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let tasksServiceSpy = createSpyObj('TaskService', ['getTasks']);
  tasksServiceSpy.getTasks.and.returnValue(of(Array(new Task({
    name: "name",
    description: "",
    id: 1,
    isRequired: true,
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, MatListModule ],
      providers: [{provide: TaskService, useValue: tasksServiceSpy}],
      declarations: [TasksComponent]
    });
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
