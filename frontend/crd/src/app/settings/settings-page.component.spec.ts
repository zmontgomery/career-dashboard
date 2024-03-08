import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import {MatTestDialogOpenerModule} from "@angular/material/dialog/testing";
import {AuthService} from "../security/auth.service";
import {Router} from "@angular/router";
import {ArtifactService} from "../file-upload/artifact.service";
import {of} from "rxjs";
import {userJSON} from "../security/auth.service.spec";
import {User} from "../security/domain/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MockComponent} from "ng-mocks";
import {ProfileImageModalComponent} from "../file-upload/profile-image-modal/profile-image-modal.component";
import createSpyObj = jasmine.createSpyObj;

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let artifactSvcSpy: jasmine.SpyObj<ArtifactService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<ProfileImageModalComponent>>
  let locationSpy: jasmine.SpyObj<Location>;
  authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut'], {user$: of(new User(userJSON))});
  artifactSvcSpy = jasmine.createSpyObj('ArtifactService', ['getProfilePicture']);
  artifactSvcSpy.getProfilePicture.and.returnValue(of("testURL"));
  matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  matDialogRefSpy.afterClosed.and.returnValue(of(null));
  matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogSpy.open.and.returnValue(matDialogRefSpy);
  locationSpy = createSpyObj('Location', ['reload'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPageComponent],
      imports: [],
      providers: [
        {provide: ArtifactService, useValue: artifactSvcSpy},
        {provide: AuthService, useValue: authServiceSpy},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: MatDialogRef, useValue: matDialogSpy},
        { provide: Location, useValue: locationSpy },
      ]
    });
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open Profile Picture', () => {
    component.openProfilePicture();
    expect(matDialogSpy.open).toHaveBeenCalled();
    expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
  });
});
