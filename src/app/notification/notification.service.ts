import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AcquireEventService } from '../acquire/acquire-event.service';
import { PlayerService } from '../player/player.service';
import { TranslateService } from '@ngx-translate/core';

import { Tile } from '../tile/tile';
import { PlayerType } from '../player/player';

@Injectable()
export class NotificationService {

    constructor(
        private acquireEventService: AcquireEventService,
        private toastCtrl: ToastController,
        private playerService: PlayerService,
        private translateService: TranslateService
    ) {
        // Turning this off for now
        // this.acquireEventService.tilePlacedEvent.subscribe((tile) => this.onTilePlaced(tile));
    }

    onTilePlaced(tile: Tile): void {
        if (this.playerService.getCurrentPlayer().playerType != PlayerType.FIRST_PERSON) {
            this.translateService.get('MESSAGE.TILE_PLACED', {
                player: this.playerService.getCurrentPlayer().name,
                tile: tile.display
            }).subscribe((translation) => {
                this.showToast(translation);
            });
        }
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

    init(): void {
        // Init logic is in constructor. This will be called at the start of every game.
        // Only have this method to give aquire service something to call.
    }
}
