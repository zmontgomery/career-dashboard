import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TasksModalComponent} from './tasks-modal.component';
import {Task, TaskType} from '../../domain/Task';
import {YearLevel} from 'src/domain/Milestone';
import {of} from "rxjs";
import createSpyObj = jasmine.createSpyObj;

describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;
  let testTask: Task;
  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
  taskServiceSpy.getTasks.and.returnValue(of(Array(new Task({
    name: 'task name',
    description: "description",
    id: 1,
    isRequired: true,
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT,
    artifactName: 'test artifact'
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TasksModalComponent],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(TasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('test1', () => {
    testTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
