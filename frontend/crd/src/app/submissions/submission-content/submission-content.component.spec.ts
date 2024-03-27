import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SubmissionContentComponent } from './submission-content.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { AuthService } from 'src/app/security/auth.service';
import { userJSON } from 'src/app/security/auth.service.spec';
import { User } from 'src/app/security/domain/user';
import { YearLevel } from 'src/domain/Milestone';
import { Task, TaskType } from 'src/domain/Task';
import { SubmissionModalComponent } from '../submission-modal/submission-modal.component';
import { SubmissionService } from '../submission.service';
import { submission1 } from '../submission.service.spec';
import { taskJSON } from 'src/app/util/task.service.spec';

describe('SubmissionContentComponent', () => {
  let component: SubmissionContentComponent;
  let fixture: ComponentFixture<SubmissionContentComponent>;

  let artifactService: jasmine.SpyObj<ArtifactService>;
  let submissionService: jasmine.SpyObj<SubmissionService>;
  let authService: jasmine.SpyObj<AuthService>;

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
        {provide: MAT_DIALOG_DATA, useValue: {task: task}}
      ]
    });
    fixture = TestBed.createComponent(SubmissionContentComponent);
    component = fixture.componentInstance;
    component.task = task;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', fakeAsync(() => {
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })

    component.onCancel();
  }));

  it('should be enabled', () => {
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })
    expect(component.isEnabled()).toBeTrue();
    component.state = 'cancelling';
    expect(component.isEnabled()).toBeFalse();
  });

  it('should be submittable', () => {
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })
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
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })
    submissionService.submit.and.returnValue(of(submission1));
    component.onSubmit();
    tick(50);
    expect(submissionService.submit).toHaveBeenCalled();
    expect(component.state).toEqual('submitting');
  }));

  it('should delete on destroy', fakeAsync(() => {
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })

    artifactService.deleteArtifact.and.returnValue(of('a'));
    component.artifactId = 2;
    component.state = 'nominal';

    component.ngOnDestroy();

    expect(artifactService.deleteArtifact).toHaveBeenCalled();
    tick(25);
  }));

  it('should delete not on destroy', fakeAsync(() => {
    component.cancel.subscribe(() => {
      expect(true).toBeTrue();
    })

    component.ngOnDestroy();

    expect(artifactService.deleteArtifact).not.toHaveBeenCalled();
    tick(25);
  }));

  afterEach(() => {
    component.artifactId = 0; // reset for onDestroy
  });
});
