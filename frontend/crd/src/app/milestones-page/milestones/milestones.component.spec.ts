import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesComponent } from './milestones.component';
import {of} from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import {Milestone, YearLevel} from "../../../domain/Milestone";
import {MatCardModule} from "@angular/material/card";
import { MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MilestoneService} from "./milestone.service";

describe('MilestonesComponent', () => {
  let component: MilestonesComponent;
  let fixture: ComponentFixture<MilestonesComponent>;
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    description: "sample",
    events: [],
    tasks: [],
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule, MatCheckboxModule, NoopAnimationsModule],
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
