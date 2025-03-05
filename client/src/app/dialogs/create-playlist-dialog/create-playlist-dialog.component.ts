import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/modules/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/modules/shared.module';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { UserState } from '../../../ngrxs/user/user.state';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-playlist-dialog',
  standalone: true,
  imports: [SharedModule, MaterialModule],
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.scss',
})
export class CreatePlaylistDialogComponent implements OnInit {
  subscriptions: Subscription[] = [];
  playlistForm!: FormGroup;
  user$: Observable<UserModel>;
  user!: UserModel;
  options = [
    { value: 'true', label: 'Public' },
    { value: 'false', label: 'Private' },
  ];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<{
      user: UserState;
      playlist: PlaylistState;
    }>,
    private alertService: AlertService,
  ) {
    this.user$ = this.store.select('user', 'user');
  }

  ngOnInit() {
    this.playlistForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      visibility: ['', Validators.required],
    });
    this.subscriptions.push(
      this.user$.subscribe((user: UserModel) => {
        if (user.id) {
          this.user = user;
        }
      }),
      this.store
        .select('playlist', 'isCreatePlaylistSuccess')
        .subscribe((isCreatePlaylistSuccess) => {
          if (isCreatePlaylistSuccess) {
            this.alertService.showAlert(
              `Playlist created successfully!`,
              'Close',
              3000,
              'end',
              'top',
            );
            this.closeDialog();
          }
        }),
    );
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  createPlaylist() {
    if (this.playlistForm.invalid) {
      return;
    }

    const createPlaylistModel = {
      title: this.playlistForm.get('title')?.value,
      is_public: this.playlistForm.get('visibility')?.value === 'true',
      user_id: this.user.id,
    };

    this.store.dispatch(
      PlaylistActions.createPlaylist({
        createPlaylistDto: createPlaylistModel,
      }),
    );
  }
}
