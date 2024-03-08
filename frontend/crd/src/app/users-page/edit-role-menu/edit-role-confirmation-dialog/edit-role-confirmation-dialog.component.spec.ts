import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EditRoleConfirmationDialogComponent } from './edit-role-confirmation-dialog.component';
import { UserService } from 'src/app/security/user.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { userJSON } from 'src/app/security/auth.service.spec';
import { Role, User } from 'src/app/security/domain/user';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

describe('EditRoleConfirmationDialogComponent', () => {
  let component: EditRoleConfirmationDialogComponent;
  let fixture: ComponentFixture<EditRoleConfirmationDialogComponent>;

  let userService: jasmine.SpyObj<UserService>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<EditRoleConfirmationDialogComponent>>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['updateRole']);
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    userService.updateRole.and.returnValue(of(new User(userJSON)));

    TestBed.configureTestingModule({
      declarations: [EditRoleConfirmationDialogComponent],
      providers: [
        {provide: UserService, useValue: userService},
        {provide: MatDialogRef, useValue: matDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: {user: new User(userJSON), role: Role.Admin}}
      ],
      imports: [
        MatDialogModule,
        MatButtonModule
      ]
    });
    fixture = TestBed.createComponent(EditRoleConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', fakeAsync(() => {
    component.onCancel();
    tick(1000);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it('should confirm', fakeAsync(() =>{
    component.onConfirm();
    tick(1000);
    expect(userService.updateRole).toHaveBeenCalled();
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it('should format', () => {
    expect(component.formatRole()).toEqual('an Admin');
  });

  it('should format', () => {
    component.role = Role.Student;
    expect(component.formatRole()).toEqual('a Student');
  });
});
