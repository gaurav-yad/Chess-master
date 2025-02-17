import { useNavigate } from "react-router-dom";
import chessImage from "../assets/chessImage.jfif";
import pawnImage from "../assets/pawn.png";

const Landing = () => {
    const navigate = useNavigate();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen md:pt-0 pt-2">
         <div className="flex justify-center items-center">
            <img
               src={chessImage}
               className="md:max-w-[30rem] md:min-w-[24rem] max-w-[22rem] rounded-xl"
            />
         </div>
         <div className="flex flex-col md:pt-40 px-6 md:items-start items-center">
            <h1 className="md:text-6xl text-4xl font-bold text-white text-center max-w-[32rem]">
               Play Chess Online on the #2 Site!
            </h1>
            <div className="mt-6 py-6 w-full flex items-center justify-center md:justify-start">
               <div className="flex bg-green-500 px-8 md:py-4 py-2 gap-6 rounded-xl max-w-[32rem] w-full hover:bg-green-600 transition-all duration-150 cursor-pointer" onClick={() => navigate("/game")}>
                  <img
                     src={pawnImage}
                     className="md:w-16 w-10 object-contain"
                  />
                  <div className="flex flex-col md:gap-2">
                     <h2 className="md:text-4xl text-3xl font-bold text-white">
                        Play Online
                     </h2>
                     <p className="text-white text-sm">
                        Play Chess with real players online
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Landing;
