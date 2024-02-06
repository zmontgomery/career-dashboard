import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskEditModalComponent],
      imports: [
        HttpClientTestingModule, 
        HttpClientModule, 
        MatDialogModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule,
        ReactiveFormsModule,
        MatRadioModule,
        NoopAnimationsModule
      ],
      providers: [
        MatDialog, 
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


