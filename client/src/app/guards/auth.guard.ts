import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import * as AuthActions from '../../ngrxs/auth/auth.actions';
import { AuthState } from '../../ngrxs/auth/auth.state';
import { Store } from '@ngrx/store';

export const canActivateHistory: CanActivateFn = () => {
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const store = inject(Store<{ auth: AuthState }>);
  return inject(AuthService)
    .isSignedIn()
    .pipe(
      map((isSignedIn) => {
        if (isSignedIn) {
          return true;
        } else {
          // Show dialog login with google
          store.dispatch(AuthActions.signInWithGoogle());
          return false;
        }
      }),
    );
};
