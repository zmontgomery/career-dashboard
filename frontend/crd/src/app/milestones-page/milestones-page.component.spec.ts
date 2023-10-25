import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesPageComponent } from './milestones-page.component';

describe('MilestonesPageComponent', () => {
  let component: MilestonesPageComponent;
  let fixture: ComponentFixture<MilestonesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestonesPageComponent]
    });
    fixture = TestBed.createComponent(MilestonesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
