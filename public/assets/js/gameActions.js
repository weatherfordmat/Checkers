//this file is for broad game actions, e.g. starting, stopping, etc.
var action = {
    //start game;
    startGame: function(origin, cellWidth, boardCanvas) {
        AI.movePiece.moves = [];
        cell_width = cellWidth;
        board_origin = origin;
        currentBoard = UI.drawBoard(origin, cellWidth, boardCanvas);
        currentBoard.ui = true;
        UI.showBoardState();
    },
    initBoard: function() {
        let initialBoard = [
            [red, empty, red, empty, red, empty, red, empty],
            [empty, red, empty, red, empty, red, empty, red],
            [red, empty, red, empty, red, empty, red, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, black, empty, black, empty, black, empty, black],
            [black, empty, black, empty, black, empty, black, empty],
            [empty, black, empty, black, empty, black, empty, black]

        ];
        let cells = new Array();
        let pieces = new Array();
        for(var i = 0; i < 8; ++i) {
            var row = initialBoard[i];
            for(var j = 0; j < 8; ++j) {
                let colValue = row[j];
                if(colValue != empty) {
                    let piece = { row: i, col: j, state: colValue };
                    pieces.push(piece);
                }
                let cell = { row: i, col: j, state: colValue };
                cells.push(cell);
            }
        }
        return { cells: cells, pieces: pieces, turn: red };
    },
    //check to see if the game is over;
    overYet: function(boardState) {
        var pieceCount = utils.getPieceCount(boardState);
        if(pieceCount.red > 0 && pieceCount.black === 0) {
            return red;
        } else if(pieceCount.black > 0 && pieceCount.red === 0) {
            return black;
        } else return 0; //draw;
    },
    //play again;
    replay: function(origin, cellWidth, boardCanvas) {
        var allMoves = AI.movePiece.moves;
        action.startGame(origin, cellWidth, boardCanvas);
        currentBoard.turn = 0; // can't really play
        for(var i = 0; i < allMoves.length; i++) {
            var moveNum = i + 1;
            var nextMove = allMoves[i];
            if(nextMove.to.row > -1) {
                var cellCoordinates = utils.mapCellToCoordinates(board_origin, cell_width, nextMove.to);
                d3.selectAll("circle").each(function(d, i) {
                    if(d.col === nextMove.from.col && d.row === nextMove.from.row) {
                        d3.select(this)
                            .transition()
                            .delay(500 * moveNum)
                            .attr("cx", d.x = cellCoordinates.x + cell_width / 2)
                            .attr("cy", d.y = cellCoordinates.y + cell_width / 2);

                        d.col = nextMove.to.col;
                        d.row = nextMove.to.row;
                    }
                });
            } else {
                d3.selectAll("circle").each(function(d, i) {
                    if(d.row === nextMove.from.row && d.col === nextMove.from.col) {
                        d3.select(this).transition().delay(500 * moveNum)
                            .style("display", "none");
                        d.col = -1;
                        d.row = -1;
                    }
                });
            }
        }
    },
}
