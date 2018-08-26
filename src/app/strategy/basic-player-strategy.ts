import { PlayerStrategy } from "./player-strategy";
import { HotelChainService } from "../hotel-chain/hotel-chain.service";
import { StockShareOrder } from "../stock-share/stock-share-order";
import { Injectable } from "@angular/core";
import { PurchaseScenario } from "./scenario/purchase-stocks/purchase-scenario";
import { PurchaseScenarioAreSharesAvailableForPurchase } from "./scenario/purchase-stocks/purchase-scenario-are-shares-available-for-purchase";
import { Player } from "../player/player";
import { HotelChain } from "../hotel-chain/hotel-chain";
import { StockShareService } from "../stock-share/stock-share.service";
import { PurchaseScenarioCanAffordStock } from "./scenario/purchase-stocks/purchase-scenario-can-afford-stock";
import { PurchaseScenarioCanBeMajorityOwner } from "./scenario/purchase-stocks/purchase-scenario-can-be-majority-owner";
import { PlayerService } from "../player/player.service";
import { PurchaseScenarioCanBeMinorityOwner } from "./scenario/purchase-stocks/purchase-scenario-can-be-minority-owner";
import { PurchaseScenarioSoleMajorityMinorityExists } from "./scenario/purchase-stocks/purchase-scenario-sole-majority-minority-exists";
import { PurchaseScenarioHaveFourStockMajorityLead } from "./scenario/purchase-stocks/purchase-scenario-have-four-stock-majority-lead";
import { PurchaseScenarioHaveFourStockMinorityLead } from "./scenario/purchase-stocks/purchase-scenario-have-four-stock-minority-lead";
import { PurchaseScenarioLockedInMajority } from "./scenario/purchase-stocks/purchase-scenario-locked-in-majority";
import { PurchaseScenarioLockedInMinority } from "./scenario/purchase-stocks/purchase-scenario-locked-in-minority";

@Injectable()
export class BasicPlayerStrategy implements PlayerStrategy {

    private purchaseStocksScenarios: PurchaseScenario[];

    constructor(
        private hotelChainService: HotelChainService,
        private stockShareService: StockShareService,
        private playerService: PlayerService
    ) {
        this.purchaseStocksScenarios = [
            new PurchaseScenarioAreSharesAvailableForPurchase(stockShareService),
            new PurchaseScenarioCanAffordStock(),
            new PurchaseScenarioCanBeMajorityOwner(this.playerService, this.stockShareService),
            new PurchaseScenarioCanBeMinorityOwner(this.playerService, this.stockShareService),
            new PurchaseScenarioHaveFourStockMajorityLead(this.playerService),
            new PurchaseScenarioHaveFourStockMinorityLead(this.playerService),
            new PurchaseScenarioLockedInMajority(this.playerService, this.stockShareService),
            new PurchaseScenarioLockedInMinority(this.playerService, this.stockShareService),
            new PurchaseScenarioSoleMajorityMinorityExists(this.playerService)
        ];
    }

    buyStocks(player: Player): StockShareOrder {
        let activeHotelChains = this.hotelChainService.getActiveHotelChains();
        let stockShareOrder = new StockShareOrder(activeHotelChains);

        for (let i = 0; i < 3; i++) {
            let valuesByHotelChain = this.calculateValuesByHotelChain(activeHotelChains, player, stockShareOrder);
            let hotelPick = this.findHotelChainWithHighestValue(valuesByHotelChain);
            if (hotelPick != null) {
                for (let stockShare of stockShareOrder.stockShares) {
                    if (stockShare.hotelChain.type == hotelPick.type) {
                        stockShare.quantity++;
                    }
                }
            }
        }
        
        return stockShareOrder;
    }

    private findHotelChainWithHighestValue(valuesByHotelChain: Map<number, HotelChain>): HotelChain {
        let highest = -1;
        for (let value in valuesByHotelChain) {
            highest = Math.max(highest, Number.parseInt(value));
        }

        if (highest >= 0) {
            return valuesByHotelChain[highest];
        } else {
            return null;
        }
    }

    private calculateValuesByHotelChain(hotelChains: HotelChain[], player: Player, currentOrder: StockShareOrder): Map<number, HotelChain> {
        let result = new Map<number, HotelChain>();
        for (let hotelChain of hotelChains) {
            let value = this.calculateValue(this.purchaseStocksScenarios, player, hotelChain, currentOrder);
            if (!result[value]) {
                result[value] = hotelChain; 
            }
        }
        return result;
    }

    private calculateValue(scenarios, player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        let value = 0;
        for (let scenario of scenarios) {
            value += scenario.calculateValue(player, hotelChain, currentOrder);
        }
        console.log('player', player, 'hotelChain', hotelChain.name, 'value', value);
        return value;
    }
    

}