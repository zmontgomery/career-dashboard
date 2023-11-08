import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OswegoLogoComponent } from './oswego-logo.component';
import {NgOptimizedImage} from "@angular/common";

describe('OswegoLogoComponent', () => {
  let component: OswegoLogoComponent;
  let fixture: ComponentFixture<OswegoLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OswegoLogoComponent],
      imports: [NgOptimizedImage],
    });
    fixture = TestBed.createComponent(OswegoLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
