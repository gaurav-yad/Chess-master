import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";
import { assets } from "../assets/assets";

const ChessBoard = ({
   chessBoard,
   board,
   setBoard,
   socket,
   playerColor
}: {
   chessBoard: Chess;
   board: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
   } | null)[][];
   setBoard: Function;
   socket: WebSocket;
   playerColor: Color;
}) => {
   const [from, setFrom] = useState<string | null>(null);

   const makeMove = (squareRep: string) => {
      // console.log(chessBoard.turn(), playerColor);

      if(chessBoard.turn() !== playerColor) return;

      if (!from) {
         setFrom(squareRep);
      } else {
         try {
            chessBoard.move({ from: from, to: squareRep });
            setBoard(chessBoard.board());
         } catch (error) {
            setFrom(null);
            console.error(error);
            return;
         }
         socket.send(
            JSON.stringify({
               type: MOVE,
               move: {
                  from: from,
                  to: squareRep,
               },
            })
         );
         setFrom(null);
      }
   };

   return (
      <div className={`${playerColor === 'b' ? 'rotate-180' : ''} transition-transform duration-700 ease-in-out`}>
         {board?.map((row, i) => (
            <div key={i} className="flex">
               {row.map((square, j) => {
                  const squareRep = `${String.fromCharCode(97 + j)}${8 - i}`;
                  const pieceImage = square ? assets[square.color + "_" + square.type]: undefined;
                  return (
                     <div
                        key={j}
                        className={`w-20 h-20 flex justify-center items-center ${
                           (i + j) % 2 === 0 ? "bg-lime-600" : "bg-yellow-50"
                        } ${playerColor === 'b' ? 'rotate-180' : ''} ${squareRep === from && 'opacity-90'}`}
                        onClick={() => makeMove(squareRep)}
                     >
                        {square ? (
                           <img src={pieceImage} alt="piece" />
                        ) : null}
                     </div>
                  );
               })}
            </div>
         ))}
      </div>
   );
};

export default ChessBoard;
