import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleMenuComponent } from './edit-role-menu.component';

describe('EditRoleMenuComponent', () => {
  let component: EditRoleMenuComponent;
  let fixture: ComponentFixture<EditRoleMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRoleMenuComponent]
    });
    fixture = TestBed.createComponent(EditRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
