import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import {of} from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import {YearLevel} from "../../domain/Milestone";
import {Task} from "../../domain/Task";
import {TasksService} from "./tasks.service";

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let tasksServiceSpy = createSpyObj('TasksService', ['getTasks']);
  tasksServiceSpy.getTasks.and.returnValue(of(Array(new Task({
    name: "name",
    yearLevel: YearLevel.Freshman,
    milestoneID: "id",
    events: [],
    tasks: [],
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: TasksService, useValue: tasksServiceSpy}],
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
