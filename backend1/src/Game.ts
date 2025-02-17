import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, MOVE, START_GAME } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.moveCount = 0;

        this.player1.send(
            JSON.stringify({
                type: START_GAME,
                payload: {
                    color: "w",   //tell player1 that they are white
                },
            })
        );

        this.player2.send(
            JSON.stringify({
                type: START_GAME,
                payload: {
                    color: "b",  //tell player2 that they are black
                },
            })
        );
    }

    makeMove(
        socket: WebSocket,
        move: {
            from: string;
            to: string;
        }
    ) {
        //validate the type of move using zod
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }

        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }

        try {
            // console.log(move , "by", socket === this.player1 ? "player1" : "player2");
            this.board.move(move);
        } catch (error) {
            console.log(error);
            return;
        }
        
        if (this.moveCount % 2 === 0) {
            this.player2.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        move: move
                    },
                })
            );
        } else {
            this.player1.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        move: move
                    },
                })
            );
        }

        if (this.board.isGameOver()) {
            //send game over message to both players
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.moveCount % 2 === 0 ? "w" : "b",
                    },
                })
            );

            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.moveCount % 2 === 0 ? "w" : "b",
                    },
                })
            );
            return;
        }

        this.moveCount++;
    }
}
