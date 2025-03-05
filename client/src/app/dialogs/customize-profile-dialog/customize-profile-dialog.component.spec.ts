import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeProfileDialogComponent } from './customize-profile-dialog.component';

describe('CustomizeProfileDialogComponent', () => {
  let component: CustomizeProfileDialogComponent;
  let fixture: ComponentFixture<CustomizeProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeProfileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
