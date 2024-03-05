import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleConfirmationDialogComponent } from './edit-role-confirmation-dialog.component';

describe('EditRoleConfirmationDialogComponent', () => {
  let component: EditRoleConfirmationDialogComponent;
  let fixture: ComponentFixture<EditRoleConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRoleConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(EditRoleConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
