import { Component } from '@angular/core';
@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss'
})
export class PlaylistCardComponent {
  playlist=
    {
      title: 'Playlist 1',
    image: 'https://i.ytimg.com/vi/a2jNL1Jusi0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC-YRu9VYrK8L8ayV6jwb80hcwD1g',
    }

}
