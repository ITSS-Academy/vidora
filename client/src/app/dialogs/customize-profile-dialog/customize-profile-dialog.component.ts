import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatTextColumn} from '@angular/material/table';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {UserModel} from '../../../models/user.model';
import {user} from '@angular/fire/auth';
import {Store} from '@ngrx/store';
import {UserState} from '../../../ngrxs/user/user.state';

@Component({
  selector: 'app-customize-profile-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatTextColumn,
    MatFormField,
    MatInput,
    AsyncPipe
  ],
  templateUrl: './customize-profile-dialog.component.html',
  styleUrl: './customize-profile-dialog.component.scss'
})
export class CustomizeProfileDialogComponent {
  userProfile$: Observable<UserModel>;
  constructor(
    private dialogRef: MatDialogRef<CustomizeProfileDialogComponent>,
   private store: Store<{user: UserState}>
  ) {
    this.userProfile$ = this.store.select('user','user');
  }





  close(): void {
    this.dialogRef.close();
  }
}
