import ChessBoard from "../components/ChessBoard";
import kingImage from "../assets/king.png";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Chess, Color } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const START_GAME = "start_game";

const Game = () => {
   const socket = useSocket();
   const [chess, _setChess] = useState(new Chess());
   const [board, setBoard] = useState(chess.board());
   const [color, setColor] = useState("");
   const [winner, setWinner] = useState<String | null>(null);
   const [active, setActive] = useState(false);

   // Create a ref to store the latest value of active state
   const activeRef = useRef(false);

   useEffect(() => {
      if (!socket) return;
      socket.onmessage = (event) => {
         const data = JSON.parse(event.data);

         switch (data.type) {
            case START_GAME:
               //initialize the board
               setBoard(chess.board());

               //set the player color i.e "w" or "b"
               setColor(data.payload.color);

               console.log("This player is ", data.payload.color);
               //set the game as started
               setActive(true);
               activeRef.current = true;

               break;

            case MOVE:
               //if the game is not started do nothing
               if (!activeRef.current) return;

               const { move } = data.payload;
               
               //try making the move, if it is valid update the board
               try {
                  console.log("make move", move);

                  chess.move(move);

                  setBoard(chess.board());

               } catch (error) {
                  console.log("move me error");
                  console.error(error);
               }
               
               break;

            case GAME_OVER:
               //set the winner
               setWinner(data.payload.winner);

               setActive(false);

               activeRef.current = false; 

               break;

            default:
               console.log("Unknown Event", data);
               break;
         }
      };
   }, [socket]);

   if (!socket) {
      return <div>Connecting...</div>;
   }

   return (
      <div className="justify-center flex">
         <div className="max-w-screen-xl flex w-full">
            <div className="grid md:grid-cols-6 grid-cols-1 gap-6 w-full">
               <div className="md:col-span-4 bg-zinc-800 w-full flex justify-center py-10 px-24 h-screen">
                  <ChessBoard
                     chessBoard={chess}
                     socket={socket}
                     setBoard = {setBoard}
                     board = {board}
                     playerColor = {color as Color}
                  />
               </div>


               <div className="px-10 w-full md:col-span-2 py-8 gap-6 flex flex-col bg-zinc-800">
               {winner && <div className="py-2 px-6 text-4xl font-bold text-white text-center">
                     {winner === "draw" ? "It's a Draw" : winner === color ? "You Won !! 🥳" : "You Lost !🥲"}
                  </div>}
                  {/* Buton */}
                  {!active && <div
                     onClick={() => {
                        socket.send(JSON.stringify({ type: INIT_GAME }));
                        setWinner(null);
                        chess.reset();
                        setBoard(chess.board());
                        setColor("");
                     }}
                     className="flex bg-green-600 px-4 py-2 items-center gap-2 rounded-xl w-full hover:bg-green-700 transition-all duration-150 cursor-pointer justify-center">
                     <img src={kingImage} className="w-12 object-contain" />

                     <div className="flex flex-col md:gap-2">
                        <h2 className="text-2xl font-bold text-white">Play {winner && "Again"}</h2>
                     </div>

                  </div>}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Game;
