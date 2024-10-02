import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeProgramListInputComponent } from './degree-program-list-input.component';

describe('ListInputComponent', () => {
  let component: DegreeProgramListInputComponent;
  let fixture: ComponentFixture<DegreeProgramListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeProgramListInputComponent],
    });
    fixture = TestBed.createComponent(DegreeProgramListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
