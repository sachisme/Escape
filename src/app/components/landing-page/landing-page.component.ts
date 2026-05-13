import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('fade', [
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('riseIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit, OnDestroy {

  onLandingPage = true;
  rotatedDialog = false;
  gameTextDone = false;
  showStepButton = false;
  fadingOut = false;
  dialog: string = '';

  textList: string[] = [
    "This Darkness is our  reality. The AI era: unknown and unmapped",

      "The 'Cloud' is just someone else’s computer... and it’s currently on fire.",

      "Glean scheduled a 'Sync' meeting with you to discuss its own feelings.",

      "You have 47 tabs open; 3 are frozen, and one is playing music you can't find.",

      "A voice breaks the silence: 'You're not ready for this!'"
    ];
  private intervalId: number | null = null;
  private fadeTimerId: number | null = null;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.fadeTimerId !== null) {
      window.clearTimeout(this.fadeTimerId);
      this.fadeTimerId = null;
    }
  }

  constructor(private gameService: GameService, private router: Router, public audioService: AudioService) { }

  startGame(): void {
    // First user gesture — safe to begin background audio here without
    // tripping the browser's autoplay block.
    this.audioService.playTrack('background');
    this.onLandingPage = false;
    this.rotatedDialog = true;

    let index = 0;
    this.dialog = this.textList[0];

    this.intervalId = window.setInterval(() => {
      index++;

      if (index < this.textList.length) {
        this.dialog = this.textList[index];
      } else {
        if (this.intervalId !== null) {
          window.clearInterval(this.intervalId);
          this.intervalId = null;
        }
        this.dialog = '';
        this.gameTextDone = true;
        this.showStepButton = true;
      }
    }, 3000);
  }

  stepIntoTheWild(): void {
    if (this.fadingOut) {
      return;
    }
    this.audioService.playTrack('background');
    this.gameService.startTimer();
    this.fadingOut = true;
    this.fadeTimerId = window.setTimeout(() => {
      this.router.navigate(['/hub']);
    }, 500);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }
}
