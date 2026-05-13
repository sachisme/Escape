import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { StacyService } from 'src/app/services/stacy.service';

type HotspotKey = 'folder' | 'monitor' | 'tablet' | 'sticky';
type BriefVariant = 'info' | 'warning';

interface HotspotBrief {
  title: string;
  subtitle: string;
  riddle: string;
  answer?: number;
}

@Component({
  selector: 'app-project-deadlock',
  templateUrl: './project-deadlock.component.html',
  styleUrls: ['./project-deadlock.component.css']
})
export class ProjectDeadlockComponent implements OnInit, OnDestroy {
  visited: Record<HotspotKey, boolean> = {
    folder: false,
    monitor: false,
    tablet: false,
    sticky: false
  };

  authValues: number[] = [0, 0, 0];
  isProjectAuthorized = false;
  roomCode = '42';

  briefMessage = '';
  briefTitle = '';
  briefVisible = false;
  briefVariant: BriefVariant = 'info';
  private briefTimer: number | null = null;

  stacyMessage = '';
  backgroundImageUrl = 'url(assets/images/project-deadlock.png)';

  hotspots: Record<HotspotKey, HotspotBrief> = {
    folder: {
      title: 'Q3 Schedule',
      subtitle: 'Speed',
      answer: 7,
      riddle:
        'Q3 Schedule: 10-week project. 2 weeks reserved for Planning, 1 week for Buffer. The remaining time is for Execution.'
    },
    monitor: {
      title: 'Project Budget',
      subtitle: 'Cost',
      answer: 2,
      riddle:
        'Budget Report: $10M total. $5M spent on hardware, $3M on licensing. The remaining balance is for the Contingency Fund.'
    },
    tablet: {
      title: 'Resource Allocation',
      subtitle: 'Quality',
      answer: 5,
      riddle:
        'Resource Allocation: Half of the 8-person team is on Migration. The remaining 4 are joined by 1 new expert hire for the final push.'
    },
    sticky: {
      title: 'Strategic Note',
      subtitle: 'Leadership Insight',
      riddle:
        'Leadership is all about using the right sequence for delivering excellence.'
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
    this.stacyMessage = this.stacyService.getRandomQuote('room1Enter');
  }

  ngOnDestroy(): void {
    if (this.briefTimer !== null) {
      window.clearTimeout(this.briefTimer);
      this.briefTimer = null;
    }
  }

  showBrief(key: HotspotKey): void {
    this.audioService.playClick();
    const h = this.hotspots[key];
    this.briefTitle = `${h.subtitle} · ${h.title}`;
    this.briefMessage = h.riddle;
    this.briefVariant = 'info';
    this.briefVisible = true;
    this.visited[key] = true;
    this.scheduleBriefHide(6000);
  }

  private showWarning(): void {
    this.briefTitle = 'Priority Misalignment';
    this.briefMessage =
      'You got the data alignment. Time to now work on getting your priorities right.';
    this.briefVariant = 'warning';
    this.briefVisible = true;
    this.scheduleBriefHide(7000);
  }

  private scheduleBriefHide(durationMs: number): void {
    if (this.briefTimer !== null) {
      window.clearTimeout(this.briefTimer);
    }
    this.briefTimer = window.setTimeout(() => {
      this.briefVisible = false;
      this.briefTimer = null;
    }, durationMs);
  }

  get allHotspotsVisited(): boolean {
    return (
      this.visited.folder &&
      this.visited.monitor &&
      this.visited.tablet &&
      this.visited.sticky
    );
  }

  get hologramStatus(): string {
    if (this.isProjectAuthorized) {
      return 'ACCESS GRANTED';
    }
    if (this.allHotspotsVisited) {
      return 'READY FOR AUTHORIZATION';
    }
    return 'PENDING';
  }

  get briefTag(): string {
    if (this.briefVariant === 'warning') {
      return `Sequence Warning · ${this.briefTitle}`;
    }
    return `Executive Brief · ${this.briefTitle}`;
  }

  get qualityLit(): boolean {
    return this.authValues[0] === 5;
  }

  get speedLit(): boolean {
    return this.authValues[1] === 7;
  }

  get costLit(): boolean {
    return this.authValues[2] === 2;
  }

  incrementAuthDigit(index: number): void {
    if (this.isProjectAuthorized) {
      return;
    }
    this.audioService.playClick();
    this.authValues[index] = (this.authValues[index] + 1) % 10;
    this.checkAuth();
  }

  private checkAuth(): void {
    if (this.isProjectAuthorized) {
      return;
    }

    const correct = [5, 7, 2];
    const warning = [7, 2, 5];

    if (correct.every((v, i) => this.authValues[i] === v)) {
      this.isProjectAuthorized = true;
      this.audioService.playUnlock();
      this.stacyMessage = this.stacyService.getRandomQuote('room1Success');
      this.gameService.setRoomCode('room1', this.roomCode);
      return;
    }

    if (warning.every((v, i) => this.authValues[i] === v)) {
      const alreadyWarning =
        this.briefVisible && this.briefVariant === 'warning';
      if (!alreadyWarning) {
        this.audioService.playError();
        this.gameService.addWrongAttempt();
        this.showWarning();
      }
    }
  }

  exitDataCenter(): void {
    this.router.navigate(['/hub']);
  }

  goToHub(): void {
    this.router.navigate(['/hub']);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }
}
