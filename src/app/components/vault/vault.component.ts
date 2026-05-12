import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css']
})
export class VaultComponent implements OnInit {
  digits: string[] = ['0', '0', '0', '0', '0', '0'];
  shaking: boolean = false;
  unlocked: boolean = false;
  hintMessage: string = '';

  constructor(
    private gameService: GameService,
    public audioService: AudioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nav = history.state as { masterkey?: boolean } | null;
    if (nav?.masterkey === true) {
      this.runMasterkeyBypass();
    }
  }

  private runMasterkeyBypass(): void {
    const code = this.gameService.getVaultCode();
    if (code.length !== 6) {
      return;
    }
    this.digits = code.split('');
    window.setTimeout(() => this.tryUnlock(), 700);
  }

  spinUp(index: number): void {
    const current = parseInt(this.digits[index], 10);
    this.digits[index] = String((current + 1) % 10);
  }

  spinDown(index: number): void {
    const current = parseInt(this.digits[index], 10);
    this.digits[index] = String((current + 9) % 10);
  }

  get enteredCode(): string {
    return this.digits.join('');
  }

  tryUnlock(): void {
    const correctCode = this.gameService.getVaultCode();
    if (this.enteredCode === correctCode) {
      this.unlocked = true;
      this.gameService.stopTimer();
      this.audioService.playTrack('freedom');
      setTimeout(() => this.router.navigate(['/victory']), 2000);
    } else {
      this.shaking = true;
      this.gameService.addWrongAttempt();
      this.hintMessage = 'Wrong combination! Remember: the code is made from your 3 room codes in order.';
      setTimeout(() => this.shaking = false, 600);
    }
  }

  goToHub(): void {
    this.router.navigate(['/hub']);
  }

  toggleMusic(): void {
    this.audioService.toggle();
  }
}
