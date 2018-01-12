import { Injectable } from '@angular/core';

import { StockShare } from './stock-share';
import { HotelChain } from '../hotel-chain/hotel-chain'

import { PlayerService } from '../player/player.service';

@Injectable()
export class StockShareService {

    constructor(
        private playerService: PlayerService
    ) {}

    getAvailableStockShares(hotelChain: HotelChain): number {
        var result = 0;
        for (let player of this.playerService.getPlayers()) {
            var stockShare = player.getStockShareForHotelChain(hotelChain);
            result += stockShare.quantity;
        }
        return StockShare.MAX_STOCK_SHARES - result;
    }

    hasAvailableStockShare(hotelChain: HotelChain): boolean {
        return this.getAvailableStockShares(hotelChain) > 0;
    }

    getTotalPrice(): number {
        var result = 0;
        var stockShareOrder = this.playerService.getCurrentPlayer().stockShareOrder;
        for (let stockShare of stockShareOrder.stockShares) {
            var stockPrice = stockShare.hotelChain.getStockPrice();
            result += (stockShare.quantity * stockPrice);
        }
        return result;
    }

    resolvePlayerShares(): void {
        var player = this.playerService.getCurrentPlayer();

        if (player.stockShareOrder) {
            player.cash -= this.getTotalPrice();
            player.addStockShares(player.stockShareOrder.stockShares);
            player.stockShareOrder = null;
        }
    }

}
