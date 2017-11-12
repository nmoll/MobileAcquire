import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ModalController } from 'ionic-angular';
import { MoveHandler } from './move-handler';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { Tile } from '../tile/tile';
import { Player } from '../player/player';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { AcquireEventService } from '../acquire/acquire-event.service';
import { PlayerService } from '../player/player.service';
import { HotelChainSelectModalComponent } from '../hotel-chain/hotel-chain-select.modal';
import { HotelChainStocksModalComponent } from '../hotel-chain/hotel-chain-stocks.modal';
import { HotelChainMergeStocksModalComponent } from '../hotel-chain/hotel-chain-merge-stocks.modal';

@Injectable()
export class FirstPersonMoveHandler extends MoveHandler {

    private tilePlacedEventSubscription: Subscription;

    constructor(
        hotelChainService: HotelChainService,
        private acquireEventService: AcquireEventService,
        private playerService: PlayerService,
        private modalCtrl: ModalController
    ) {
        super(hotelChainService);
        acquireEventService.gameExitedEvent.subscribe(() => this.onGameExited());
    }

    getMove(): Promise<Tile> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        this.tilePlacedEventSubscription = this.acquireEventService.tilePlacedEvent.subscribe(() => {
            this.tilePlacedEventSubscription.unsubscribe();
            this.playerService.getCurrentPlayer().hasPlacedTile = true;
            resolver(this.playerService.getCurrentPlayer().selectedTile);
        });

        return promise;
    }

    chooseHotelChainToStart(hotelChains: HotelChain[]): Promise<HotelChain> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var modal = this.modalCtrl.create(HotelChainSelectModalComponent, {
            hotelChains: hotelChains,
            title: 'Start Hotel Chain',
            confirmButtonText: 'Done'
        }, {
          enableBackdropDismiss: false
        });
        modal.onDidDismiss(hotelChain => {
          resolver(hotelChain);
        });
        modal.present();

        return promise;
    }

    chooseMerge(hotelChains: HotelChain[]): Promise<HotelChainMergeResult> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var modal = this.modalCtrl.create(HotelChainSelectModalComponent, {
            hotelChains: hotelChains,
            title: 'Choose Merge Direction',
            confirmButtonText: 'Merge'
        }, {
          enableBackdropDismiss: false
        });
        modal.onDidDismiss(result => {
          var source = hotelChains.find((hotelChain) => result === hotelChain);
          var destination = hotelChains.find((hotelChain) => result != hotelChain);
          var hotelChainMergeResult = new HotelChainMergeResult(source, destination);
          resolver(hotelChainMergeResult);
        });
        modal.present();

        return promise;
    }

    handleMergeStocks(player: Player, mergeResult: HotelChainMergeResult): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var modal = this.modalCtrl.create(HotelChainMergeStocksModalComponent, {
          player: player,
          mergeResult: mergeResult
        });

        modal.onDidDismiss(() => {
          resolver();
        });
        modal.present();


        return promise;
    }

    buyStocks(): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var modal = this.modalCtrl.create(HotelChainStocksModalComponent);
        modal.onDidDismiss(() => {
            resolver();
        });
        modal.present();

        return promise;
    }

    resolveEndTurn(): Promise<Object> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });
        var subscription = this.acquireEventService.endTurnEvent.subscribe(() => {
            subscription.unsubscribe();
            resolver();
        });

        return promise;
    }

    onGameExited(): void {
        if (this.tilePlacedEventSubscription) {
            this.tilePlacedEventSubscription.unsubscribe();
        }
    }

}
