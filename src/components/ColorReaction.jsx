import { useState, useEffect } from "react";
import '../styles/ColorReaction.css';

function ColorReaction(){

    const [gameEnded, setGameEnded] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [colorChanged, setColorChanged] = useState(false);
    const [milliStarted, setMilliStarted] = useState(0);
    const [scores, setScores] = useState([]);
    const [currentScore, setCurrentScore] = useState(-1);
    const [currentTimeout, setCurrentTimeout] = useState(null);

    useEffect(() => {
        const handler = (event) => {
            let time = Date.now();
            if(event.code === "Space" && gameStarted && !colorChanged){
                setGameStarted(false);
                setCurrentScore("Wait until the color changes");
                clearInterval(currentTimeout);
                return;
            }

            if(event.code === "Space" && gameStarted && colorChanged){
                getTimeElapsed(time);
                return;
            }

            if(!gameStarted && !gameEnded){
                setGameStarted(true);
                let currentTimeout = setTimeout(() => {changeColor();}, (Math.random() * (1120 - 3200) + 3200).toFixed(4));
                setCurrentTimeout(currentTimeout);
            }
        }

        const getTimeElapsed = (time) => {
            let score = time - milliStarted;

            let addScores = [...scores, score];

            if(addScores.length >= 5) setGameEnded(true);

            setCurrentScore("Score: " + score + "ms");
            setScores(addScores);
            setColorChanged(false);
            setGameStarted(false);
        }

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [gameStarted, colorChanged, milliStarted, scores, currentTimeout, gameEnded]);

    function changeColor(){

        setColorChanged(true);
        setMilliStarted(Date.now());
    }

    function getTimeElapsed(time){
        if(gameStarted && !colorChanged){
            setGameStarted(false);
            setCurrentScore("Wait until the color changes");
            clearInterval(currentTimeout);
            return;
        }

        let score = time - milliStarted;
        if(!colorChanged) return;

        let addScores = [...scores, score];

        if(addScores.length >= 5) setGameEnded(true);

        setCurrentScore("Score: " + score + "ms");
        setScores(addScores);
        setColorChanged(false);
        setGameStarted(false);
    }

    function startGame(){
        setGameStarted(true);
        let currentTimeout = setTimeout(() => {changeColor();}, (Math.random() * (1120 - 3200) + 3200).toFixed(4));
        setCurrentTimeout(currentTimeout);
    }

    function calculateAverageScore(scores){
        let avgScore = 0;
        for(let i = 0; i < scores.length; i++){
            avgScore += scores[i];
        }
        return Math.round((avgScore / scores.length * 100.00) / 100.00).toFixed(2);
    }

    if(gameEnded){
        return (
            <div className="game-window">
            <button onClick={() => window.reload()} className="end-game-display"> 
                <span className="large-colored-text">{calculateAverageScore(scores) + "ms"}</span>
                <br />
                <span className="small-text">{"Scores: " + scores}</span>
            </button>
        </div>
        );
    }

    if(gameStarted){
        return (
            <div className="game-window">
                <div className="color-changing-window">
                    <button onClick={() => getTimeElapsed(Date.now())} className={colorChanged ? "green-window" : "red-window"}>
                        Patience...
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="game-window">
            <button onClick={() => startGame()} className="start-game-button"> 
                {currentScore !== -1 ? currentScore : "Click To Start Game"} 
                <br />
                <span className="small-text">Press spacebar or click with mouse when the window turns from red to green</span>
            </button>
        </div>
    );
}

export default ColorReaction;