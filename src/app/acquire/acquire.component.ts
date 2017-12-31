import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AcquireService } from './acquire.service';
import { AcquireEventService } from './acquire-event.service';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service'

import { StockShare } from '../stock-share/stock-share';

@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'
})
export class AcquireComponent implements OnInit, OnDestroy {

    constructor(
        private acquireService: AcquireService,
        private acquireEventService: AcquireEventService,
        private screenOrientation: ScreenOrientation,
        private modalCtrl: ModalController,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private hotelChainService: HotelChainService,
        private navCtrl: NavController,
        private platform: Platform
    ) {}

    ngOnInit(): void {
        this.lockLandscapeOrientation();
        this.acquireService.initGame();
        this.acquireEventService.notifyGameEntered();
    }

    ngOnDestroy(): void {
        this.acquireEventService.notifyGameExited();
        this.unlockLandscapeOrientation();
    }

    showScoreboard(): void {
        var modal = this.modalCtrl.create(ScoreboardComponent);
        modal.present();
    }

    canPlaceTile(): boolean {
        return this.isTileSelected() && !this.isTilePlaced();
    }

    isTileSelected(): boolean {
        return !!this.playerService.getCurrentPlayer().selectedTile;
    }

    isTilePlaced(): boolean {
        return this.playerService.getCurrentPlayer().hasPlacedTile;
    }

    canBuyStocks(): boolean {
        return this.isTilePlaced() && this.hotelChainService.getActiveHotelChains().length > 0;
    }

    placeTile(): void {
        if (!this.canPlaceTile()) {
            return;
        }
        this.acquireEventService.notifyTilePlaced(this.playerService.getCurrentPlayer().selectedTile);
    }

    getStockSharesForPurchase(): StockShare[] {
        let stockShareOrder = this.playerService.getCurrentPlayer().stockShareOrder;
        if (!stockShareOrder) {
            return [];
        }
        return stockShareOrder.stockShares;
    }

    buyStocks(): void {
        this.moveHandlerService.buyStocks();
    }

    endTurn(): void {
        this.acquireEventService.notifyEndTurn();
    }

    canEndGame(): boolean {
        return this.moveHandlerService.canEndGame();
    }

    endGame(): void {

    }

    exitGame(): void {
        this.navCtrl.popToRoot();
    }

    private lockLandscapeOrientation(): void {
        if (this.platform.is('cordova')) {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        }
    }

    private unlockLandscapeOrientation(): void {
        if (this.platform.is('cordova')) {
            this.screenOrientation.unlock();
        }
    }

}
