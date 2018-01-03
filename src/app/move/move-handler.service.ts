import { Injectable } from '@angular/core';

import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { StockShare } from '../stock-share/stock-share';
import { Player, PlayerType } from '../player/player';

import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { PlayerService } from '../player/player.service';

import { MoveHandler } from './move-handler';
import { FirstPersonMoveHandler } from './first-person-move-handler';
import { ComputerMoveHandler } from './computer-move-handler';

@Injectable()
export class MoveHandlerService {

    constructor(
        private hotelChainService: HotelChainService,
        private playerService: PlayerService,
        private firstPersonMoveHandler: FirstPersonMoveHandler,
        private computerMoveHandler: ComputerMoveHandler
    ) {}

    getMove(): Promise<Tile> {
        return this.getMoveHandler().getMove();
    }

    handleMove(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        return this.handleTilePlacement(tile, adjacentTiles)
            .then(() => {
                // First person will buy stocks in their own time
                if (this.playerService.getCurrentPlayer().playerType == PlayerType.FIRST_PERSON) {
                    return new Promise(function (resolve) {
                        resolve();
                    });
                }
                return this.buyStocks();
            })
            .then(() => {
                return this.discardAndDrawNewTile(tile);
            })
            .then(() => {
                return this.getMoveHandler().resolveEndTurn();
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

    discardAndDrawNewTile(tile: Tile): Promise<Object> {
        this.playerService.discardAndDrawNewTile(tile);
        return new Promise(function (resolve) {
            resolve();
        });
    }

    isTilePlayable(adjacentTiles: Tile[]): boolean {
        return this.getMoveHandler().isTilePlayable(adjacentTiles);
    }

    canEndGame(): boolean {
        return this.getMoveHandler().canEndGame();
    }

    resolveWinner(): Player[] {
        let players = this.playerService.getPlayers();
        let winners = [];

        let maxCash = 0;
        for (let player of players) {
            if (player.cash > maxCash) {
                maxCash = player.cash;
            }
        }

        for (let player of players) {
            if (maxCash === player.cash) {
                winners.push(player);
            }
        }

        return winners;
    }

    private isNewChain(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.hotelChainService.findAllByTiles(adjacentTiles).length === 0;
    }

    isExpandingChain(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.hotelChainService.findAllByTiles(adjacentTiles).length === 1;
    }

    isMerger(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.hotelChainService.findAllByTiles(adjacentTiles).length > 1;
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
        this.playerService.getCurrentPlayer().addStockShare(stockShare);
    }

    expandHotelChain(tile: Tile, adjacentTiles: Tile[]): Promise<Object> {
        var hotelChains = this.hotelChainService.findAllByTiles(adjacentTiles);
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
        var hotelChains = this.hotelChainService.findAllByTiles(adjacentTiles);
        if (hotelChains.length > 2) {
            throw new Error('Merging 3 hotels not supported yet');
        }

        return this.getMergeResult(hotelChains[0], hotelChains[1])
            .then((mergeResult) => {
                this.rewardMajorityAndMinorityStockholders(mergeResult.source);
                return mergeResult;
            })
            .then((mergeResult) => {
                var player = this.playerService.getCurrentPlayer();
                return this.resolveMergeStocks(player, player, mergeResult);
            })
            .then((mergeResult) => {
                return this.mergeHotelChains(tile, adjacentTiles, mergeResult);
            });
    }

    getMergeResult(optionA: HotelChain, optionB: HotelChain): Promise<HotelChainMergeResult> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var mergeResult;
        if (optionA.tiles.length < optionB.tiles.length) {
            mergeResult = new HotelChainMergeResult(optionA, optionB);
            resolver(mergeResult);
        } else if (optionA.tiles.length > optionB.tiles.length) {
            mergeResult = new HotelChainMergeResult(optionB, optionA);
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
        var bonus;

        for (let player of majorityStockholders) {
            bonus = this.hotelChainService.getMergeMajorityBonus(hotelChain) / majorityStockholders.length
            player.cash += this.nearestHundred(bonus);
        }

        var minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);
        for (let player of minorityStockholders) {
            bonus = this.hotelChainService.getMergeMinorityBonus(hotelChain) / minorityStockholders.length;
            player.cash += this.nearestHundred(bonus);
        }
    }

    nearestHundred(num): number {
        return Math.ceil(num/100)*100
    }

    getMoveHandler(): MoveHandler {
        return this.getMoveHandlerForPlayer(this.playerService.getCurrentPlayer());
    }

    getMoveHandlerForPlayer(player: Player): MoveHandler {
        var moveHandler;
        switch (+player.playerType) {
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
