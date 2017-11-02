import { Injectable } from '@angular/core';

import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { StockShare } from '../stock-share/stock-share';
import { Player, PlayerType } from '../player/player';

import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { PlayerService } from '../player/player.service';
import { TileBagService } from '../tile/tile-bag.service';

import { AppModule } from '../app.module';

import { MoveHandler } from './move-handler.interface';
import { FirstPersonMoveHandler } from './first-person-move-handler';
import { ComputerMoveHandler } from './computer-move-handler';

@Injectable()
export class MoveHandlerService {

    constructor(
        private hotelChainService: HotelChainService,
        private playerService: PlayerService,
        private firstPersonMoveHandler: FirstPersonMoveHandler,
        private computerMoveHandler: ComputerMoveHandler,
        private tileBagService: TileBagService
    ) {}

    getMove(): Promise<Tile> {
        return this.getMoveHandler().getMove();
    }

    handleMove(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        return this.handleTilePlacement(tile, adjacentTiles)
            .then(() => {
                return this.buyStocks();
            })
            .then(() => {
                return this.discardAndDrawNewTile(tile);
            });
    }

    handleTilePlacement(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        var promise;

        if (this.isMerger(adjacentTiles)) {
            promise = this.resolveMerge(tile, adjacentTiles);
        } else if (this.isExpandingChain(adjacentTiles)) {
            promise = this.expandHotelChain(tile, adjacentTiles);
        } else if (this.isNewChain(adjacentTiles)) {
            promise = this.chooseHotelChainToStart(tile, adjacentTiles);
        } else {
            promise = new Promise(function (resolve) {
                resolve(null);
            });
        }

        return promise;
    }

    buyStocks(): Promise<Object> {
        return this.getMoveHandler().buyStocks();
    }

    canBuyStocks(): boolean {
        var hotelChains = this.hotelChainService.getHotelChains().filter(hotelChain => hotelChain.tiles.length > 0);
        return hotelChains.length > 0 && this.playerService.currentPlayer.cash > 0;
    }

    discardAndDrawNewTile(tile: Tile): Promise<Object> {
        this.playerService.currentPlayer.removeTile(tile);
        if (!this.tileBagService.isEmpty()) {
            this.playerService.currentPlayer.addTile(this.tileBagService.pick());
        }
        return new Promise(function (resolve) {
            resolve();
        });
    }

    isNewChain(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.getAdjacentHotelChains(adjacentTiles).length === 0;
    }

    isExpandingChain(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.getAdjacentHotelChains(adjacentTiles).length === 1;
    }

    isMerger(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.getAdjacentHotelChains(adjacentTiles).length > 1;
    }

    getAdjacentHotelChains(adjacentTiles: Tile[]): HotelChain[] {
        var surroundingHotelChains = adjacentTiles
            .map(t => t.hotelChain)
            .filter(t => !!t);
        var uniqueSet = new Set(surroundingHotelChains);
        return Array.from(uniqueSet);
    }

    chooseHotelChainToStart(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        var hotelChains = this.hotelChainService.getHotelChains().filter(hotelChain => !hotelChain.tiles.length);
        var promise = this.getMoveHandler().chooseHotelChainToStart(hotelChains);
        promise.then((hotelChain) => {
            hotelChain.addTile(tile);
            for (let adjacentTile of adjacentTiles) {
                hotelChain.addTile(adjacentTile);
            }
            this.rewardPlayerWithFreeStockShare(hotelChain)
        });

        return promise;
    }

    rewardPlayerWithFreeStockShare(hotelChain: HotelChain): void {
        var stockShare = new StockShare(hotelChain);
        stockShare.quantity = 1;
        this.playerService.currentPlayer.addStockShare(stockShare);
    }

    expandHotelChain(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        var hotelChains = this.getAdjacentHotelChains(adjacentTiles);
        hotelChains.forEach(function (hotelChain) {
            hotelChain.addTile(tile);
            for (let adjacentTile of adjacentTiles) {
                hotelChain.addTile(adjacentTile);
            }
        });

        return new Promise(function (resolve) {
            resolve();
        });
    }

