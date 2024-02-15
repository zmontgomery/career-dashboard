import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionModalComponent } from './submission-modal.component';

describe('SubmissionModalComponent', () => {
  let component: SubmissionModalComponent;
  let fixture: ComponentFixture<SubmissionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionModalComponent]
    });
    fixture = TestBed.createComponent(SubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
