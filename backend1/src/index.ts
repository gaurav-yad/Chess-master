import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8000 });

const gameManager = new GameManager();

wss.on("connection", (ws) => {
    gameManager.addUser(ws);

    ws.on('disconnect', () => {
        gameManager.removeUser(ws);
    });
})