import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBuyComponent } from './list-buy.component';

describe('ListBuyComponent', () => {
  let component: ListBuyComponent;
  let fixture: ComponentFixture<ListBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBuyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
