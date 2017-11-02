import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { HotelChain } from './hotel-chain';

@Component({
    selector: "hotel-chain-select-modal",
    templateUrl: 'hotel-chain-select.modal.html'
})
export class HotelChainSelectModalComponent {

    constructor(
      private params: NavParams,
      private viewCtrl: ViewController
    ) {
      this.hotelChains = this.params.get('hotelChains');
      this.title = this.params.get('title');
      this.confirmButtonText = this.params.get('confirmButtonText');
    }

    title: string;
    confirmButtonText: string;

    hotelChains: HotelChain[];
    selectedHotelChain: HotelChain;

    selectHotelChain(hotelChain: HotelChain): void {
        this.selectedHotelChain = hotelChain;
    }

    onOk(): void {
        this.viewCtrl.dismiss(this.selectedHotelChain);
    }

}
