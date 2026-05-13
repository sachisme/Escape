import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { StacyService } from 'src/app/services/stacy.service';

type DialType = 'efficiency' | 'growth' | 'innovation';

interface ConfettiPiece {
  left: string;
  delay: string;
  color: string;
  duration: string;
}

@Component({
  selector: 'app-calibration-room',
  templateUrl: './calibration-room.component.html',
  styleUrls: ['./calibration-room.component.css']
})
export class CalibrationRoomComponent implements OnInit {
  private efficiency = 0;
  private growth = 0;
  private innovation = 0;

  isSolved = false;
  roomCode = '58';
  stacyMessage = '';
  feedbackMessage = '';
  confetti: ConfettiPiece[] = [];

  constructor(
    private gameService: GameService,
    public audioService: AudioService,
    private stacyService: StacyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.audioService.playTrack('background');
    this.stacyMessage = this.stacyService.getRandomQuote('room3Enter');
  }

  get efficiencyValue(): number {
    return this.efficiency;
  }

  get growthValue(): number {
    return this.growth;
  }

  get innovationValue(): number {
    return this.innovation;
  }

  get totalValue(): number {
    return this.efficiency + this.growth + this.innovation;
  }

  updateDial(type: DialType): void {
    if (this.isSolved) {
      return;
    }
    this.audioService.playClick();

    if (type === 'efficiency') {
      const next = this.efficiency + 5;
      this.efficiency = next > 50 ? 0 : next;
    } else if (type === 'growth') {
      const next = this.growth + 1;
      this.growth = next > 10 ? 0 : next;
    } else if (type === 'innovation') {
      const next = this.innovation + 10;
      this.innovation = next > 100 ? 0 : next;
    }

    this.checkSolved();
  }

  private checkSolved(): void {
    // Strict success condition: innovation = 70, efficiency = 40, growth = 4
    if (this.innovation === 70 && this.efficiency === 40 && this.growth === 4 && !this.isSolved) {
      this.isSolved = true;
      this.feedbackMessage = '';
      this.audioService.playSuccess();
      this.stacyMessage = this.stacyService.getRandomQuote('room3Success');
      this.gameService.setRoomCode('room3', this.roomCode);
      this.generateConfetti();
    } else if (this.totalValue === 114 && this.innovation<70) {
      // Incorrect ratio feedback
      this.feedbackMessage = 'Calibration unstable. Balance vision with sustainable execution';
    } else if (this.totalValue === 114 && this.innovation>70) {
      // Incorrect ratio feedback
      this.feedbackMessage = 'Excessive Innovation without a stable foundation leads to collapse. Recalibrate for sustainable equilibrium.';
    }else {
      this.feedbackMessage = '';
    }
  }

  private generateConfetti(): void {
    const colors = ['#0072c6', '#4ade80', '#fbbf24', '#a855f7', '#ec4899', '#22d3ee', '#f97316'];
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 60; i++) {
      pieces.push({
        left: Math.random() * 100 + '%',
        delay: Math.random() * 2 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: (Math.random() * 2 + 3) + 's'
      });
    }
    this.confetti = pieces;
  }

  goToHub(): void {
    this.router.navigate(['/hub']);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }
}
