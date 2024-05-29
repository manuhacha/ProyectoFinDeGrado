import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityalbumsComponent } from './communityalbums.component';

describe('CommunityalbumsComponent', () => {
  let component: CommunityalbumsComponent;
  let fixture: ComponentFixture<CommunityalbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityalbumsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityalbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
