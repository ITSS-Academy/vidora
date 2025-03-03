import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MaterialModule} from '../../../shared/modules/material.module';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-playlist-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatFormField,
    MatInput,
    MaterialModule,
    FormsModule,
  ],
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.scss'
})
export class CreatePlaylistDialogComponent {
  private title: any;
  constructor(public dialog: MatDialog) {}
  closeDialog() {
    this.dialog.closeAll();
    console.log('Dialog closed');
  }
  valueVisibility: string| null = null;
  options = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'restricted', label: 'Restricted' }
  ];
  valueDefault: string| null = null;
  optionDefault = [
    { value: 'date published (newest)', label: 'Date published (newest)' },
    { value: 'date published (oldest)', label: 'Date published (oldest)' },
    { value: 'most popular', label: 'Most popular' },
    { value: 'date added (newest)', label: 'Date added (newest)' },
    { value: 'date added (oldest)', label: 'Date added (oldest)' },
    { value: 'manually sorted in YouTube', label: 'Manually sorted in YouTube' }
  ];
}
