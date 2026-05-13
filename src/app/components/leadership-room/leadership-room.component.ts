import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';
import { StacyService } from 'src/app/services/stacy.service';

type HotspotKey = 'mug' | 'blueprint' | 'phone' | 'tsquare';
type GhostState = 'idle' | 'loading' | 'cooldown';

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
  backgroundImageUrl = 'url(assets/images/leadership-room.png)';

  // Ghost-terminal decoy ("Broken Terminal") — pure red herring.
  // The real vault code is 1908; the terminal sprinkles 6 and 3 to misdirect.
  ghostTerminalOpen = false;
  ghostInput = '';
  ghostState: GhostState = 'idle';
  ghostLoadingProgress = 0;     // 0–95, never reaches 100
  ghostCooldownSeconds = 60;    // visible countdown in cooldown phase
  ghostAttemptCount = 0;        // tracked for flavor only
  private ghostLoadingTimer: number | null = null;
  private ghostCooldownTimer: number | null = null;

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
    this.clearGhostTimers();
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

  openGhostTerminal(): void {
    if (this.ghostTerminalOpen) {
      return;
    }
    this.audioService.playClick();
    this.ghostTerminalOpen = true;
    this.ghostState = 'idle';
    this.ghostInput = '';
    this.ghostLoadingProgress = 0;
    this.ghostCooldownSeconds = 60;
  }

  closeGhostTerminal(): void {
    this.audioService.playClick();
    this.ghostTerminalOpen = false;
    this.ghostState = 'idle';
    this.ghostInput = '';
    this.ghostLoadingProgress = 0;
    this.clearGhostTimers();
  }

  submitGhost(): void {
    // No matter what they type, the trap fires. Phase 1: loading bar that
    // stalls near the top, then Phase 2: cooldown error with live countdown.
    if (this.ghostState !== 'idle') {
      return;
    }
    this.audioService.playClick();
    this.ghostAttemptCount++;
    this.ghostState = 'loading';
    this.ghostLoadingProgress = 0;
    this.startGhostLoading();
  }

  private startGhostLoading(): void {
    this.clearGhostTimers();
    // Tick the bar up roughly every 90ms; stall around 95% so it never finishes.
    this.ghostLoadingTimer = window.setInterval(() => {
      if (this.ghostLoadingProgress < 92) {
        const jump = Math.random() * 6 + 2; // 2–8% per tick
        this.ghostLoadingProgress = Math.min(92, this.ghostLoadingProgress + jump);
      } else if (this.ghostLoadingProgress < 95) {
        this.ghostLoadingProgress = Math.min(95, this.ghostLoadingProgress + 0.4);
      }
    }, 90);

    // After ~3.2s of "loading", flip to the cooldown error message.
    window.setTimeout(() => {
      if (this.ghostState !== 'loading') {
        return;
      }
      if (this.ghostLoadingTimer !== null) {
        window.clearInterval(this.ghostLoadingTimer);
        this.ghostLoadingTimer = null;
      }
      this.ghostState = 'cooldown';
      this.ghostCooldownSeconds = 60;
      this.startGhostCooldown();
    }, 3200);
  }

  private startGhostCooldown(): void {
    if (this.ghostCooldownTimer !== null) {
      window.clearInterval(this.ghostCooldownTimer);
    }
    this.ghostCooldownTimer = window.setInterval(() => {
      this.ghostCooldownSeconds--;
      if (this.ghostCooldownSeconds <= 0) {
        // Loop the trap: reset to idle so they can "try again" forever.
        if (this.ghostCooldownTimer !== null) {
          window.clearInterval(this.ghostCooldownTimer);
          this.ghostCooldownTimer = null;
        }
        this.ghostState = 'idle';
        this.ghostInput = '';
        this.ghostLoadingProgress = 0;
        this.ghostCooldownSeconds = 60;
      }
    }, 1000);
  }

  private clearGhostTimers(): void {
    if (this.ghostLoadingTimer !== null) {
      window.clearInterval(this.ghostLoadingTimer);
      this.ghostLoadingTimer = null;
    }
    if (this.ghostCooldownTimer !== null) {
      window.clearInterval(this.ghostCooldownTimer);
      this.ghostCooldownTimer = null;
    }
  }
}
