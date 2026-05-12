import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RoomHubComponent } from './components/room-hub/room-hub.component';
import { ProjectDeadlockComponent } from './components/project-deadlock/project-deadlock.component';
import { LeadershipRoomComponent } from './components/leadership-room/leadership-room.component';
import { CalibrationRoomComponent } from './components/calibration-room/calibration-room.component';
import { VaultComponent } from './components/vault/vault.component';
import { VictoryComponent } from './components/victory/victory.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'hub', component: RoomHubComponent },
  { path: 'room/deadlock', component: ProjectDeadlockComponent },
  { path: 'room/leadership', component: LeadershipRoomComponent },
  { path: 'room/calibration', component: CalibrationRoomComponent },
  { path: 'vault', component: VaultComponent },
  { path: 'victory', component: VictoryComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
