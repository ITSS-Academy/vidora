import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreInfoDialogComponent } from './more-info-dialog.component';

describe('MoreInfoDialogComponent', () => {
  let component: MoreInfoDialogComponent;
  let fixture: ComponentFixture<MoreInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
