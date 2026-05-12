import { Injectable } from '@angular/core';

export interface RoomCodes {
  room1: string | null;
  room2: string | null;
  room3: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private startTime: number = 0;
  private endTime: number = 0;
  wrongAttempts: number = 0;
  roomCodes: RoomCodes = { room1: null, room2: null, room3: null };

  constructor() { }

  startTimer(): void {
    this.startTime = Date.now();
    this.wrongAttempts = 0;
  }

  stopTimer(): void {
    this.endTime = Date.now();
  }

  getElapsedSeconds(): number {
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000);
  }

  getFormattedTime(): string {
    const total = this.getElapsedSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}m ${seconds}s`;
  }

  addWrongAttempt(): void {
    this.wrongAttempts++;
  }

  setRoomCode(room: 'room1' | 'room2' | 'room3', code: string): void {
    this.roomCodes[room] = code;
  }

  allRoomsSolved(): boolean {
    return !!(this.roomCodes.room1 && this.roomCodes.room2 && this.roomCodes.room3);
  }

  getVaultCode(): string {
    return (this.roomCodes.room1 || '') + (this.roomCodes.room2 || '') + (this.roomCodes.room3 || '');
  }

  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.wrongAttempts = 0;
    this.roomCodes = { room1: null, room2: null, room3: null };
  }
}
