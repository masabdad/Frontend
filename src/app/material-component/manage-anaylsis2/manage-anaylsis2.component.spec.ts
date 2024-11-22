import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnaylsis2Component } from './manage-anaylsis2.component';

describe('ManageAnaylsis2Component', () => {
  let component: ManageAnaylsis2Component;
  let fixture: ComponentFixture<ManageAnaylsis2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAnaylsis2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAnaylsis2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
