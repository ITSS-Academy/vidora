import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader, MatCardMdImage,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup
} from '@angular/material/card';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatCardHeader,
    MatCard,
    MatCardTitle,
    MatCardTitleGroup,
    MatCardContent,
    MatCardSubtitle,
    MatCardMdImage
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent {

}
