import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
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
export class AcquireComponent implements OnInit {

    constructor(
        private acquireService: AcquireService,
        private acquireEventService: AcquireEventService,
        private modalCtrl: ModalController,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private hotelChainService: HotelChainService
    ) {}

    ngOnInit(): void {
        this.acquireService.initGame();
    }

    showScoreboard(): void {
        var modal = this.modalCtrl.create(ScoreboardComponent);
        modal.present();
    }

    canPlaceTile(): boolean {
        return this.isTileSelected() && !this.isTilePlaced();
    }

    isTileSelected(): boolean {
        return !!this.playerService.currentPlayer.selectedTile;
    }

    isTilePlaced(): boolean {
        return this.playerService.currentPlayer.hasPlacedTile;
    }

    canBuyStocks(): boolean {
        return this.isTilePlaced() && this.hotelChainService.getActiveHotelChains().length > 0;
    }

    placeTile(): void {
        if (!this.canPlaceTile()) {
            return;
        }
        this.acquireEventService.notifyTilePlaced(this.playerService.currentPlayer.selectedTile);
    }

    buyStocks(): void {
        this.moveHandlerService.buyStocks();
    }

    endTurn(): void {
        this.acquireEventService.notifyEndTurn();
    }

}
