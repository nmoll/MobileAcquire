import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core";
import { HotelChainMergeResult } from "../hotel-chain/hotel-chain-merge-result";
import { Player } from "../player/player";
import { StockShareService } from "../stock-share/stock-share.service";
import { PlayerActionRequestResolveMergeStocks } from "../player-action/player-action-request-resolve-merge-stocks";

@Component({
    selector: 'action-menu-resolve-merge-stocks',
    templateUrl: 'action-menu-resolve-merge-stocks.component.html'
})
export class PlayerActionResolveMergeStocksComponent implements OnChanges {
    
    @Output() onDone = new EventEmitter();
    @Input() playerActionRequest: PlayerActionRequestResolveMergeStocks;

    playerReadyToResolve: boolean = false;
    isDone: boolean = false;

    mergeResult: HotelChainMergeResult;
    player: Player;

    stockShares: number;
    stockSharesToHold: number = 0;
    stockSharesToTrade: number = 0;
    stockSharesToSell: number = 0;

    constructor(
        private stockShareService: StockShareService
    ) {}
    
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
        if (!this.canTrade()) return;
        this.stockShares -= 2;
        this.stockSharesToTrade++;
    }

    canTrade(): boolean {
        let availableStockShares = this.stockShareService.getAvailableStockShares(this.mergeResult.destination);

        return this.stockShares >= 2 && availableStockShares - this.stockSharesToTrade >= 1;
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

        this.isDone = true;

        var mergeSourceStock = this.player.getStockShareForHotelChain(this.mergeResult.source);
        this.player.cash += this.getTotalSellAmount();
        mergeSourceStock.quantity -= this.stockSharesToSell;
        mergeSourceStock.quantity -= this.stockSharesToTrade * 2;

        var mergeDestinationStock = this.player.getStockShareForHotelChain(this.mergeResult.destination);
        mergeDestinationStock.quantity += this.stockSharesToTrade;

        console.log('done resolving stocks, calling callback');
        this.onDone.emit('DONE');
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.player = this.playerActionRequest.getPlayer();
        this.mergeResult = this.playerActionRequest.getMergeResult();
        this.stockShares = this.player.getStockShareForHotelChain(this.mergeResult.source).quantity;
    }

}