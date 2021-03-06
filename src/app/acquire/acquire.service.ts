import { Injectable } from '@angular/core';

import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { BoardSquareService } from '../board/board-square.service';
import { StockShareService } from '../stock-share/stock-share.service';
import { NotificationService } from '../notification/notification.service';
import { StockShare } from '../stock-share/stock-share';
import { HistoryLogService } from '../history-log/history-log-service';

@Injectable()
export class AcquireService {

    constructor(
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private stockShareService: StockShareService,
        private notificationService: NotificationService,
        private historyLogService: HistoryLogService
    ) {}

    initGame(): void {
        this.playerService.initPlayerTiles();
        this.notificationService.init();
        this.historyLogService.init();
        this.waitForNextMove();
    }

    waitForNextMove(): void {
        this.moveHandlerService.getMove().then((tile) => {
            var square = this.boardSquareService.findSquareById(tile.boardSquareId);
            var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
            this.moveHandlerService.handleMove(tile, adjacentTiles).then(data => this.onMoveComplete());
        });
    }

    getStockSharesForPurchase(): StockShare[] {
        let order = this.playerService.getCurrentPlayer().stockShareOrder;
        return order.stockShares || [];
    }

    private onMoveComplete(): void {
        this.playerService.onEndTurn();
        this.stockShareService.resolvePlayerShares();
        this.playerService.rotateCurrentPlayer().then(data => this.waitForNextMove());
    }

}
