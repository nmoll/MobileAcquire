import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AcquireService } from './acquire.service';
import { AcquireEventService } from './acquire-event.service';
import { PlayerAction } from '../player-action/player-action.enum';


@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'
})
export class AcquireComponent implements OnInit, OnDestroy {

    currentPlayerAction: PlayerAction;

    constructor(
        private acquireService: AcquireService,
        private acquireEventService: AcquireEventService,
        private screenOrientation: ScreenOrientation,
        private platform: Platform
    ) {}

    setCurrentPlayerAction(playerAction: PlayerAction) {
        this.currentPlayerAction = playerAction;
    }

    ngOnInit(): void {
        this.lockLandscapeOrientation();
        this.acquireService.initGame();
        this.acquireEventService.notifyGameEntered();
    }

    ngOnDestroy(): void {
        this.acquireEventService.notifyGameExited();
        this.unlockLandscapeOrientation();
    }

    private lockLandscapeOrientation(): void {
        if (this.platform.is('cordova')) {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        }
    }

    private unlockLandscapeOrientation(): void {
        if (this.platform.is('cordova')) {
            this.screenOrientation.unlock();
        }
    }

}
