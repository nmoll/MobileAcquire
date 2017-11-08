import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AcquireComponent } from './acquire/acquire.component';
import { BoardComponent } from './board/board.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GameCreateComponent } from './game/game-create.component';

import { AcquireService } from './acquire/acquire.service';
import { BoardSquareService } from './board/board-square.service';
import { HotelChainService } from './hotel-chain/hotel-chain.service';
import { PlayerService } from './player/player.service';
import { AcquireEventService } from './acquire/acquire-event.service';
import { TileBagService } from './tile/tile-bag.service';
import { MoveHandlerService } from './move/move-handler.service';
import { StockShareService } from './stock-share/stock-share.service';
import { FirstPersonMoveHandler } from './move/first-person-move-handler';
import { ComputerMoveHandler } from './move/computer-move-handler';

import { HotelChainSelectModalComponent } from './hotel-chain/hotel-chain-select.modal';
import { HotelChainStocksModalComponent } from './hotel-chain/hotel-chain-stocks.modal';
import { HotelChainMergeStocksModalComponent } from './hotel-chain/hotel-chain-merge-stocks.modal';

import { TimesPipe } from './utils/pipe/times-pipe';
import { HttpLoaderFactory } from './utils/factory/http-loader-factory';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AcquireComponent,
    BoardComponent,
    GameCreateComponent,
    ScoreboardComponent,
    HotelChainSelectModalComponent,
    HotelChainStocksModalComponent,
    HotelChainMergeStocksModalComponent,
    TimesPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AcquireComponent,
    HotelChainSelectModalComponent,
    HotelChainStocksModalComponent,
    HotelChainMergeStocksModalComponent,
    ScoreboardComponent,
    GameCreateComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AcquireService,
    BoardSquareService,
    HotelChainService,
    PlayerService,
    AcquireEventService,
    TileBagService,
    MoveHandlerService,
    StockShareService,
    FirstPersonMoveHandler,
    ComputerMoveHandler
  ]

})
export class AppModule {}
