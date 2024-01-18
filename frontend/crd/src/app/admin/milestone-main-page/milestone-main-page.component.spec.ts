import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneMainPageComponent } from './milestone-main-page.component';

describe('MilestoneMainPageComponent', () => {
  let component: MilestoneMainPageComponent;
  let fixture: ComponentFixture<MilestoneMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneMainPageComponent]
    });
    fixture = TestBed.createComponent(MilestoneMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
