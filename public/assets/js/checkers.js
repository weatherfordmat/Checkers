/* 
Global Variables:
*/
var red = 1;
var redKing = 1.1;
var black = -1;
var blackKing = -1.1;
var empty = 0;
const player = red;
const computer = black;
var currentBoard = {};
var cell_width = 0;
var board_origin = 0;

/*3 or 4 is relatively short time with decent results 
or ~ 8 for better results, but takes a while; 
NOTE: Placing the level of difficulty over 10
may crash your browser.
*/
var levelOfDifficulty = 3;


//misc. DOM manipulation;
$(document).ready(function() {
    $('#logout').click(function() {
        localStorage.removeItem("id");
    });
});


/*
Things To Do Today:
1. Limit Login to FaceBook and Google.
2. Pick Color Format.
3. Decide if putting Minesweeper and Tic Tac Toe In/
4. Error: GET https://secure.gravatar.com/avatar/3d55e9ab31907f2fa4102300e8ab348f?d=404&s=160 404 ()
*/