import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { HotelChainDetailsComponent } from '../hotel-chain/hotel-chain-details.component';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { BoardSquare } from './board-square';
import { BoardSquareService } from './board-square.service';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { GameService } from '../game/game.service';

import { PlayerType } from '../player/player';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { PlayerAction } from '../player-action/player-action.enum';

@Component({
    selector: 'board',
    templateUrl: 'board.component.html'
})
export class BoardComponent implements OnInit {

    @Input() currentPlayerAction: PlayerAction;
    squares: BoardSquare[];
    
    constructor(
        private acquireEventService: AcquireEventService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private gameService: GameService,
        private popoverCtrl: PopoverController
    ) {}

    getBoardSquareClass(square: BoardSquare): string {
        var result = '';

        var player = this.playerService.getCurrentPlayer();

        if (square.tile) {
            result += 'hasTile ';
        }

        if (player.selectedTile && player.selectedTile.boardSquareId === square.id) {
            result += 'hasTile ';
        }

        if (this.boardSquareService.isPartOfHotelChain(square)) {
            result += 'hotel-chain-' + square.tile.hotelChain.type;
        }

        if (player.playerType == PlayerType.FIRST_PERSON) {
            if (player.hasTileForBoardSquareId(square.id) && !player.hasPlacedTile && this.currentPlayerAction == PlayerAction.PLACE_TILE) {
                result += 'player-tile ';
                var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
                if (!this.moveHandlerService.isTilePlayable(adjacentTiles)) {
                    result += 'not-playable ';
                }
            }
        }

        return result;
    }

    onSquareSelected(square: BoardSquare, event: any): void {

        if (square.tile && square.tile.hotelChain) {
            this.onHotelChainSelected(square.tile.hotelChain, event);
        }

        if (this.gameService.isCurrentGameEnded()) {
            return;
        }

        var player = this.playerService.getCurrentPlayer();
        if (player.hasPlacedTile || !player.hasTileForBoardSquareId(square.id)) {
            return;
        }

        if (this.isSquarePlayable(square)) {
            var tile = player.getTileBySquareId(square.id);
            this.acquireEventService.notifyTileSelected(tile);
        }
    }

    private onHotelChainSelected(hotelChain: HotelChain, event: any) {
        let popover = this.popoverCtrl.create(HotelChainDetailsComponent, {
            hotelChain: hotelChain
        });
        popover.present({
            ev: event
        });
    }

    private isSquarePlayable(square: BoardSquare): boolean {
        var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
        return this.moveHandlerService.isTilePlayable(adjacentTiles);
    }

    ngOnInit(): void {
        this.squares = this.boardSquareService.getBoardSquares();
    }
}
