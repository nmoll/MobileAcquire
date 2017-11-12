import { BoardSquare } from '../board/board-square';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { Player } from '../player/player';
import { Tile } from '../tile/tile';

export class Game {

    players: Player[];
    currentPlayer: Player;
    tiles: Tile[];
    squares: BoardSquare[];
    hotelChains: HotelChain[];

    constructor(
        players: Player[],
        currentPlayer: Player,
        squares: BoardSquare[],
        tiles: Tile[],
        hotelChains: HotelChain[]
    ) {
        this.players = players;
        this.currentPlayer = currentPlayer;
        this.squares = squares;
        this.tiles = tiles;
        this.hotelChains = hotelChains;
    }

    rotateCurrentPlayer(): void {
        this.currentPlayer = this.getNextPlayerInList(this.currentPlayer);
    }

    getNextPlayerInList(player: Player): Player {
        var isLastInList = (player === this.players[this.players.length - 1]);
        var index = isLastInList ? 0 : this.players.indexOf(player) + 1;
        return this.players[index];
    }

}
