import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MoveHandler } from './move-handler.interface';
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
import { AppModule } from '../app.module';

@Injectable()
export class FirstPersonMoveHandler implements MoveHandler {

    constructor(
        private hotelChainService: HotelChainService,
        private acquireEventService: AcquireEventService,
        private playerService: PlayerService,
        private modalCtrl: ModalController
    ) {}

    getMove(): Promise<Tile> {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });

        var subscription = this.acquireEventService.tileSelectedEvent.subscribe(function (tile) {
            subscription.unsubscribe();
            resolver(tile);
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

        if (this.canBuyStocks()) {
          var modal = this.modalCtrl.create(HotelChainStocksModalComponent);
          modal.onDidDismiss(() => {
            resolver();
          });
          modal.present();
        } else {
            resolver();
        }

        return promise;
    }

    canBuyStocks(): boolean {
        var hotelChains = this.hotelChainService.getHotelChains().filter(hotelChain => hotelChain.tiles.length > 0);
        return hotelChains.length > 0 && this.playerService.currentPlayer.cash > 0;
    }

}
