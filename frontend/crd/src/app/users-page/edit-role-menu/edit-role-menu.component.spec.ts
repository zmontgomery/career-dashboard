import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleMenuComponent } from './edit-role-menu.component';
import { AuthService } from 'src/app/security/auth.service';
import { BehaviorSubject, Subject, of, take } from 'rxjs';
import { userJSON } from 'src/app/security/auth.service.spec';
import { Role, User } from 'src/app/security/domain/user';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleConfirmationDialogComponent } from './edit-role-confirmation-dialog/edit-role-confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EditRoleConfirmationDialogModule } from './edit-role-confirmation-dialog/edit-role-confirmation-dialog.module';

describe('EditRoleMenuComponent', () => {
  let component: EditRoleMenuComponent;
  let fixture: ComponentFixture<EditRoleMenuComponent>;
  let dialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open']);

  let userSubject = new Subject<User | null>();
  let user$ = userSubject.asObservable();
  let authService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [], {user$: user$});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRoleMenuComponent],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: MatDialog, useValue: dialog}
      ],
      imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        EditRoleConfirmationDialogModule
      ]
    });
    fixture = TestBed.createComponent(EditRoleMenuComponent);
    component = fixture.componentInstance;
    component.user = new User(userJSON);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open on selection', () => {
    component.onSelection(Role.Student);
    
    expect(dialog.open).toHaveBeenCalledWith(EditRoleConfirmationDialogComponent, {data: {
      user: new User(userJSON),
      role: Role.Student
    }})
  });

  [
    [Role.SuperAdmin, Role.Admin, true],
    [Role.Admin, Role.Admin, false],
    [Role.Faculty, Role.Admin, false],
    [Role.Student, Role.Admin, false],
    [null, Role.Admin, false],
    [Role.SuperAdmin, Role.Faculty, true],
    [Role.Admin, Role.Faculty, true],
    [Role.Faculty, Role.Faculty, false],
    [Role.Student, Role.Faculty, false],
    [null, Role.Admin, false],
  ].forEach((params) => {
    const userRole = params[0] as Role | null;

    let user: User | null = new User(userJSON);
    // @ts-ignore
    user.role = userRole;

    // @ts-ignore
    user.email = 'sadf@sad.d';
    if (userRole === null) {
      user = null;
    }

    const role = params[1] as Role;
    const result = params[2] as boolean;
    it(`should be ${result} for ${user?.role} editing ${role}`, (done) => {
      component.user.role = role;
      component.canBeChanged().pipe(take(1)).subscribe((actual) => {
        expect(actual).toEqual(result);
        done();
      });

      userSubject.next(user);
    });
  });

  it(`should return false if emails match`, (done) => {
    let user: User | null = new User(userJSON);
    component.canBeChanged().pipe(take(1)).subscribe((actual) => {
      expect(actual).toBeFalse();
      done();
    });

    userSubject.next(user);
  });
});
