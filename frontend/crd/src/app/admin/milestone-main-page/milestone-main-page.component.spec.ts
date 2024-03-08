import { ComponentFixture, TestBed } from '@angular/core/testing';
import createSpyObj = jasmine.createSpyObj;
import { of } from "rxjs";
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneMainPageComponent } from './milestone-main-page.component';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MilestoneCreateModalComponent } from './milestone-create-modal/milestone-create-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';


describe('MilestoneMainPageComponent', () => {
  let component: MilestoneMainPageComponent;
  let fixture: ComponentFixture<MilestoneMainPageComponent>;
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    events: [],
    tasks: [],
    description: "testing"
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule, 
        MatGridListModule, 
        MatTabsModule, 
        NoopAnimationsModule, 
        MatDialogModule, 
        HttpClientModule,
        MatInputModule
      ],
      declarations: [MilestoneMainPageComponent],
      providers: [
        MatDialog,
        {provide: MilestoneService, useValue: milestoneServiceSpy}
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(MilestoneMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the MilestoneCreate in a MatDialog', () => {
    spyOn(component.matDialog,'open').and.callThrough();
    component.openMilestoneCreateModal(YearLevel.Freshman);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      yearLevel: YearLevel.Freshman
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(MilestoneCreateModalComponent, dialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
