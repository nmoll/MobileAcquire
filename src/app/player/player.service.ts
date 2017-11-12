import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Player, PlayerType } from './player';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Tile } from '../tile/tile';
import { BoardSquare } from '../board/board-square';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { GameService } from '../game/game.service';
import { TileBagService } from '../tile/tile-bag.service';

@Injectable()
export class PlayerService {

    private tileSelectedEventSubscription: Subscription;

    constructor(
        private acquireEventService: AcquireEventService,
        private gameService: GameService,
        private tileBagService: TileBagService
    ) {
        acquireEventService.gameEnteredEvent.subscribe(() => this.onGameEntered());
        acquireEventService.gameExitedEvent.subscribe(() => this.onGameExited());
    }

    getPlayers(): Player[] {
        return this.gameService.currentGame.players;
    }

    getCurrentPlayer(): Player {
        return this.gameService.currentGame.currentPlayer;
    }

    rotateCurrentPlayer(): void {
        this.gameService.currentGame.rotateCurrentPlayer();
    }

    discardAndDrawNewTile(tile: Tile): void {
        this.getCurrentPlayer().removeTile(tile);
        if (!this.tileBagService.isEmpty()) {
            this.getCurrentPlayer().addTile(this.tileBagService.pick());
        }
    }

    isCurrentPlayerTile(square: BoardSquare): boolean {
        if (this.getCurrentPlayer().playerType != PlayerType.FIRST_PERSON) return false;

        for (let tile of this.getCurrentPlayer().tiles) {
            if (tile.boardSquareId === square.id) {
                return true;
            }
        }
        return false;
    }

    getNextPlayerInList(player: Player): Player {
        return this.gameService.currentGame.getNextPlayerInList(player);
    }

    getMajorityStockholders(hotelChain: HotelChain): Player[] {
        var players = this.gameService.currentGame.players;

        var stocksOwned = players.map(player => player.getStockShareForHotelChain(hotelChain).quantity);
        var mostStocksOwned = Math.max(...stocksOwned);

        return players.filter(player => player.getStockShareForHotelChain(hotelChain).quantity === mostStocksOwned);
    }

    getMinorityStockholders(hotelChain: HotelChain): Player[] {
        var players = this.gameService.currentGame.players;

        var majorityStockholders = this.getMajorityStockholders(hotelChain);
        if (majorityStockholders.length > 1) return majorityStockholders;

        var stocksOwned = players.map(player => player.getStockShareForHotelChain(hotelChain).quantity);
        var mostStocksOwned = Math.max(...stocksOwned);
        stocksOwned.splice(stocksOwned.indexOf(mostStocksOwned));
        mostStocksOwned = Math.max(...stocksOwned);

        var minorityStockholders = players.filter(player => player.getStockShareForHotelChain(hotelChain).quantity === mostStocksOwned);
        if (minorityStockholders.length && minorityStockholders[0].getStockShareForHotelChain(hotelChain).quantity > 0) {
            return minorityStockholders;
        } else {
            return majorityStockholders;
        }
    }

    orderPlayersByStockShare(hotelChain: HotelChain): Player[] {
        return this.gameService.currentGame.players.sort(function (a: Player, b: Player) {
            var stockShareA = a.getStockShareForHotelChain(hotelChain);
            var stockShareB = b.getStockShareForHotelChain(hotelChain);
            return stockShareB.quantity - stockShareA.quantity;
        });
    }

    initPlayerTiles(): void {
        if (this.gameService.currentGame.currentPlayer.tiles.length) {
            return;
        }
        for (let player of this.gameService.currentGame.players) {
            for (var i = 0; i < 6; i++) {
                player.addTile(this.tileBagService.pick());
            }
        }
    }

    onEndTurn(): void {
        this.getCurrentPlayer().hasPlacedTile = false;
        this.getCurrentPlayer().selectedTile = null;
    }

    onTileSelected(tile: Tile): void {
        this.getCurrentPlayer().selectedTile = tile;
    }

    onGameEntered(): void {
        this.tileSelectedEventSubscription = this.acquireEventService.tileSelectedEvent.subscribe((tile) => {
            this.onTileSelected(tile);
        });
    }

    onGameExited(): void {
        this.tileSelectedEventSubscription.unsubscribe();
    }

}
