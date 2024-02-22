import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubmitButtonComponent } from './task-submit-button.component';
import { MatDialog } from '@angular/material/dialog';
import { task } from '../util/task.service.spec';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';

describe('TaskSubmitButtonComponent', () => {
  let component: TaskSubmitButtonComponent;
  let fixture: ComponentFixture<TaskSubmitButtonComponent>;

  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      declarations: [TaskSubmitButtonComponent],
      providers: [
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(TaskSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    component.task = task;

    component.openSubmissionModal();

    expect(dialog.open).toHaveBeenCalledWith(SubmissionModalComponent, {data: {task: task}});
  });
});
