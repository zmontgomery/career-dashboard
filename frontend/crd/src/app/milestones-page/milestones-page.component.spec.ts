import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesPageComponent } from './milestones-page.component';
import {MilestonesComponent} from "./milestones/milestones.component";
import {MockComponent} from "ng-mocks";

describe('MilestonesPageComponent', () => {
  let component: MilestonesPageComponent;
  let fixture: ComponentFixture<MilestonesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestonesPageComponent, MockComponent(MilestonesComponent)]
    });
    fixture = TestBed.createComponent(MilestonesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
