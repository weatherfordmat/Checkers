/*
The File is Named side Effects, becaues in function programming
of which D3 is a type, changing the UI is a side-effect of pure functions;
Therefore, it's better to have pure functions (in utils.js) and impure functions in sideEffects.js;
*/
let UI = {
    dragged: function(d) {
        if(currentBoard.gameOver) return;
        if(currentBoard.turn != red && currentBoard.turn != redKing) return;
        if(currentBoard.turn != player) return;
        var c = d3.select(this);
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
    },
    startDrag: function(d) {
        d3.select(this).classed("dragging", true);
    },
    moveCircle: function(cell, moveNum) {
        var cellCoordinates = utils.mapCellToCoordinates(board_origin, cell_width, cell);
        currentBoard.delay = (moveNum * 500) + 500;
        d3.selectAll("circle").each(function(d, i) {
            if(d.col === cell.col && d.row === cell.row) {
                d3.select(this)
                    .transition()
                    .delay(500 * moveNum)
                    .attr("cx", d.x = cellCoordinates.x + cell_width / 2)
                    .attr("cy", d.y = cellCoordinates.y + cell_width / 2);
            }
        });
    },
    hideCircle: function(cell, moveNum) {
        currentBoard.delay = (moveNum * 400) + 500;
        d3.selectAll("circle").each(function(d, i) {
            if(d.state === 0 && d.lastRow === cell.row && d.lastCol === cell.col) {
                d3.select(this).transition().delay(400 * moveNum)
                    .style("display", "none");
            }
        });
    },
    dragEnded: function(origin, width, node, d) {
        if(currentBoard.turn != red && currentBoard.turn != redKing) return;
        if(currentBoard.turn != player) return;
        var cell = utils.mapCoordinatesToCell(origin, width, currentBoard.cells, d.x, d.y);
        var from = d;
        var to = cell;
        var legal = AI.isMoveLegal(currentBoard.cells, currentBoard.pieces, d, from, to);
        var index = utils.getCellIndex(d.row, d.col);
        var originalCell = currentBoard.cells[index];
        if(!legal) {
            var cellCoordinates = utils.mapCellToCoordinates(origin, width, originalCell);
            node
                .attr("cx", d.x = cellCoordinates.x + width / 2)
                .attr("cy", d.y = cellCoordinates.y + width / 2);
        } else {
            // Update global board state
            currentBoard = AI.movePiece(currentBoard, d, originalCell, cell, 1);

            // Center circle in cell
            var cellCoordinates = utils.mapCellToCoordinates(origin, width, cell);
            node
                .attr("cx", d.x = cellCoordinates.x + width / 2)
                .attr("cy", d.y = cellCoordinates.y + width / 2);
            UI.showBoardState();
            currentBoard.turn = computer;
            // Computer's move
            var delayCallback = function() {
                var winner = action.overYet(currentBoard);
                if(winner != 0) {
                    currentBoard.gameOver = true;
                } else {
                    AI.computerMove(); //why is UI calling state?
                }
                return true;
            };
            var moveDelay = currentBoard.delay;
            setTimeout(delayCallback, moveDelay);
        }
    },
    drawBoard: function(origin, cellWidth, boardCanvas) {
        var boardState = action.initBoard();
        var cells = boardState.cells;
        var pieces = boardState.pieces;

        //Draw cell rects
        boardCanvas.append("g")
            .selectAll("rect")
            .data(cells)

            .enter().append("rect")
            .attr("x", function(d) {
                return utils.mapCellToCoordinates(origin, cellWidth, d).x
            })
            .attr("y", function(d) {
                return utils.mapCellToCoordinates(origin, cellWidth, d).y
            })
            .attr("height", cellWidth)
            .attr("width", cellWidth)
            // .style("fill", "#666666")
            .attr("fill",function(d,i) {
                if (d.row%2==0 && d.col%2==0){
                        return "#7d7d7d"
                    }
                else if(d.row%2!==0 && d.col%2!==0){
                        return "#7d7d7d"
                    }
              else{
                return "black"}
            })
            .style("stroke", "white")
            .style("stroke-width", "1px");

        //Draw pieces
        var dragEndedDimensions = function(d) {
            node = d3.select(this);
            UI.dragEnded(origin, cellWidth, node, d);

        }

        var drag = d3.drag()
            .on("start", UI.startDrag)
            .on("drag", UI.dragged)
            .on("end", dragEndedDimensions)

        boardCanvas.append("g")
            .selectAll("circle")
            .data(pieces)
            .enter().append("circle")
            .attr("r", cellWidth / 2.6)

            .attr("cx", function(d) {
                var x = utils.mapCellToCoordinates(origin, cellWidth, d).x;
                return x + cellWidth / 2;
            })
            .attr("cy", function(d) {
                var y = utils.mapCellToCoordinates(origin, cellWidth, d).y;
                return y + cellWidth / 2;
            })
            .style("fill", function(d) {
                if(d.state === redKing || d.state === blackKing) return "orange";
                else if(d.state === red) return "green";
                else return "#0080FF";
            })

            .style("stroke", "#efefef")
            .style("stroke-width", "2px")
  
            .call(drag);
        return boardState;
    },
    drawText: function(data) {
        boardCanvas.append("g")
            .selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", function(d) {
                var x = utils.mapCellToCoordinates(board_origin, cell_width, d).x;
                return x + cell_width / 2;
            })
            .attr("y", function(d) {
                var y = utils.mapCellToCoordinates(board_origin, cell_width, d).y;
                return y + cell_width / 2;
            })
            .style("fill", function(d) {
                if(d.state === red) return "black";
                else return "white";
            })
            .style("stroke-width", function(d) {
                if(d.state === redKing || d.state === blackKing) return "5px"
                else return "";
                // .attr('d', d3.symbol().type(d3.symbolCross).size(5000))
            });
    },
    showBoardState: function() {
        d3.selectAll("text").each(function(d, i) {
            d3.select(this)
                .style("display", "none");
        });
        d3.selectAll("circle").style("fill", function(d) {
                if(d.state === redKing) return "#FF66FF";
                else if (d.state === blackKing) return "#66CCFF";
                else if(d.state === red) return "gold";
                else return "#0080FF";
            });
        var cells = currentBoard.cells;
        var pieces = currentBoard.pieces;
        UI.drawText(pieces);

      d3.selectAll("circle").style("stroke-width", function(d) {
            if(d.state === redKing) return "8px";
            else if (d.state === blackKing) return "8px";
            else if(d.state === red) return "2px";
            else return "2px";
        });

    }
}



// d3.selectAll("circle").attr('d', d3.symbol().type(d3.symbolCross).size(5000))