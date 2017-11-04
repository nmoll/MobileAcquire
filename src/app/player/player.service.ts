import { Injectable } from '@angular/core';

import { Player } from './player';
import { HotelChain } from '../hotel-chain/hotel-chain';

@Injectable()
export class PlayerService {

    constructor() {
    }

    players: Player[];
    currentPlayer: Player;

    getPlayers(): Player[] {
        return this.players;
    }

    rotateCurrentPlayer(): void {
        this.currentPlayer = this.getNextPlayerInList(this.currentPlayer);
    }

    getNextPlayerInList(player: Player): Player {
        var isLastInList = player === this.players[this.players.length - 1];
        var index = isLastInList ? 0 : this.players.indexOf(player) + 1;
        return this.players[index];
    }

    getMajorityStockholders(hotelChain: HotelChain): Player[] {
        var stocksOwned = this.players.map(player => player.getStockShareForHotelChain(hotelChain).quantity);
        var mostStocksOwned = Math.max(...stocksOwned);

        return this.players.filter(player => player.getStockShareForHotelChain(hotelChain).quantity === mostStocksOwned);
    }

    getMinorityStockholders(hotelChain: HotelChain): Player[] {
        var majorityStockholders = this.getMajorityStockholders(hotelChain);
        if (majorityStockholders.length > 1) return majorityStockholders;

        var stocksOwned = this.players.map(player => player.getStockShareForHotelChain(hotelChain).quantity);
        var mostStocksOwned = Math.max(...stocksOwned);
        stocksOwned.splice(stocksOwned.indexOf(mostStocksOwned));
        mostStocksOwned = Math.max(...stocksOwned);

        var minorityStockholders = this.players.filter(player => player.getStockShareForHotelChain(hotelChain).quantity === mostStocksOwned);
        if (minorityStockholders.length && minorityStockholders[0].getStockShareForHotelChain(hotelChain).quantity > 0) {
            return minorityStockholders;
        } else {
            return majorityStockholders;
        }
    }

    orderPlayersByStockShare(hotelChain: HotelChain): Player[] {
        return this.players.sort(function (a: Player, b: Player) {
            var stockShareA = a.getStockShareForHotelChain(hotelChain);
            var stockShareB = b.getStockShareForHotelChain(hotelChain);
            return stockShareB.quantity - stockShareA.quantity;
        });
    }

    onEndTurn(): void {
        this.currentPlayer.hasPlacedTile = false;
        this.currentPlayer.selectedTile = null;
    }

}
