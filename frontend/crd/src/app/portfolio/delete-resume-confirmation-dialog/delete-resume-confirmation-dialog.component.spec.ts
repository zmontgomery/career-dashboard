import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import { DeleteResumeConfirmationDialogComponent } from './delete-resume-confirmation-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('DeleteResumeConfirmationDialogComponent', () => {
  let component: DeleteResumeConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteResumeConfirmationDialogComponent>;

  let ref: jasmine.SpyObj<MatDialogRef<DeleteResumeConfirmationDialogComponent>>;
  let artifactService: jasmine.SpyObj<ArtifactService>;
  let data: { artifactId: number };


  beforeEach(() => {
    ref = jasmine.createSpyObj('MatDialogRef', ['close']);
    artifactService = jasmine.createSpyObj(ArtifactService, ['deleteArtifact']);
    data = {artifactId: 2};

    artifactService.deleteArtifact.and.returnValue(of(''));

    TestBed.configureTestingModule({
      declarations: [DeleteResumeConfirmationDialogComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        MatButtonModule
      ],
      providers: [
        {provide: MatDialogRef, useValue: ref},
        {provide: ArtifactService, useValue: artifactService},
        {provide: MAT_DIALOG_DATA, useValue: data}
      ]
    });
    fixture = TestBed.createComponent(DeleteResumeConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', () => {
    component.onCancel();

    expect(ref.close).toHaveBeenCalledWith(false);
  });

  it('should confirm', fakeAsync(() => {
    component.onConfirm();
    tick(1000)
    expect(artifactService.deleteArtifact).toHaveBeenCalledWith(2);
    expect(ref.close).toHaveBeenCalledWith(true);
  }));
});
