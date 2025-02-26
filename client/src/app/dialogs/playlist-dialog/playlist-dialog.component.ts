import {Component, model} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-playlist-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatCardContent,
    MatCard,
    MatCheckbox,
    FormsModule,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './playlist-dialog.component.html',
  styleUrl: './playlist-dialog.component.scss'
})
export class PlaylistDialogComponent {
  readonly checked = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  constructor(private dialogRef: MatDialogRef<PlaylistDialogComponent>) {
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
