import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AcquireEventService } from './acquire-event.service';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { BoardSquareService } from '../board/board-square.service';
import { StockShareService } from '../stock-share/stock-share.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AcquireService {

    constructor(
        private acquireEventService: AcquireEventService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private stockShareService: StockShareService,
        private notificationService: NotificationService,
        private screenOrientation: ScreenOrientation,
        private platform: Platform
    ) {}

    initGame(): void {
        this.lockLandscapeOrientation();
        this.playerService.initPlayerTiles();
        this.notificationService.init();
        this.waitForNextMove();
    }

    waitForNextMove(): void {
        this.moveHandlerService.getMove().then((tile) => {
            var square = this.boardSquareService.findSquareById(tile.boardSquareId);
            var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
            this.moveHandlerService.handleMove(tile, adjacentTiles).then(data => this.onMoveComplete());
        });
    }

    private onMoveComplete(): void {
        this.playerService.onEndTurn();
        this.stockShareService.resolvePlayerShares();
        this.playerService.rotateCurrentPlayer();
        this.waitForNextMove();
    }

    private lockLandscapeOrientation(): void {
        if (this.platform.is('cordova')) {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        }
    }

}
