import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerprevioustransactionsComponent } from './brokerprevioustransactions.component';

describe('BrokerprevioustransactionsComponent', () => {
  let component: BrokerprevioustransactionsComponent;
  let fixture: ComponentFixture<BrokerprevioustransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerprevioustransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerprevioustransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
