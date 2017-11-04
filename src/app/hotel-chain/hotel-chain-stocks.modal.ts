import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Player } from '../player/player';
import { StockShare } from '../stock-share/stock-share';
import { StockShareOrder } from '../stock-share/stock-share-order';

import { HotelChainService } from './hotel-chain.service';
import { PlayerService } from '../player/player.service';
import { StockShareService } from '../stock-share/stock-share.service';

@Component({
    selector: 'hotel-chain-stocks-modal',
    templateUrl: 'hotel-chain-stocks.modal.html'
})
export class HotelChainStocksModalComponent implements OnInit {

    constructor(
        private hotelChainService: HotelChainService,
        private playerService: PlayerService,
        private viewCtrl: ViewController,
        private stockShareService: StockShareService
    ) {}

    player: Player;

    onOk(): void {
        this.viewCtrl.dismiss();
    }

    getAvailableCash(): number {
        return this.playerService.currentPlayer.cash - this.stockShareService.getTotalPrice();
    }

    canPurchaseStockShare(stockShare: StockShare): boolean {
        return !this.getStockShareOrder().isFullOrder() &&
               this.getAvailableCash() >= this.getStockSharePrice(stockShare) &&
               this.getAvailableShares(stockShare) > 0;
    }

    getAvailableShares(stockShare: StockShare): number {
        return this.stockShareService.getAvailableStockShares(stockShare.hotelChain) - stockShare.quantity;
    }

    addStock(stockShare: StockShare): void {
        if (this.canPurchaseStockShare(stockShare)) {
            stockShare.quantity++;
        }
    }

    removeStock(stockShare: StockShare): void {
        stockShare.quantity--;
    }

    getStockSharePrice(stockShare: StockShare): number {
        return stockShare.hotelChain.getStockPrice();
    }

    getStockShareOrder(): StockShareOrder {
        return this.playerService.currentPlayer.stockShareOrder;
    }

    initStocks(): void {
        if (!this.getStockShareOrder()) {
            var hotelChains = this.hotelChainService.getHotelChains().filter(hotelChain => hotelChain.tiles.length);
            this.playerService.currentPlayer.stockShareOrder = new StockShareOrder(hotelChains);
        }
    }

    ngOnInit(): void {
        this.initStocks();
    }

}
