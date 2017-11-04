import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { Player } from '../player/player';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';

@Component({
    //moduleId: module.id,
    selector: 'hotel-chain-merge-stocks-modal',
    templateUrl: 'hotel-chain-merge-stocks.modal.html'
})
export class HotelChainMergeStocksModalComponent implements OnInit {

    constructor (
      private hotelChainService: HotelChainService,
      private viewCtrl: ViewController,
      private params: NavParams
    ) {
      this.player = this.params.get('player');
      this.mergeResult = this.params.get('mergeResult');
    }

    mergeResult: HotelChainMergeResult;
    player: Player;

    stockShares: number;
    stockSharesToHold: number = 0;
    stockSharesToTrade: number = 0;
    stockSharesToSell: number = 0;

    hold(): void {
        if (this.stockShares < 1) return;
        this.stockShares--;
        this.stockSharesToHold++;
    }

    removeHeld(): void {
        if (this.stockSharesToHold === 0) return;
        this.stockShares++;
        this.stockSharesToHold--;
    }

    trade(): void {
        if (this.stockShares < 2) return;
        this.stockShares -= 2;
        this.stockSharesToTrade++;
    }

    removeTrade(): void {
        if (this.stockSharesToTrade === 0) return;
        this.stockShares += 2;
        this.stockSharesToTrade--;
    }

    sell(): void {
        if (this.stockShares < 1) return;
        this.stockShares--;
        this.stockSharesToSell++;
    }

    removeSold(): void {
        if (this.stockSharesToSell === 0) return;
        this.stockShares++;
        this.stockSharesToSell--;
    }

    getTotalSellAmount(): number {
        var stockPrice = this.mergeResult.source.getStockPrice();
        return stockPrice * this.stockSharesToSell;
    }

    onOk(): void {
        this.viewCtrl.dismiss();

        var mergeSourceStock = this.player.getStockShareForHotelChain(this.mergeResult.source);
        this.player.cash += this.getTotalSellAmount();
        mergeSourceStock.quantity -= this.stockSharesToSell;
        mergeSourceStock.quantity -= this.stockSharesToTrade * 2;

        var mergeDestinationStock = this.player.getStockShareForHotelChain(this.mergeResult.destination);
        mergeDestinationStock.quantity += this.stockSharesToTrade;

    }

    ngOnInit(): void {
        this.stockShares = this.player.getStockShareForHotelChain(this.mergeResult.source).quantity;
    }

}
