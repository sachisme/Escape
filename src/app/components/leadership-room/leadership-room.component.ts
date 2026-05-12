import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { StacyService } from 'src/app/services/stacy.service';

type HotspotKey = 'mug' | 'blueprint' | 'phone' | 'tsquare';

@Component({
  selector: 'app-leadership-room',
  templateUrl: './leadership-room.component.html',
  styleUrls: ['./leadership-room.component.css']
})
export class LeadershipRoomComponent implements OnInit, OnDestroy {
  dialValues: number[] = [0, 0, 0, 0];
  isVaultOpen = false;
  roomCode = '73';

  insightMessage = '';
  insightVisible = false;
  insightTitle = '';
  private insightTimer: number | null = null;

  stacyMessage = '';

  hotspotMessages: Record<HotspotKey, { title: string; message: string }> = {
    mug: {
      title: 'One Team',
      message: 'Leadership starts with One Team.'
    },
    blueprint: {
      title: 'Cloud Nine',
      message: 'A Cloud Nine design: Visionary leaders always look to the horizon.'
    },
    phone: {
      title: 'Zero Surprise',
      message: 'Commit to a Zero Surprise Partnership: Communicate fearlessly.'
    },
    tsquare: {
      title: 'Motivate (V8)',
      message: 'Great leaders Motivate (Moti-V8): Powering our future through performance.'
    }
  };

  constructor(
    private gameService: GameService,
    public audioService: AudioService,
    private stacyService: StacyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.audioService.playTrack('background');
    this.stacyMessage = this.stacyService.getSpecificQuote('room2Enter', 2);
  }

  ngOnDestroy(): void {
    if (this.insightTimer !== null) {
      window.clearTimeout(this.insightTimer);
      this.insightTimer = null;
    }
  }

  showInsight(key: HotspotKey): void {
    this.audioService.playClick();
    const insight = this.hotspotMessages[key];
    this.insightTitle = insight.title;
    this.insightMessage = insight.message;
    this.insightVisible = true;

    if (this.insightTimer !== null) {
      window.clearTimeout(this.insightTimer);
    }
    this.insightTimer = window.setTimeout(() => {
      this.insightVisible = false;
      this.insightTimer = null;
    }, 4500);
  }

  incrementDial(index: number): void {
    if (this.isVaultOpen) {
      return;
    }
    this.audioService.playClick();
    this.dialValues[index] = (this.dialValues[index] + 1) % 10;
    this.checkSolved();
  }

  private checkSolved(): void {
    const target = [1, 9, 0, 8];
    const matches = target.every((v, i) => this.dialValues[i] === v);
    if (matches && !this.isVaultOpen) {
      this.isVaultOpen = true;
      this.audioService.playUnlock();
      this.stacyMessage = this.stacyService.getRandomQuote('room2Success');
      this.gameService.setRoomCode('room2', this.roomCode);
    }
  }

  goToNextRoom(): void {
    const codes = this.gameService.roomCodes;
    if (this.gameService.allRoomsSolved()) {
      this.router.navigate(['/vault']);
      return;
    }
    if (!codes.room1) {
      this.router.navigate(['/room/deadlock']);
      return;
    }
    if (!codes.room3) {
      this.router.navigate(['/room/calibration']);
      return;
    }
    this.router.navigate(['/hub']);
  }

  goToHub(): void {
    this.router.navigate(['/hub']);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }
}
