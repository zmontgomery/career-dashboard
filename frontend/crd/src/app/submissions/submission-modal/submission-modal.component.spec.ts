import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SubmissionModalComponent } from './submission-modal.component';
import { User } from 'src/app/security/domain/user';
import { Task, TaskType } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { userJSON } from 'src/app/security/auth.service.spec';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { SubmissionContentComponent } from '../submission-content/submission-content.component';

describe('SubmissionModalComponent', () => {
  let component: SubmissionModalComponent;
  let fixture: ComponentFixture<SubmissionModalComponent>;

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

  beforeEach(() => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [
        SubmissionModalComponent,
        MockComponent(SubmissionContentComponent)
      ],
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

  it('should close on cancel', fakeAsync(() => {
    component.onCancel();
    tick(25);
    expect(matDialogRef.close).not.toHaveBeenCalled();
    tick(100);
    expect(matDialogRef.close).toHaveBeenCalled();
  }));
});
