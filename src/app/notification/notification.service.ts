import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AcquireEventService } from '../acquire/acquire-event.service';
import { PlayerService } from '../player/player.service';

import { PlayerType } from '../player/player';

@Injectable()
export class NotificationService {

    constructor(
        private acquireEventService: AcquireEventService,
        private toastCtrl: ToastController,
        private playerService: PlayerService
    ) {}

    init(): void {
        this.acquireEventService.tilePlacedEvent.subscribe((tile) => {
            if (this.playerService.getCurrentPlayer().playerType != PlayerType.FIRST_PERSON) {
                this.showToast(this.playerService.getCurrentPlayer().name + ' placed tile ' + tile.display);
            }
        });
    }

    showToast(message: string): void {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 4000,
            position: 'bottom',
            showCloseButton: true,
            cssClass: 'acquire-toast'
        });
        toast.present();
    }

}
