import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { UserState } from '../../../ngrxs/user/user.state';
import * as UserActions from '../../../ngrxs/user/user.actions';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../../shared/modules/shared.module';

@Component({
  selector: 'app-customize-profile-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    AsyncPipe,
    FormsModule,
    SharedModule,
  ],
  templateUrl: './customize-profile-dialog.component.html',
  styleUrl: './customize-profile-dialog.component.scss',
})
export class CustomizeProfileDialogComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user$: Observable<UserModel>;
  user!: UserModel;
  @ViewChild('avatarInput') avatarInput!: ElementRef;
  @ViewChild('bannerInput') bannerInput!: ElementRef;
  bannerUrl: string | null = null;
  editProfileForm!: FormGroup;
  bannerFile!: File;
  avatarFile!: File;

  constructor(
    private dialogRef: MatDialogRef<CustomizeProfileDialogComponent>,
    private store: Store<{ user: UserState }>,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.user$ = this.store.select('user', 'user');
  }

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      describe: new FormControl('', Validators.required),
    });

    this.subscriptions.push(
      this.user$.subscribe((user) => {
        if (user) {
          this.user = user;
          this.editProfileForm.patchValue({ describe: user.describe });
        }
      }),
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  onAvatarClick(): void {
    this.avatarInput.nativeElement.click();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.avatarFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.querySelector('.image') as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBannerClick(): void {
    this.bannerInput.nativeElement.click();
  }

  onBannerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.bannerFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.querySelector(
          '.banner',
        ) as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
      this.bannerUrl = URL.createObjectURL(file);
    }
  }

  onSave(): void {
    if (this.editProfileForm.invalid) {
      return;
    }
    if (this.avatarFile) {
      this.store.dispatch(
        UserActions.updateAvatar({
          avatar: this.avatarFile,
          userId: this.user.id,
        }),
      );
    }
    if (this.bannerFile) {
      this.store.dispatch(
        UserActions.updateChannelImage({
          channelImg: this.bannerFile,
          userId: this.user.id,
        }),
      );
    }
    this.store.dispatch(
      UserActions.updateDescribe({
        userId: this.user.id,
        describe: this.editProfileForm.value.describe,
      }),
    );
    this.dialogRef.close();
  }

  onCancel() {
    if (
      this.avatarFile ||
      this.bannerFile ||
      this.editProfileForm.value.describe !== this.user.describe
    ) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'You have unsaved changes. Are you sure you want to leave?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
