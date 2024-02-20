import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MilestoneCreateModalComponent } from './milestone-create-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { YearLevel } from 'src/domain/Milestone';


describe('MilestoneCreateModalComponent', () => {
  let component: MilestoneCreateModalComponent;
  let fixture: ComponentFixture<MilestoneCreateModalComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let dialogMock = {
    close: () => { }
    };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneCreateModalComponent],
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
        FormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(MilestoneCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should build blank form', () => {
    component.createForm();

    const sampleForm = formBuilder.group({
      name: [null, Validators.required]
    });

    expect(component.milestoneForm.get('name')!.value).toEqual(sampleForm.get('name')!.value);
  });

  it('should save milestone', () => {
    component.milestoneForm = component.formBuilder.group({
      name: [null, Validators.required],   //this field is hidden if the task already exists
    });

    component.milestoneForm.get('name')?.setValue("new")

    let spy = spyOn(component.http, 'post').and.returnValue(of({
      name: "new",
      yearLevel: YearLevel.Freshman,
      id: 1,
      events: [],
      tasks: [],
      description: "testing"
    }));

    component.newMilestone();
    expect(spy).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


