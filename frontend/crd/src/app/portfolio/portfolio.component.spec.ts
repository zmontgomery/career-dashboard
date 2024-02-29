import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PortfolioComponent } from './portfolio.component';
import {MockComponent} from "ng-mocks";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ArtifactService} from "../file-upload/artifact.service";
import {of} from "rxjs";
import {Artifact} from "../../domain/Artifact";
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { task } from '../util/task.service.spec';
import { submission1 } from '../submissions/submission.service.spec';
import { SubmissionService } from '../submissions/submission.service';
import { TaskService } from '../util/task.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AuthService } from '../security/auth.service';
import { userJSON } from '../security/auth.service.spec';
import { User } from '../security/domain/user';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed'])
  matDialogRef.afterClosed.and.returnValue(of())
  let matDialog = jasmine.createSpyObj('MatDialog', ['open']);
  matDialog.open.and.returnValue(matDialogRef)
  let artifactSvc = jasmine.createSpyObj('ArtifactService', ['getArtifactFile']);
  const artifact1JSON = {
    fileName: "string",
    id: 1,
    submissionDate: new Date(),
    submission: 1,
  }
  const artifact1 = new Artifact(artifact1JSON);
  const mockPdfBlob = new Blob(['fake PDF content'], { type: 'application/pdf' });
  artifactSvc.getArtifactFile.and.returnValue(of(mockPdfBlob));
  let submissionService = jasmine.createSpyObj('SubmissionService', ['getLatestSubmission']);
  submissionService.getLatestSubmission.and.returnValue(of(submission1));
  let taskService = jasmine.createSpyObj('TaskService', ['findById']);
  let authService = jasmine.createSpyObj('AuthService', ['toString'], {user$:of(new User(userJSON))});
  taskService.findById.and.returnValue(of(task));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent(MilestonesComponent),
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        HttpClientTestingModule,
        PdfViewerModule
      ],
      providers: [
        {provide: MatDialog, useValue: matDialog},
        {provide: ArtifactService, useValue: artifactSvc},
        {provide: SubmissionService, useValue: submissionService},
        {provide: TaskService, useValue: taskService},
        {provide: AuthService, useValue: authService}
      ]
    });
    fixture = TestBed.createComponent(PortfolioComponent);
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
    expect(matDialog.open).toHaveBeenCalledWith(SubmissionModalComponent,
      {data: {task: task} }
    )
  }));

  it('update Artifacts', fakeAsync(() => {   
    tick(1000);
    expect(component.showUploadButton).toBeFalse();
    expect(component.pdfURL).toBeTruthy();
  }));
});