    resolveMerge(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        var hotelChains = this.getAdjacentHotelChains(adjacentTiles);
        if (hotelChains.length > 2) {
            throw new Error('Merging 3 hotels not supported yet');
        }

        return this.getMergeResult(hotelChains[0], hotelChains[1])
            .then((mergeResult) => {
                this.rewardMajorityAndMinorityStockholders(mergeResult.source);
                console.log('rewardMajorityAndMinorityStockholders');
                return mergeResult;
            })
            .then((mergeResult) => {
                var player = this.playerService.currentPlayer;
                console.log('resolve merge stocks');
                return this.resolveMergeStocks(player, player, mergeResult);
            })
            .then((mergeResult) => {
                console.log('merge hotel chains');
                return this.mergeHotelChains(tile, adjacentTiles, mergeResult);
            });
    }

    getMergeResult(optionA: HotelChain, optionB: HotelChain): Promise<HotelChainMergeResult> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });
        if (optionA.tiles.length < optionB.tiles.length) {
            var mergeResult = new HotelChainMergeResult(optionA, optionB);
            resolver(mergeResult);
        } else if (optionA.tiles.length > optionB.tiles.length) {
            var mergeResult = new HotelChainMergeResult(optionB, optionA);
            resolver(mergeResult);
        } else {
            this.chooseMerge(optionA, optionB).then((mergeResult) => {
                resolver(mergeResult);
            });
        }

        return promise;
    }

    resolveMergeStocks(player: Player, mergeInitiator: Player, mergeResult: HotelChainMergeResult): Promise<HotelChainMergeResult> {
        var promise;
        var numberOfShares = player.getStockShareForHotelChain(mergeResult.source).quantity;
        if (numberOfShares > 0) {
            promise = this.getMoveHandlerForPlayer(player).handleMergeStocks(player, mergeResult);
        } else {
            promise = new Promise((resolve) => {
                resolve(mergeResult);
            });
        }
        return promise.then(() => {
            var nextPlayer = this.playerService.getNextPlayerInList(player);
            if (nextPlayer != mergeInitiator) {
                return this.resolveMergeStocks(nextPlayer, mergeInitiator, mergeResult);
            } else {
                return new Promise((resolve) => {
                    resolve(mergeResult);
                });
            }
        });
    }

    chooseMerge(optionA: HotelChain, optionB: HotelChain): Promise<HotelChainMergeResult> {
        return this.getMoveHandler().chooseMerge([optionA, optionB]);
    }

    mergeHotelChains(tile: Tile, adjacentTiles: Tile[], mergeResult: HotelChainMergeResult): Promise<HotelChainMergeResult> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });
        var tiles = mergeResult.source.tiles;
        mergeResult.source.tiles = [];
        for (let mergedTile of tiles) {
            mergeResult.destination.addTile(mergedTile);
        }
        for (let adjacentTile of adjacentTiles) {
            mergeResult.destination.addTile(adjacentTile);
        }
        mergeResult.destination.addTile(tile);
        resolver(mergeResult);
        return promise;
    }

    rewardMajorityAndMinorityStockholders(hotelChain: HotelChain): void {
        var majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        for (let player of majorityStockholders) {
            var bonus = this.hotelChainService.getMergeMajorityBonus(hotelChain) / majorityStockholders.length
            player.cash += this.nearestHundred(bonus);
        }

        var minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);
        for (let player of minorityStockholders) {
            var bonus = this.hotelChainService.getMergeMinorityBonus(hotelChain) / minorityStockholders.length;
            player.cash += this.nearestHundred(bonus);
        }
    }

    nearestHundred(num): number {
        return Math.ceil(num/100)*100
    }

    getMoveHandler(): MoveHandler {
        return this.getMoveHandlerForPlayer(this.playerService.currentPlayer);
    }

    getMoveHandlerForPlayer(player: Player): MoveHandler {
        var moveHandler;
        switch (player.playerType) {
            case PlayerType.FIRST_PERSON:
                moveHandler = this.firstPersonMoveHandler;
                break;
            case PlayerType.COMPUTER:
                moveHandler = this.computerMoveHandler;
                break;
        }
        return moveHandler;
    }

}
