import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatTextColumn} from '@angular/material/table';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-customize-profile-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatTextColumn,
    MatFormField,
    MatInput
  ],
  templateUrl: './customize-profile-dialog.component.html',
  styleUrl: './customize-profile-dialog.component.scss'
})
export class CustomizeProfileDialogComponent {
  constructor(private dialogRef: MatDialogRef<CustomizeProfileDialogComponent>) {
  }


  close(): void {
    this.dialogRef.close();
  }
}
