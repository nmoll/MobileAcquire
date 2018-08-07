import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Player, PlayerType } from './player';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Tile } from '../tile/tile';
import { BoardSquare } from '../board/board-square';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { GameService } from '../game/game.service';
import { TileBagService } from '../tile/tile-bag.service';
import { TranslateService } from '@ngx-translate/core';

import { AlertController } from 'ionic-angular';

@Injectable()
export class PlayerService {

    tileSelectedEventSubscription: Subscription;

    constructor(
        private acquireEventService: AcquireEventService,
        private gameService: GameService,
        private tileBagService: TileBagService,
        private translateService: TranslateService,
        private alertCtrl: AlertController
    ) {
        this.onInit();
    }
    
    onInit() {
        this.acquireEventService.gameEnteredEvent.subscribe(() => this.onGameEntered());
        this.acquireEventService.gameExitedEvent.subscribe(() => this.onGameExited());
    }

    getPlayers(): Player[] {
        return this.gameService.currentGame.players;
    }

    getCurrentPlayer(): Player {
        return this.gameService.currentGame.currentPlayer;
    }

    rotateCurrentPlayer(): Promise<void> {
        let nextPlayer = this.getNextPlayerInList(this.getCurrentPlayer());
        this.gameService.currentGame.rotateCurrentPlayer()
        return this.promptForTurnStart(nextPlayer).then(arg => this.gameService.currentGame.rotateCurrentPlayer());

    }

    private promptForTurnStart(player: Player): Promise<any> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });
        
        if (player.playerType == PlayerType.FIRST_PERSON && this.hasMultipleFirstPlayers()) {
            this.translateService.get([
                'MESSAGE.PLAYER_TURN_START',
                'MESSAGE.PLAYER_TURN_START_BUTTON'
            ], {
                player: player.name
            }).subscribe((messages: string) => {
                let alert = this.alertCtrl.create({
                    title: messages['MESSAGE.PLAYER_TURN_START'],
                    buttons: [
                        {
                          text: messages['MESSAGE.PLAYER_TURN_START_BUTTON'],
                          handler: (data) => {
                            resolver();
                          }
                        }
                      ]
                });
                alert.present();
            });
        } else {
            resolver();
        }

        return promise;
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

    getPlayersInLead(): Player[] {
        let players = this.getPlayers();
        let winners = [];

        let maxCash = 0;
        for (let player of players) {
            if (player.cash > maxCash) {
                maxCash = player.cash;
            }
        }

        for (let player of players) {
            if (maxCash === player.cash) {
                winners.push(player);
            }
        }

        return winners;
    }

    hasMultipleFirstPlayers(): boolean {
        let firstPlayerCount = 0;
        for  (let player of this.gameService.currentGame.players) {
            if  (player.playerType == PlayerType.FIRST_PERSON) {
                firstPlayerCount++;
            }
        }
        return firstPlayerCount >= 2;
    }

    cashInStocks(player: Player): void {
        for (let stockShare of player.stockShares) {
            player.cash += (stockShare.quantity * stockShare.hotelChain.getStockPrice());
        }
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
