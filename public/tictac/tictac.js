// var player = 0;
// var computer = 1;

// var turn = player;

// //checkRows([row1, row2, row3]);
// function checkRows(row) {
//     for (var i = 0; i < 3; i++) {
//         isMonolithic(row[i])
//     }
//     if (false) {
//         checkColumns(row);
//     }
// }
// //checkRows([col, col2, col3]);
// function checkRows(col) {
//     for (var i = 0; i < 3; i++) {
//         isMonolithic(row[i])
//     }
//     if (false) {
//         checkDiagonal()
//     }
// }
// function checkDiagonal(){
//     if (a1 + b2 + c3 === "X" || a1 + b2 + c3 === "0") {
//         return gameOver();
//     }
//     if (a3+b2+c1==="X" || a3 + b2 + c1 === "0") {
//         return gameOver();
//     }
//     else {
//         console.log("The Game Keeps Going");
//     }
// }

// $('.box').on('click', function() {
//     handleTurns(player);
// });

// COMPUTER MOVES

// function computerMove(readBoard()) {
//     var arr = [];
//     for (empty in board) {
//         if (isGoodMove(empty)) {
//             arr.push(empty)';'
//         }
//     }
//     if (empty > 1) {
//         Math.random(empty);
//     }
//     handleTurns(computer);
// }

// function readBoard() {
//     var board = [];
//     $('.btn').each(function() {
//         board.push($('.btn').text());
//     })
//     return isGameOver(board);
// }

// function isGameOver(board) {
//     board.matches(firstColumms(wins))
// }

// function firstColumns (board) {
//     if (three0s) {
//         alert("computer Wins");
//     }
//     else {
//         alert("You Won!")
//     }
// }

var clicks = 0
var combos = [['1','2','3'],['4','5','6'],['7','8','9'],['1','4','7'],['2','5','8'],['3','6','9'],['1','5','9'],['3','5','9']];
var xArray = [];
var oArray = [];

function player(){
    $(document).on('click', '.btn', function(event){ 
    clicks ++;
    var boxVal = event.currentTarget.dataset.box;
    $(this).prop('disabled', true);
    
if(clicks %2 === 0){
    $(this).text('X');
    xArray.push(boxVal);
}else{
    $(this).text('O');
    oArray.push(boxVal);
};

})
  
};
player()

if(oArray||xArray===combos){
    alert("Winner!");
}else{
    
}





