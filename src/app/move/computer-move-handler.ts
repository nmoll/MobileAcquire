import { Injectable } from '@angular/core';
import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Player } from '../player/player';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { PlayerService } from '../player/player.service';
import { MoveHandler } from './move-handler.interface';

@Injectable()
export class ComputerMoveHandler implements MoveHandler {

    constructor(
        private playerService: PlayerService
    ) {}

    getMove(): Promise<Tile> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        setTimeout(t => resolver(this.playerService.currentPlayer.tiles[0]), 1000);

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

}
