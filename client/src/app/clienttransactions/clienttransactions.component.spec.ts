import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienttransactionsComponent } from './clienttransactions.component';

describe('ClienttransactionsComponent', () => {
  let component: ClienttransactionsComponent;
  let fixture: ComponentFixture<ClienttransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienttransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienttransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
