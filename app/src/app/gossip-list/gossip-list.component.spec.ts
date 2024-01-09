import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GossipListComponent } from './gossip-list.component';

describe('GossipListComponent', () => {
  let component: GossipListComponent;
  let fixture: ComponentFixture<GossipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GossipListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GossipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
