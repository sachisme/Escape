import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-victory',
  templateUrl: './victory.component.html',
  styleUrls: ['./victory.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class VictoryComponent implements OnDestroy {
  elapsedTime: string;
  wrongAttempts: number;
  confetti: { left: string; delay: string; color: string; duration: string }[] = [];

  poem: string[] = [
    'Wires, ciphers, and logic traps,',
    'You earned your \u2018Elite Leader\u2019 caps!',
    'Bots are fast, but you\u2019re the boss,',
    'Without you, we\u2019d be at a loss.',
    'AI is cool, but let\u2019s be real,',
    'It can\u2019t replace the way you feel.',
    'You\u2019re not a slave to the machine,',
    'You\u2019re the sharpest team we\u2019ve ever seen!',
    'The vault is open! The mission is won!',
    'No one was deleted, so that was fun.',
    'Go forth and lead with all your might,',
    'Before the bots take over... tonight!'
  ];

  displayedLines: string[] = [];
  private revealTimer: number | null = null;
  private readonly revealIntervalMs = 3000;

  constructor(
    private gameService: GameService,
    private audioService: AudioService,
    private router: Router
  ) {
    this.elapsedTime = this.gameService.getFormattedTime();
    this.wrongAttempts = this.gameService.wrongAttempts;
    this.audioService.playTrack('freedom');
    this.generateConfetti();
    this.startPoemReveal();
  }

  ngOnDestroy(): void {
    if (this.revealTimer !== null) {
      window.clearInterval(this.revealTimer);
      this.revealTimer = null;
    }
  }

  private startPoemReveal(): void {
    this.displayedLines = [this.poem[0]];
    let index = 1;
    this.revealTimer = window.setInterval(() => {
      if (index < this.poem.length) {
        this.displayedLines = [...this.displayedLines, this.poem[index]];
        index++;
      } else if (this.revealTimer !== null) {
        window.clearInterval(this.revealTimer);
        this.revealTimer = null;
      }
    }, this.revealIntervalMs);
  }

  private generateConfetti(): void {
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7', '#ec4899', '#14b8a6'];
    for (let i = 0; i < 60; i++) {
      this.confetti.push({
        left: Math.random() * 100 + '%',
        delay: Math.random() * 3 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: (Math.random() * 2 + 3) + 's'
      });
    }
  }

  playAgain(): void {
    this.gameService.reset();
    this.audioService.stop();
    this.router.navigate(['/']);
  }
}
