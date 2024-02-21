import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubmitButtonComponent } from './task-submit-button.component';

describe('TaskSubmitButtonComponent', () => {
  let component: TaskSubmitButtonComponent;
  let fixture: ComponentFixture<TaskSubmitButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskSubmitButtonComponent]
    });
    fixture = TestBed.createComponent(TaskSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
