import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksModalComponent } from './tasks-modal.component';
import { MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Task } from '../../domain/Task';
import { YearLevel } from 'src/domain/Milestone';

describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;
  let testTask: Task;

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
      submission: 'submission',
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: 'artifact',
      artifactName: 'test artifact'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
