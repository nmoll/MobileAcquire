import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AcquireService } from './acquire.service';
import { AcquireEventService } from './acquire-event.service';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service'

@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'
})
export class AcquireComponent implements OnInit, OnDestroy {

    constructor(
        private acquireService: AcquireService,
        private acquireEventService: AcquireEventService,
        private modalCtrl: ModalController,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private hotelChainService: HotelChainService,
        private navCtrl: NavController
    ) {}

    ngOnInit(): void {
        this.acquireService.initGame();
        this.acquireEventService.notifyGameEntered();
    }

    ngOnDestroy(): void {
        this.acquireEventService.notifyGameExited();
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

}
