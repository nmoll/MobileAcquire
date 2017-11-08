import { Injectable } from '@angular/core';
import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Player } from '../player/player';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';

import { BoardSquareService } from '../board/board-square.service';
import { PlayerService } from '../player/player.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { MoveHandler } from './move-handler';

@Injectable()
export class ComputerMoveHandler extends MoveHandler {

    constructor(
        hotelChainService: HotelChainService,
        private playerService: PlayerService,
        private boardSquareService: BoardSquareService
    ) {
        super(hotelChainService);
    }

    getMove(): Promise<Tile> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        setTimeout(t => {
            for (let tile of this.playerService.currentPlayer.tiles) {
                var square = this.boardSquareService.findSquareById(tile.boardSquareId);
                var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
                // if (super.isTilePlayable(adjacentTiles)) {
                    resolver(tile)
                    break;
                // }
            }
        }, 1000);

        return promise;
    }

    chooseHotelChainToStart(hotelChains: HotelChain[]): Promise<HotelChain> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        setTimeout(t => resolver(hotelChains[0]), 1000);

        return promise;
    }

    chooseMerge(hotelChains: HotelChain[]): Promise<HotelChainMergeResult> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var hotelChainMergeResult = new HotelChainMergeResult(hotelChains[0], hotelChains[1]);
        setTimeout(t => resolver(hotelChainMergeResult), 1000);

        return promise;
    }

    handleMergeStocks(player: Player, mergeResult: HotelChainMergeResult): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        resolver();

        return promise;
    }

    buyStocks(): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        resolver();

        return promise;
    }

    resolveEndTurn(): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        resolver();

        return promise;
    }

}
