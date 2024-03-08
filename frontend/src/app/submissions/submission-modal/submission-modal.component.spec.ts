import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SubmissionModalComponent } from './submission-modal.component';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { Task, TaskType } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { userJSON } from 'src/app/security/auth.service.spec';
import { SubmissionService } from '../submission.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Submission } from 'src/domain/Submission';
import { submission1 } from '../submission.service.spec';

describe('SubmissionModalComponent', () => {
  let component: SubmissionModalComponent;
  let fixture: ComponentFixture<SubmissionModalComponent>;

  let artifactService: jasmine.SpyObj<ArtifactService>;
  let submissionService: jasmine.SpyObj<SubmissionService>;
  let authService: jasmine.SpyObj<AuthService>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<SubmissionModalComponent>>;

  let task = new Task({
    name: 'task name',
    description: "description",
    id: 1,
    isRequired: true,
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT,
    artifactName: 'test artifact'
  });

  let user = new User(userJSON);

  beforeEach(() => {
    artifactService = jasmine.createSpyObj('ArtifactService', ['deleteArtifact']);
    submissionService = jasmine.createSpyObj('SubmissionService', ['submit']);
    authService = jasmine.createSpyObj('AuthService', ['toString'], {user$: of(user)});
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [SubmissionModalComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        FileUploadModule,
        MatDialogModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: ArtifactService, useValue: artifactService},
        {provide: SubmissionService, useValue: submissionService},
        {provide: AuthService, useValue: authService},
        {provide: MatDialogRef, useValue: matDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: {task: task}}
      ]
    });
    fixture = TestBed.createComponent(SubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', fakeAsync(() => {
    component.onCancel();
    expect(component.modalState).toBe('cancelling');
    expect(matDialogRef.close).not.toHaveBeenCalled();
    tick(1000);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it('should be enabled', () => {
    expect(component.isEnabled()).toBeTrue();
    component.modalState = 'cancelling';
    expect(component.isEnabled()).toBeFalse();
  });

  it('should be submittable', () => {
    expect(component.canSubmit()).toBeFalse();
    component.artifactId = 2;
    expect(component.canSubmit()).toBeTrue();
    spyOn(task, 'needsArtifact').and.returnValue(false);
    expect(component.canSubmit()).toBeFalse();
    component.commentString = 'asdfasdf';
    expect(component.canSubmit()).toBeTrue();
  });

  it('should set artifact id', () => {
    expect(component.artifactId).toEqual(0);
    component.onArtifactId(2);
    expect(component.artifactId).toEqual(2);
  });

  it('should need artifact', () => {
    expect(component.needsArtifact()).toBeTrue();
    spyOn(task, 'needsArtifact').and.returnValue(false);
    expect(component.needsArtifact()).toBeFalse();
  });

  it('should submit', fakeAsync(() => {
    submissionService.submit.and.returnValue(of(submission1));
    component.onSubmit();
    tick(50);
    expect(submissionService.submit).toHaveBeenCalled();
    expect(component.modalState).toEqual('submitting');
    expect(matDialogRef.close).not.toHaveBeenCalled();
    tick(1000);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it('should delete on destroy', fakeAsync(() => {
    artifactService.deleteArtifact.and.returnValue(of('a'));
    component.artifactId = 2;
    component.modalState = 'nominal';

    component.ngOnDestroy();

    expect(artifactService.deleteArtifact).toHaveBeenCalled();
    tick(25);
    expect(matDialogRef.close).not.toHaveBeenCalled();
    tick(1000);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it('should delete not on destroy', fakeAsync(() => {
    component.ngOnDestroy();

    expect(artifactService.deleteArtifact).not.toHaveBeenCalled();
    tick(25);
    expect(matDialogRef.close).not.toHaveBeenCalled();
    tick(1000);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  afterEach(() => {
    component.artifactId = 0; // reset for onDestroy
  });
});
