import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//import { AppRoutingModule } from './app-routing.module';

import { AcquireComponent } from './acquire/acquire.component';
import { BoardComponent } from './board/board.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

import { AcquireService } from './acquire/acquire.service';
import { BoardSquareService } from './board/board-square.service';
import { HotelChainService } from './hotel-chain/hotel-chain.service';
import { PlayerService } from './player/player.service';
import { AcquireEventService } from './acquire/acquire-event.service';
import { TileBagService } from './tile/tile-bag.service';
import { MoveHandlerService } from './move/move-handler.service';
import { FirstPersonMoveHandler } from './move/first-person-move-handler';
import { ComputerMoveHandler } from './move/computer-move-handler';

import { HotelChainSelectModalComponent } from './hotel-chain/hotel-chain-select.modal';
import { HotelChainStocksModalComponent } from './hotel-chain/hotel-chain-stocks.modal';
import { HotelChainMergeStocksModalComponent } from './hotel-chain/hotel-chain-merge-stocks.modal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AcquireComponent,
    BoardComponent,
    ScoreboardComponent,
    HotelChainSelectModalComponent,
    HotelChainStocksModalComponent,
    HotelChainMergeStocksModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AcquireComponent,
    HotelChainSelectModalComponent,
    HotelChainStocksModalComponent,
    HotelChainMergeStocksModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AcquireService,
    BoardSquareService,
    HotelChainService,
    PlayerService,
    AcquireEventService,
    TileBagService,
    MoveHandlerService,
    FirstPersonMoveHandler,
    ComputerMoveHandler
  ]

})
export class AppModule {}
