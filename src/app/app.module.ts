import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StacyHintComponent } from './components/stacy-hint/stacy-hint.component';
import { RoomHubComponent } from './components/room-hub/room-hub.component';
import { ProjectDeadlockComponent } from './components/project-deadlock/project-deadlock.component';
import { LeadershipRoomComponent } from './components/leadership-room/leadership-room.component';
import { CalibrationRoomComponent } from './components/calibration-room/calibration-room.component';
import { VaultComponent } from './components/vault/vault.component';
import { VictoryComponent } from './components/victory/victory.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    StacyHintComponent,
    RoomHubComponent,
    ProjectDeadlockComponent,
    LeadershipRoomComponent,
    CalibrationRoomComponent,
    VaultComponent,
    VictoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
