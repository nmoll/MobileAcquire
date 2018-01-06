import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ModalController, NavController, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';
import { AcquireService } from './acquire.service';
import { AcquireEventService } from './acquire-event.service';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service'
import { GameService } from '../game/game.service';

import { StockShare } from '../stock-share/stock-share';

@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'
})
export class AcquireComponent implements OnInit, OnDestroy {

    private endGamePromptTitle;
    private endGamePromptMessage;
    private yesLabel;
    private cancelLabel;

    constructor(
        private alertCtrl: AlertController,
        private acquireService: AcquireService,
        private acquireEventService: AcquireEventService,
        private screenOrientation: ScreenOrientation,
        private modalCtrl: ModalController,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private hotelChainService: HotelChainService,
        private gameService: GameService,
        private navCtrl: NavController,
        private platform: Platform,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.lockLandscapeOrientation();
        this.acquireService.initGame();
        this.acquireEventService.notifyGameEntered();
        this.translateService.get([
            'MESSAGE.END_GAME_PROMPT_TITLE',
            'MESSAGE.END_GAME_PROMPT_MESSAGE',
            'ACTIONS.YES',
            'ACTIONS.CANCEL'
        ]).subscribe((result) => {
            this.endGamePromptTitle = result['MESSAGE.END_GAME_PROMPT_TITLE'];
            this.endGamePromptMessage = result['MESSAGE.END_GAME_PROMPT_MESSAGE'];
            this.yesLabel = result['ACTIONS.YES'];
            this.cancelLabel = result['ACTIONS.CANCEL'];
        });
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
        return !this.isGameEnded() && this.isTileSelected() && !this.isTilePlaced();
    }

    isTileSelected(): boolean {
        return !!this.playerService.getCurrentPlayer().selectedTile;
    }

    isTilePlaced(): boolean {
        return this.playerService.getCurrentPlayer().hasPlacedTile;
    }

    canBuyStocks(): boolean {
        return !this.isGameEnded() && this.isTilePlaced() && this.hotelChainService.getActiveHotelChains().length > 0;
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
        return !this.isGameEnded() && this.moveHandlerService.canEndGame();
    }

    endGame(): void {
        let confirm = this.alertCtrl.create({
            title: this.endGamePromptTitle,
            message: this.endGamePromptMessage,
            buttons: [
                {
                    text: this.yesLabel,
                    handler: () => {
                        this.moveHandlerService.endGame();
                    }
                },
                {
                    text: this.cancelLabel
                }
            ]
        });
        confirm.present();
    }

    isGameEnded(): boolean {
        return this.gameService.isCurrentGameEnded();
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
