import { useState } from 'react';

function Square({ value, onSquareClick, color }) {
    return (
        <button className="square" onClick={onSquareClick} style={{ color: color }}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {    
    function handleClick(index, row, col) {
        if (squares[index] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[index] = 'X';
        } else {
            nextSquares[index] = 'O';
        }
        onPlay(nextSquares, row, col);
    }
    const winner = calculateWinner(squares);
    let status;

    if (winner) {
        status = "Winner:" + winner.isWinner;
    } else if ( currentMove < 9 ) {
        status = "Next player: " + (xIsNext ? "X" : "O")
    } else {
        status = "Draw."
    }
    return (
        <>
            <div className="status">{status}</div>
            {[0, 1, 2].map(i => (
                <div className="board-row" key={i}>
                    {[0, 1, 2].map(j => {
                        const index = i * 3 + j;
                        return (
                            winner
                            ? (winner.winnerLine.includes(index)
                                ? <Square value = {squares[index]} onSquareClick={() => handleClick(index, i + 1, j + 1)} key={index} color={"green"}/>
                                : <Square value = {squares[index]} onSquareClick={() => handleClick(index, i + 1, j + 1)} key={index} color={"black"}/>)
                            : <Square value = {squares[index]} onSquareClick={() => handleClick(index, i + 1, j + 1)} key={index} color={"black"} />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [rowCol, setRowCol] = useState(['']);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares, row, col) {
        const nextHistory = [...history.slice(0, currentMove +1), nextSquares];
        const nextRowCol = [...rowCol.slice(0, currentMove + 1), '(' + row + ',' + col + ')'];
        console.log(nextRowCol);
        setRowCol(nextRowCol);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length-1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move >0) {
            description = 'Go to move #' + move + ' ' + rowCol[ move ];
        } else {
            description = 'Go to the game start';
        }
        return { move, description }
    })

    const sortedMoves = isAscending ? moves : [...moves].reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} rowCol={rowCol}/>
            </div>
            <div className="game-info">
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => setIsAscending(!isAscending)}>Toggle order.</button>
                <ol className="w-full overflow-auto">
                    {sortedMoves.map((item, index) => {
                        const displayNumber = isAscending ? index + 1 : sortedMoves.length - index;
                        return (
                            <li className="no-number w-full" key={item.move}>
                                {item.move === currentMove
                                    ? (item.move === 0
                                        ? <span class="block w-full  bg-green-100 hover:bg-green-300 text-gray-800 font-semibold py-0.5 px-2 border border-gray-400 rounded shadow">{displayNumber}. You are at the game start.</span>
                                        : <span class="block w-full bg-green-100 hover:bg-green-300 text-gray-800 font-semibold py-0.5 px-2 border border-gray-400 rounded shadow">{displayNumber}. You are at move #{item.move} { rowCol[ item.move ]}</span>)
                                    : <button class="block w-full bg-white hover:bg-green-300 text-gray-800 font-semibold py-0.5 px-2 border border-gray-400 rounded shadow"
                                    onClick={() => jumpTo(item.move)}>{displayNumber}. {item.description}</button>
                                }
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines [i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {isWinner: squares[a] , winnerLine: lines[i] };
        }
    }
    return null;
}
