import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-room-hub',
  templateUrl: './room-hub.component.html',
  styleUrls: ['./room-hub.component.css']
})
export class RoomHubComponent {
  constructor(
    public gameService: GameService,
    public audioService: AudioService,
    private router: Router
  ) {
    this.audioService.playTrack('background');
  }

  get allSolved(): boolean {
    return this.gameService.allRoomsSolved();
  }

  goToRoom(room: string): void {
    this.router.navigate(['/room/' + room]);
  }

  goToVault(): void {
    this.router.navigate(['/vault']);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }

  openMasterkey(): void {
    const input = window.prompt('Enter Masterkey password:');
    if (input === null) {
      return;
    }
    if (input === '#9999') {
      this.gameService.setRoomCode('room1', '42');
      this.gameService.setRoomCode('room2', '73');
      this.gameService.setRoomCode('room3', '58');
      this.router.navigate(['/vault'], { state: { masterkey: true } });
    }
  }
}
