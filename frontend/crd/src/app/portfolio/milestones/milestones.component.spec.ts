import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesComponent } from './milestones.component';
import {of} from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import {Milestone, YearLevel} from "../../../domain/Milestone";
import {MilestoneService} from "./MilestoneService";

describe('MilestonesComponent', () => {
  let component: MilestonesComponent;
  let fixture: ComponentFixture<MilestonesComponent>;
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    milestoneID: "id",
    active: true,
    events: [],
    tasks: [],
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{provide: MilestoneService, useValue: milestoneServiceSpy}],
      declarations: [MilestonesComponent]
    });
    fixture = TestBed.createComponent(MilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
