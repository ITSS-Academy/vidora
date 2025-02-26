import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CategoryState } from '../../../ngrxs/category/category.state';
import { Observable, Subscription } from 'rxjs';
import { CategoryModel } from '../../../models/category.model';
import * as CategoryActions from '../../../ngrxs/category/category.actions';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import { VideoState } from '../../../ngrxs/video/video.state';
import { CreateVideoDto } from '../../../models/video.model';
import { VideoService } from '../../../services/video.service';
import { AlertService } from '../../../services/alert.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-video-dialog',
  standalone: true,
  imports: [MaterialModule, SharedModule],
  templateUrl: './create-video-dialog.component.html',
  styleUrl: './create-video-dialog.component.scss',
})
export class CreateVideoDialogComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  isFormDisabled = false;
  videoFile!: File;
  thumbnailFile!: File;
  uploadForm!: FormGroup;
  categories$: Observable<CategoryModel[]>;
  videoDto!: CreateVideoDto;
  uploadProgress$: Observable<number | null>;
  isCreateVideoSuccess$: Observable<boolean>;

  constructor(
    private store: Store<{ category: CategoryState; video: VideoState }>,
    private dialogRef: MatDialogRef<CreateVideoDialogComponent>,
    private fb: FormBuilder,
    private videoService: VideoService,
    private alertService: AlertService,
    private dialog: MatDialog, // Inject MatDialog
  ) {
    this.categories$ = this.store.select('category', 'categories');
    this.isCreateVideoSuccess$ = this.store.select(
      'video',
      'isCreateVideoSuccess',
    );
    this.store.dispatch(CategoryActions.getAllCategories());
    this.uploadProgress$ = this.videoService.getUploadProgress();
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      fileName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(5000)]],
      categories: ['', Validators.required],
      visibility: ['', Validators.required],
      thumbnail: ['', Validators.required],
    });

    this.subscription.push(
      this.isCreateVideoSuccess$.subscribe((isSuccess) => {
        if (isSuccess) {
          this.alertService.showAlert(
            `Video uploaded successfully!`,
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'If you close, the video upload will be cancelled. Are you sure you want to close?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }

  onUploadButtonClick() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
      this.uploadForm.patchValue({ fileName: file.name });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.uploadFile(file);
      this.uploadForm.patchValue({ fileName: file.name });
    }
  }

  uploadFile(file: File) {
    if (file.type === 'video/mp4') {
      this.videoFile = file;
      // Handle the file upload
    } else {
      console.error('Invalid file type. Please upload an MP4 file.');
    }
  }

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadForm.patchValue({ thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
      this.thumbnailFile = file;
    }
  }

  onEditThumbnailClick() {
    const fileInput = document.getElementById(
      'edit-thumbnail-file-input',
    ) as HTMLInputElement;
    fileInput.click();
  }

  onThumbnailInputClick() {
    const fileInput = document.getElementById(
      'thumbnail-file-input',
    ) as HTMLInputElement;
    fileInput.click();
  }

  onUploadClick() {
    if (this.uploadForm.valid && this.videoFile) {
      this.disableForm();
      const formValues = this.uploadForm.value;

      this.videoDto = {
        title: formValues.fileName,
        description: formValues.description,
        category_id: formValues.categories,
        playlist_id: [],
      };

      this.store.dispatch(
        VideoActions.createVideo({
          createVideoDto: this.videoDto,
          videoFile: this.videoFile,
          imageFile: this.thumbnailFile,
        }),
      );
    }
  }

  disableForm() {
    this.uploadForm.disable();
    this.isFormDisabled = true;
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
