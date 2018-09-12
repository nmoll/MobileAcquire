import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
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
import { GameService } from './game/game.service';
import { HotelChainService } from './hotel-chain/hotel-chain.service';
import { PlayerService } from './player/player.service';
import { AcquireEventService } from './acquire/acquire-event.service';
import { TileBagService } from './tile/tile-bag.service';
import { MoveHandlerService } from './move/move-handler.service';
import { StockShareService } from './stock-share/stock-share.service';
import { NotificationService } from './notification/notification.service';
import { FirstPersonMoveHandler } from './move/first-person-move-handler';
import { ComputerMoveHandler } from './move/computer-move-handler';

import { HotelChainDetailsComponent } from './hotel-chain/hotel-chain-details.component';
import { HotelChainSelectModalComponent } from './hotel-chain/hotel-chain-select.modal';
import { HotelChainMergeStocksModalComponent } from './hotel-chain/hotel-chain-merge-stocks.modal';

import { TimesPipe } from './utils/pipe/times-pipe';
import { HttpLoaderFactory } from './utils/factory/http-loader-factory';
import { BasicPlayerStrategy } from './strategy/basic-player-strategy';
import { PlayerDeckComponent } from './player/player-deck.component';
import { PlayerActionComponent } from './menu/action-menu.component';
import { PlayerActionPlaceTileComponent } from './menu/action-menu-place-tile.component';
import { HistoryLogService } from './history-log/history-log-service';
import { PlayerActionHistoryLogComponent } from './menu/action-menu-history-log.component';
import { PlayerActionBuyStocksComponent } from './menu/action-menu-buy-stocks.component';
import { PlayerActionResolveMergeStocksComponent } from './menu/action-menu-resolve-merge-stocks.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AcquireComponent,
    PlayerActionComponent,
    PlayerActionHistoryLogComponent,
    PlayerActionPlaceTileComponent,
    PlayerActionBuyStocksComponent,
    PlayerActionResolveMergeStocksComponent,
    BoardComponent,
    GameCreateComponent,
    ScoreboardComponent,
    HotelChainDetailsComponent,
    HotelChainSelectModalComponent,
    HotelChainMergeStocksModalComponent,
    PlayerDeckComponent,
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
    PlayerActionComponent,
    PlayerActionHistoryLogComponent,
    PlayerActionPlaceTileComponent,
    PlayerActionBuyStocksComponent,
    PlayerActionResolveMergeStocksComponent,
    HotelChainDetailsComponent,
    HotelChainSelectModalComponent,
    HotelChainMergeStocksModalComponent,
    ScoreboardComponent,
    GameCreateComponent,
    PlayerDeckComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AcquireService,
    BoardSquareService,
    GameService,
    HotelChainService,
    PlayerService,
    AcquireEventService,
    TileBagService,
    MoveHandlerService,
    StockShareService,
    NotificationService,
    HistoryLogService,
    FirstPersonMoveHandler,
    ComputerMoveHandler,
    BasicPlayerStrategy
  ]

})
export class AppModule {}
