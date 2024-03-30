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
import { Milestone, YearLevel } from 'src/domain/Milestone';
import {MatSnackBarModule} from "@angular/material/snack-bar";


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
        MatSnackBarModule,
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
    const locationSpy = jasmine.createSpyObj('location', ['reload']);
    TestBed.overrideProvider(location, { useValue: locationSpy });
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
      name: [null, Validators.required],
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
    let spyRouter = spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));

    component.newMilestone();
    expect(spy).toHaveBeenCalled();
  });

  it('should block create with no name', () => {
    component.milestoneForm = formBuilder.group({
      name: [null, Validators.required],
      description: [null],
    });
    // @ts-ignore
    let spySnackBar = spyOn(component._snackBar, 'open');

    component.newMilestone();

    expect(spySnackBar).toHaveBeenCalled();
  });

  it('should throw error', () => {
    component.milestoneForm = formBuilder.group({
      name: ["new", Validators.required],
      description: [null],
    });
    component.yearLevel = YearLevel.Freshman;

    let spy = spyOn(component.http, 'post').and.returnValue(of({
      name: ""
    }));
    // @ts-ignore
    let spySnackBar = spyOn(component._snackBar, 'open');

    let spyRouter = spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));

    component.newMilestone();

    expect(spySnackBar).toHaveBeenCalled();
  });

  it('should navigate away', () => {
    component.milestoneForm = formBuilder.group({
      name: ["new", Validators.required],
      description: [null],
    });
    component.yearLevel = YearLevel.Freshman;

    let spy = spyOn(component.http, 'post').and.returnValue(of({
      name: "new",
      yearLevel: YearLevel.Freshman,
      id: 1,
      events: [],
      tasks: [],
      description: "testing"
    }));
    let spyMilestone = spyOn(component.milestoneService, 'getMilestones').and.returnValue(of([new Milestone({
      name: "new",
      yearLevel: YearLevel.Freshman,
      id: 1,
      events: [],
      tasks: [],
      description: "testing"
    })]));
    let spyRouter = spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));
    let spyClose = spyOn(component, 'closeModal');

    component.newMilestone();
    expect(spyRouter).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


