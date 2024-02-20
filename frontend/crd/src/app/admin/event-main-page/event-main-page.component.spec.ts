import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventMainPageComponent } from './event-main-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

describe('EventMainPageComponent', () => {
  let component: EventMainPageComponent;
  let fixture: ComponentFixture<EventMainPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventMainPageComponent],
      imports: [
        HttpClientTestingModule, 
        HttpClientModule, 
        MatDialogModule, 
        MatTabsModule,
        MatListModule
      ],
      providers: [MatDialog],
    });
    fixture = TestBed.createComponent(EventMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
