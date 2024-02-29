import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TasksComponent} from './tasks.component';
import {of} from "rxjs";
import {YearLevel} from "../../domain/Milestone";
import {Task, TaskType} from "../../domain/Task";
import {TasksService} from "./tasks.service";
import createSpyObj = jasmine.createSpyObj;

// describe('TasksComponent', () => {
//   let component: TasksComponent;
//   let fixture: ComponentFixture<TasksComponent>;
//   let tasksServiceSpy = createSpyObj('TasksService', ['getTasks']);
//   tasksServiceSpy.getTasks.and.returnValue(of(Array(new Task({
//     name: "name",
//     description: "",
//     id: 1,
//     isRequired: true,
//     yearLevel: YearLevel.Freshman,
//     milestoneID: 1,
//     taskType: TaskType.ARTIFACT
//   }))));
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [{provide: TasksService, useValue: tasksServiceSpy}],
//       declarations: [TasksComponent]
//     });
//     fixture = TestBed.createComponent(TasksComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
// });
