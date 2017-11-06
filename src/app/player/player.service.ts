import { Injectable } from '@angular/core';

import { Player, PlayerType } from './player';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Tile } from '../tile/tile';
import { BoardSquare } from '../board/board-square';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { TileBagService } from '../tile/tile-bag.service';

@Injectable()
export class PlayerService {

    constructor(
        private tileBagService: TileBagService,
        private acquireEventService: AcquireEventService
    ) {
        this.acquireEventService.tileSelectedEvent.subscribe((tile) => {
            this.onTileSelected(tile);
        });
    }

    players: Player[];
    currentPlayer: Player;

    getPlayers(): Player[] {
        return this.players;
    }

    rotateCurrentPlayer(): void {
        this.currentPlayer = this.getNextPlayerInList(this.currentPlayer);
    }

    discardAndDrawNewTile(tile: Tile): void {
        this.currentPlayer.removeTile(tile);
        if (!this.tileBagService.isEmpty()) {
            this.currentPlayer.addTile(this.tileBagService.pick());
        }
    }

    isCurrentPlayerTile(square: BoardSquare): boolean {
        var currentPlayer = this.currentPlayer;
        if (currentPlayer.playerType != PlayerType.FIRST_PERSON) return false;

        for (let tile of currentPlayer.tiles) {
            if (tile.boardSquareId === square.id) {
                return true;
            }
        }
        return false;
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

    initPlayerTiles(): void {
        for (let player of this.players) {
            for (var i = 0; i < 6; i++) {
                player.addTile(this.tileBagService.pick());
            }
        }
    }

    onEndTurn(): void {
        this.currentPlayer.hasPlacedTile = false;
        this.currentPlayer.selectedTile = null;
    }

    onTileSelected(tile: Tile): void {
        this.currentPlayer.selectedTile = tile;
    }

}
