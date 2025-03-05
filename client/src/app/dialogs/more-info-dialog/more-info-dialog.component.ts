import { Component } from '@angular/core';
import {MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-more-info-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIcon,
    MatIconModule
  ],
  templateUrl: './more-info-dialog.component.html',
  styleUrl: './more-info-dialog.component.scss',
})
export class MoreInfoDialogComponent {
  constructor(private dialogRef: MatDialogRef<MoreInfoDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
