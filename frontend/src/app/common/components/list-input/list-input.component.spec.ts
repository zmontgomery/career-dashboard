import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInputComponent } from './list-input.component';

describe('ListInputComponent', () => {
  let component: ListInputComponent;
  let fixture: ComponentFixture<ListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInputComponent]
    });
    fixture = TestBed.createComponent(ListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
