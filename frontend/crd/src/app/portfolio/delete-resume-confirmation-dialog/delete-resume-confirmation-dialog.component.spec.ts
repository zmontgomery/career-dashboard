import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResumeConfirmationDialogComponent } from './delete-resume-confirmation-dialog.component';

describe('DeleteResumeConfirmationDialogComponent', () => {
  let component: DeleteResumeConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteResumeConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteResumeConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteResumeConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
