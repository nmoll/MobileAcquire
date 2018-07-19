import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { PlayerService } from '../player/player.service';
import { HotelChain } from '../hotel-chain/hotel-chain';

import { Player } from '../player/player';

@Component({
    selector: 'hotel-details',
    template: `
        <ion-list>
            <ion-list-header>
                {{ hotelChain.name }}
            </ion-list-header>
            <ion-item *ngFor="let player of players">
                <ion-icon name="person" item-start></ion-icon>
                <h2>{{ player.name }}</h2>
                <span item-end>{{ player.getStockShareForHotelChain(hotelChain).quantity }}</span>
            </ion-item>
        </ion-list>
    `
})
export class HotelChainDetailsComponent implements OnInit {

    private hotelChain: HotelChain;
    private players: Player[];

    constructor(
        private navParams: NavParams,
        private playerService: PlayerService
    ) {}

    ngOnInit() {
        this.hotelChain = this.navParams.data.hotelChain;
        this.players = this.playerService.getPlayers()
            .filter((p) => {
                return p.getStockShareForHotelChain(this.hotelChain).quantity > 0;
            })
            .sort((p1, p2) => {
                return p2.getStockShareForHotelChain(this.hotelChain).quantity -
                    p1.getStockShareForHotelChain(this.hotelChain).quantity;
            });
    }

}
