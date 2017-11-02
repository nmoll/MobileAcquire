import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Player } from '../player/player';
import { StockShare } from '../stock-share/stock-share';

import { HotelChainService } from './hotel-chain.service';
import { PlayerService } from '../player/player.service';

@Component({
    //moduleId: module.id,
    selector: 'hotel-chain-stocks-modal',
    templateUrl: 'hotel-chain-stocks.modal.html'
})
export class HotelChainStocksModalComponent implements OnInit {

    constructor(
        private hotelChainService: HotelChainService,
        private playerService: PlayerService,
        private viewCtrl: ViewController
    ) {}

    ok: Function;
    cancel: Function;
    destroy: Function;
    closeModal: Function;

    player: Player;
    stockShares: StockShare[];

    onCancel(): void {
        this.viewCtrl.dismiss();
    }

    onOk(): void {
        this.playerService.currentPlayer.cash -= this.getTotalPrice();
        this.playerService.currentPlayer.addStockShares(this.stockShares);
        this.viewCtrl.dismiss();
    }

    getAvailableCash(): number {
        return this.playerService.currentPlayer.cash - this.getTotalPrice();
    }

    getTotalPrice(): number {
        var result = 0;
        for (let stockShare of this.stockShares) {
            result += (stockShare.quantity * this.getStockSharePrice(stockShare));
        }
        return result;
    }

    getTotalQuantity(): number {
        var result = 0;
        for (let stockShare of this.stockShares) {
            result += stockShare.quantity;
        }
        return result;
    }

    canPurchaseStockShare(stockShare: StockShare): boolean {
        return this.getTotalQuantity() < 3 &&
               this.getAvailableCash() >= this.getStockSharePrice(stockShare) &&
               this.getAvailableShares(stockShare) > 0;
    }

    getAvailableShares(stockShare: StockShare): number {
        return this.hotelChainService.getAvailableStockShares(stockShare.hotelChain) - stockShare.quantity;
    }

    addStock(stockShare: StockShare): void {
        if (this.canPurchaseStockShare(stockShare)) {
            stockShare.quantity++;
        }
    }

    removeStock(stockShare: StockShare, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        stockShare.quantity--;
    }

    getStockSharePrice(stockShare: StockShare): number {
        return this.hotelChainService.getStockPrice(stockShare.hotelChain);
    }

    initStocks(): void {
        this.stockShares = [];
        var hotelChains = this.hotelChainService.getHotelChains().filter(hotelChain => hotelChain.tiles.length);
        for (let hotelChain of hotelChains) {
            var stockShare = new StockShare(hotelChain);
            this.stockShares.push(stockShare);
        }
    }

    ngOnInit(): void {
        this.initStocks();
    }

}
