import { Component, OnInit } from "@angular/core";
import { PlayerService } from "../player/player.service";
import { HotelChainService } from "../hotel-chain/hotel-chain.service";
import { StockShare } from "../stock-share/stock-share";
import { StockShareOrder } from "../stock-share/stock-share-order";
import { StockShareService } from "../stock-share/stock-share.service";

@Component({
    selector: 'action-menu-buy-stocks',
    templateUrl: 'action-menu-buy-stocks.component.html'
})
export class PlayerActionBuyStocksComponent implements OnInit {

    private stockShareOrder: StockShareOrder;

    constructor(
        private playerService: PlayerService,
        private hotelChainService: HotelChainService,
        private stockShareService: StockShareService
    ) {}

    addStock(stockShare: StockShare): void {
        if (!this.stockShareOrder.isFullOrder()) {
            stockShare.quantity++;
        }
    }

    getTotalPrice(): number {
        return this.stockShareService.getTotalPrice();
    }

    clearAll(): void {
        for (let stockShare of this.stockShareOrder.stockShares) {
            stockShare.quantity = 0;
        }
    }

    canPurchaseStock(stockShare: StockShare): boolean {
        return stockShare.hotelChain.tiles.length > 0 && 
            !this.stockShareOrder.isFullOrder() &&
            this.canAffordStock(stockShare) &&
            this.isShareAvailable(stockShare);
    }

    private canAffordStock(stockShare: StockShare): boolean {
        return this.getTotalPrice() + stockShare.hotelChain.getStockPrice() <= this.playerService.getCurrentPlayer().cash;
    }

    private isShareAvailable(stockShare: StockShare): boolean {
        return this.stockShareService.getAvailableStockShares(stockShare.hotelChain) - stockShare.quantity > 0;
    }

    ngOnInit(): void {
        let hotelChains = this.hotelChainService.getHotelChains();
        this.stockShareOrder = new StockShareOrder(hotelChains);
        this.playerService.getCurrentPlayer().stockShareOrder = this.stockShareOrder;
    }

}