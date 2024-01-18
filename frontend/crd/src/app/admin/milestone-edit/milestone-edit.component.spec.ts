import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MilestoneEditComponent } from './milestone-edit.component';
import { BehaviorSubject, of } from "rxjs";

describe('MilestoneEditComponent', () => {
  let component: MilestoneEditComponent;
  let fixture: ComponentFixture<MilestoneEditComponent>;
  const paramMap = new BehaviorSubject(convertToParamMap({ name: 'name'  }));
  const activatedRouteMock = {
    params: paramMap.asObservable(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }
      ]
    });
    fixture = TestBed.createComponent(MilestoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
