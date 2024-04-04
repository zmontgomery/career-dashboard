import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ResumeComponent } from './resume.component';
import { Artifact } from 'src/domain/Artifact';
import { userJSON } from 'src/app/security/auth.service.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { of } from 'rxjs';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { SubmissionModalComponent } from 'src/app/submissions/submission-modal/submission-modal.component';
import { SubmissionService } from 'src/app/submissions/submission.service';
import { submission1JSON, submission2 } from 'src/app/submissions/submission.service.spec';
import { TaskService } from 'src/app/util/task.service';
import { task } from 'src/app/util/task.service.spec';
import { Submission } from 'src/domain/Submission';
import { DeleteResumeConfirmationDialogComponent } from '../delete-resume-confirmation-dialog/delete-resume-confirmation-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;
  let matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed'])
  let matDialog = jasmine.createSpyObj('MatDialog', ['open']);
  let artifactSvc = jasmine.createSpyObj('ArtifactService', ['getArtifactFile']);
  const artifact1JSON = {
    fileName: "string",
    id: 2,
    submissionDate: new Date(),
    submission: 1,
  }
  const artifact2JSON = {
    fileName: "string",
    id: 1,
    submissionDate: new Date(),
    submission: 1,
  }
  const artifact1 = new Artifact(artifact1JSON);
  const mockPdfBlob = new Blob(['fake PDF content'], { type: 'application/pdf' });
  let submissionService = jasmine.createSpyObj('SubmissionService', ['getLatestSubmission']);
  let taskService = jasmine.createSpyObj('TaskService', ['findById']);
  let authService = jasmine.createSpyObj('AuthService', ['toString'], {user$:of(new User(userJSON))});

  beforeEach(() => {
    submissionService.getLatestSubmission.and.returnValue(of({...submission1JSON, artifactId: 2}));
    taskService.findById.and.returnValue(of(task));
    matDialog.open.and.returnValue(matDialogRef);
    matDialogRef.afterClosed.and.returnValue(of());
    artifactSvc.getArtifactFile.and.returnValue(of(mockPdfBlob));
    taskService.findById.and.returnValue(of(task));
    TestBed.configureTestingModule({
      declarations: [
        ResumeComponent,
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        HttpClientTestingModule,
        PdfViewerModule,
        MatProgressSpinnerModule
      ],
      providers: [
        {provide: MatDialog, useValue: matDialog},
        {provide: ArtifactService, useValue: artifactSvc},
        {provide: SubmissionService, useValue: submissionService},
        {provide: TaskService, useValue: taskService},
        {provide: AuthService, useValue: authService}
      ]
    });
    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open dialog', fakeAsync(() => {
    component.openDialog();
    tick(1000);
    expect(taskService.findById).toHaveBeenCalled();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {
      task: task
    }
    expect(matDialog.open).toHaveBeenCalledWith(SubmissionModalComponent,
      dialogConfig
    )
  }));

  it('update Artifacts with file', fakeAsync(() => {
    submissionService.getLatestSubmission.and.returnValue(of(submission2));
    // @ts-ignore
    component.fetchCurrentArtifact();
    tick(1000);
    expect(component.showUploadButton).toBeFalse();
    expect(component.pdfURL).toBeTruthy();
  }));

  it('update Artifacts id is 1', fakeAsync(() => {
    submissionService.getLatestSubmission
      .and.returnValue(of(new Submission({...submission1JSON, artifactId: 1})));

    // @ts-ignore
    component.fetchCurrentArtifact();
    tick(1000);
    expect(component.showUploadButton).toBeTrue();
    expect(component.pdfURL).toBeFalsy();
  }));

  it('should delete resume', fakeAsync(() => {
    component.artifactId = 2;
    spyOn(component, 'fetchCurrentArtifact');
    matDialogRef.afterClosed.and.returnValue(of(true));


    component.deleteResume();
    tick(1000);
    expect(matDialog.open).toHaveBeenCalledWith(DeleteResumeConfirmationDialogComponent,
      {data: {artifactId: 2} }
    )
    expect(component.fetchCurrentArtifact).toHaveBeenCalled();
  }));

  it('should delete resume but not call update artifacts', fakeAsync(() => {
    component.artifactId = 1;
    spyOn(component, 'fetchCurrentArtifact');
    matDialogRef.afterClosed.and.returnValue(of(false));

    component.deleteResume();
    tick(1000);
    expect(matDialog.open).toHaveBeenCalledWith(DeleteResumeConfirmationDialogComponent,
      {data: {artifactId: 1} }
    )
    expect(component.fetchCurrentArtifact).not.toHaveBeenCalled();
  }));

  it('can delete', () => {
    component.artifactId = 0;
    expect(component.canDelete()).toBeFalse();
    component.artifactId = 1;
    expect(component.canDelete()).toBeFalse();
    component.artifactId = 2;
    expect(component.canDelete()).toBeTrue();
  });
});
