import {Component, ViewEncapsulation} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {MaterialModule} from '../../../shared/modules/material.module';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-playlist-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MaterialModule
  ],
  templateUrl: './edit-playlist-dialog.component.html',
  styleUrl: './edit-playlist-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditPlaylistDialogComponent {
  playlistForm: FormGroup;
  playlist = {
    title: 'Playlist 1',
    description: 'This is a sample playlist',
    image:
      'https://i.ytimg.com/vi/a2jNL1Jusi0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC-YRu9VYrK8L8ayV6jwb80hcwD1g',
  };
  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    // Initialize form with current playlist data
    this.playlistForm = this.fb.group({
      title: [this.playlist.title, [Validators.required, Validators.maxLength(256)]],
      description: [this.playlist.description, [Validators.maxLength(500)]],
    });
  }

  // Method to close the dialog
  closeDialog() {
    this.dialog.closeAll();
    console.log('Dialog closed');
  }

  // Method to save edited playlist
  saveEditPlaylist() {
    if (this.playlistForm.valid) {
      const editedPlaylist = this.playlistForm.value;
      console.log('Playlist saved:', editedPlaylist);
      this.closeDialog();
    } else {
      console.log('Form is invalid, please check the fields.');
    }
  }

}
