import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokertransactionsComponent } from './brokertransactions.component';

describe('BrokertransactionsComponent', () => {
  let component: BrokertransactionsComponent;
  let fixture: ComponentFixture<BrokertransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokertransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokertransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
