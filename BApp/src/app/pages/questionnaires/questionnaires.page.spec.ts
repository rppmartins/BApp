import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnairePage } from './questionnaires.page';

describe('QuestionnairePage', () => {
  let component: QuestionnairePage;
  let fixture: ComponentFixture<QuestionnairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionnairePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
