import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import {MatTestDialogOpenerModule} from "@angular/material/dialog/testing";
import {AuthService} from "../security/auth.service";
import {Router} from "@angular/router";
import {ArtifactService} from "../file-upload/artifact.service";
import {of} from "rxjs";
import {userJSON} from "../security/auth.service.spec";
import {User} from "../security/domain/user";

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let artifactSvcSpy: jasmine.SpyObj<ArtifactService>;
  authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut'], {user$: of(new User(userJSON))});
  artifactSvcSpy = jasmine.createSpyObj('ArtifactService', ['getProfilePicture']);
  artifactSvcSpy.getProfilePicture.and.returnValue(of("testURL"));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPageComponent],
      imports: [MatTestDialogOpenerModule],
      providers: [
        {provide: ArtifactService, useValue: artifactSvcSpy},
        {provide: AuthService, useValue: authServiceSpy},
      ]
    });
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
