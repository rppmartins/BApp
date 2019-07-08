import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophiesPage } from './trophies.page';

describe('TrophiesPage', () => {
  let component: TrophiesPage;
  let fixture: ComponentFixture<TrophiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrophiesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrophiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
