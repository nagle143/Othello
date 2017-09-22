//Humble Beginnings

/** State establishes the core variables
* @turn - identifies the colors turn b = Black, w = White
* @board - keeps track of the actual pieces on the board
* @moves - keeps track of the moves of the given colors turn
* @countB - number of black pieces
* @countW - number of white pieces
* @BhasMoves - bool on whether black has legal moves
* @WhasMoves - bool on whether white has legal moves
*/
var state =
{
  turn: 'b',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  moves: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  countB: 2,
  countW: 2,
  BhasMoves: true,
  WhasMoves: true
}

//Context of the canvas element
var ctx;

//Logical/Mechanical functions

/** @function getColorMoves
* gathers the moves for a particular color
* @param {string}color - the given color
*/
function getColorMoves(color) {
  for(y = 0; y < state.board.length; y++) {
    for(x = 0; x < state.board.length; x++) {
      if(state.board[y][x] === color) {
        getMoves(state.board[y][x], x, y);
      }
    }
  }
}

/** @function getMoves
* checks all directions from a particular piece
* @param {string}piece - color of the current piece
*/
function getMoves(piece, x, y) {
  var first = true;
    checkDirection(x - 1, y - 1, 'upLeft', piece, first);
    checkDirection(x, y - 1, 'up', piece, first);
    checkDirection(x + 1, y - 1, 'upRight', piece, first);
    checkDirection(x + 1, y, 'right', piece, first);
    checkDirection(x + 1, y + 1, 'downRight', piece, first);
    checkDirection(x, y + 1, 'down', piece, first);
    checkDirection(x - 1, y + 1, 'downLeft', piece, first);
    checkDirection(x - 1, y, 'left', piece, first);
}

/** @function checkDirection
* @param {string}direction - the particular direction this call is checkLanding
* @param {string}piece -the color of the current piece
* @param {bool} first - determines if the first iteration finds a piece of the same color
*/
function checkDirection(x, y, direction, piece, first) {
  //End of the board check
  if(x < 0 || x > 7 || y < 0 || y > 7) return;
  //Same color of piece check
  if(state.board[y][x] === piece) return;
  //Next to an empty space check
  if(!state.board[y][x] && first) return;
  //Checks if the space is empty
  if(state.board[y][x]) {
    //No longer the First place
    first = false;
    //Continues checking the direction
    switch (direction) {
      case 'upLeft':
        checkDirection(x - 1, y - 1, direction, piece, first);
        break;
      case 'up':
        checkDirection(x, y - 1, direction, piece, first);
        break;
      case 'upRight':
        checkDirection(x + 1, y - 1, direction, piece, first);
        break;
      case 'right':
        checkDirection(x + 1, y, direction, piece, first);
        break;
      case 'downRight':
        checkDirection(x + 1, y + 1, direction, piece, first);
        break;
      case 'down':
        checkDirection(x, y + 1, direction, piece, first);
        break;
      case 'downLeft':
        checkDirection(x - 1, y + 1, direction, piece, first);
        break;
      case 'left':
        checkDirection(x - 1, y, direction, piece, first);
        break;
    }
  }
  //Make sure square is empty, and not already added
  if(state.board[y][x]) return;
  //Should be a legal move
  if(state.turn === 'b') {
    state.moves[y][x] = state.turn;
    state.BhasMoves = true;
  }
  else {
    state.moves[y][x] = state.turn;
    state.WhasMoves = true;
  }
}
/** @function applyMove
* function that adds a piece to the board, and checks all the pieces that
* need to be flipped for a given move, then calls renderBoard and changeTurn
* @param {integer}x - x position of selected move
* @param {integer}y - y position of selected move
*/
function applyMove(x, y) {
  addPiece(x,y);
  checkFlips(x, y, -1, -1);
  checkFlips(x, y, 0, -1);
  checkFlips(x, y, 1, -1);
  checkFlips(x, y, 1, 0);
  checkFlips(x, y, 1, 1);
  checkFlips(x, y, 0, 1);
  checkFlips(x, y, -1, 1);
  checkFlips(x, y, -1, 0);
  renderBoard();
  changeTurn();
}

/** @function checkFlips
* function that checks a particular direction for the select move square
* @param {integer} startX - x position of the selected square
* @param {integer} startY - y position of the selected square
* @param {integer} deltaX - the direction the x variable is changing
* @param {integer} deltaY - the direction the y variable is changing
*/
function checkFlips(startX, startY, deltaX, deltaY) {
  //Set up the first postion in the direction
  var x = startX + deltaX;
  var y = startY + deltaY;
  //Bool to determine whether pieces should be flipped
  var line = false;
  //Continue while the position is on the board
  while(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
    //Break if you hit a space
    if(!state.board[y][x]) {
      break;
    }
    //If you hit your our own piece, the line is true
    if(state.board[y][x] === state.turn) {
      line = true;
      break;
    }
    x+= deltaX;
    y+= deltaY;
  }
  if(line) {
    //While on the board, and the starting position isn't passed
    while((x >= 0 && x <= 7 && y >= 0 && y <= 7) && (x !=  startX || y != startY)) {
      flipPiece(x,y);
      x-= deltaX;
      y-= deltaY;
    }
  }
}

/** @function addPiece
* function to add a piece to the select move square
* @param x - x postion of the selected square
* @param y - y postion of the selected square
*/
function addPiece(x, y) {
  state.board[y][x] = state.turn;
  //Adjust the count of the add color
  if(state.turn === 'b') {
    adjustBlack(1);
  }
  else {
    adjustWhite(1);
  }
}

//Function to update the black countB
function adjustBlack(x) {
  state.countB += x;
}

//Function to update the white count
function adjustWhite(x) {
  state.countW += x;
}

/** @function clearMoves
* function to reset the move array when switching turns
*/
function clearMoves() {
  for(y = 0; y < state.moves.length; y++) {
    for(x = 0; x < state.moves.length; x++) {
      state.moves[y][x] = null;
    }
  }
  //Neither color should have valid moves at the moment
  state.WhasMoves = false;
  state.BhasMoves = false;
}

/** @function flipPiece
* function to flip the piece of aparticular square if the piece and turn match up
*/
function flipPiece(x, y) {
  if(state.board[y][x] === 'b' && state.turn === 'w') {
    state.board[y][x] = 'w';
    adjustCounts();
  }
  else if(state.board[y][x] === 'w' && state.turn === 'b') {
    state.board[y][x] = 'b';
    adjustCounts();
  }
}

/** @function adjustCounts
* function that updates the counts of flipped pieces
*/
function adjustCounts() {
  if(state.turn === 'b') {
    adjustBlack(1);
    adjustWhite(-1);
  }
  else {
    adjustWhite(1);
    adjustBlack(-1);
  }
  displayCounts();
}

/** @function changeTurn
* function to change the turn if possible, or potentially end the game
*/
function changeTurn() {
  //Makes sure the moves array is all null
  clearMoves();
  //Checks if white has a valid move after black has gone
  if(state.turn === 'b') {
    state.turn = 'w';
    getColorMoves('w');
    //White can't go, black goes again
    if(!state.WhasMoves) {
      clearMoves();
      state.turn = 'b'
      getColorMoves('b');
    }
  }
  //Checks if black can go after white has gone
  else if(state.turn === 'w') {
    state.turn = 'b';
    getColorMoves('b');
    //Black can't go, white goes again
    if(!state.BhasMoves){
      clearMoves();
      state.turn = 'w';
      getColorMoves('w');
    }
  }
  //If after both conditionals both can't move, game over
  if(!state.BhasMoves && !state.WhasMoves) {
    checkForVictory();
  }
  displayTurn();
}

/** @function checkForVictory
* function to determine and display the victor
*/
function checkForVictory() {
  //Refresh the board
  renderBoard();
  //Wipe the section of the canvas that needs to be displayed, not necessary,
  // but is easier to read.
  ctx.clearRect(0, 825, 1400, 100);
  //Setting up the font
  ctx.font = "100px Times New Roman";
  ctx.fillStyle = 'Gold';
  //Comparing the counts of each color, and determing the string to be printed
  var compareCounts = state.countB - state.countW;
    if(compareCounts > 0) {
      string = 'Black wins!: \nBlack: ' + state.countB + ' White: ' + state.countW;
    }
    else if(compareCounts === 0) {
      string = 'Its a Tie!: \nBlack: ' + state.countB + ' White: ' + state.countW;
    }
    else{
      string = 'White wins!: \nBlack: ' + state.countB + ' White: ' + state.countW;
    }
    //Displaying the text
  ctx.fillText(string, 0, 900);
}

//Graphical functions

/** @function
* function to set up the canvas element
*/
function canvasSetup() {
  var canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1700;
  canvas.onmousedown = handleMouseDown;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  renderBoard();
}

/** @function renderBoard
* function to render the board/refresh the board
*/
function renderBoard() {
  if(!ctx) return;
  //Wipe the canvas clean
  ctx.clearRect(0, 0, 1600, 2000);
  //Call the function to render the cells
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      renderCell(x, y);
    }
  }
  displayCounts();
}

/** @function renderCell
* function to render the individual cells
* @param {integer} x - x position of the cells
* @param {integer} y - y position of the cells
*/
function renderCell(x, y) {
  //Set up the squares of the board
  ctx.fillStyle = 'purple';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(x*200, y*200, 200, 200);
  ctx.fillRect(x*200, y*200, 200, 200);

  //For debugging before I had highlighted squares
  //ctx.font = '50px Times New Roman';
  //ctx.fillStyle = 'blue';
  //ctx.fillText('(' + x + ',' + y + ')', x*150, y*150 + 75);

  //Render the piece if there is one
  if(state.board[y][x]) {
    renderPiece(state.board[y][x], x, y);  }
}

/** @function renderPiece
* function to render individual pieces, taken from in class work.
* @param {string} piece - color of the piece
* @param {integer} x - x position of the piece to render
* @param {integer} y - y position of the piece to render
*/
function renderPiece(piece, x, y) {
  //Begins draw path
  ctx.beginPath();
  //Determines the color
  if(state.board[y][x] === 'w') {
    ctx.fillStyle = 'white';
  }
  else {
    ctx.fillStyle = 'black';
  }
  //Path and fill of enclosed area
  ctx.arc(x*200 + 100, y*200 + 100, 60, 0, Math.PI * 2);
  ctx.fill();
}

/** @function highlightSquare
* function to highlight squares that represent legal moves
*/
function highlightSquare() {
  if(!ctx) return;
  for(y = 0; y < state.moves.length; y++) {
    for(x = 0; x < state.moves.length; x++) {
      if(state.moves[y][x] && state.moves[y][x] === state.turn) {
        ctx.fillStyle = 'violet';
        ctx.fillRect(x*200 + 25, y*200 + 25, 150, 150)
      }
    }
  }
}

///function to determine the board postion relative to the mouse's location on the canvas
function boardPosition(x, y) {
  var boardX = Math.floor(x / 64);
  var boardY = Math.floor(y / 60);
  return {x: boardX, y: boardY}
}

/** @handleMouseDown
* function to handle the event of a mouse click
* @param {event} event - the click event
*/
function handleMouseDown(event) {
  //Cursor postion on the canvas converted into board position
  var position = boardPosition(event.clientX, event.clientY);
  var x = position.x;
  var y = position.y;
  //On the board condition
  if(x < 0 || x > 7 || y < 0 || y > 7) return;
  //Ensure you are select a valid square then calls the applyMove function
  if(state.moves[y][x] && state.moves[y][x] === state.turn) {
    applyMove(x, y);
  }
}

/** @function displayTurn
* function to display who's turn it is
*/
function displayTurn() {
  var string;
  ctx.font = '50px Times New Roman';
  ctx.fillStyle = 'Gold';
  if(state.turn === 'b') {
    string = "Black's ";
  }
  else {
    string = "White's ";
  }
  ctx.fillText("It is " + string + "turn.", 0, 1650);
}

/** @function displayCounts
* function to display the counts of both pieces
*/
function displayCounts() {
  ctx.font = '50px Times New Roman';
  ctx.fillStyle = 'Gold';
  ctx.fillText("Black's Count: " + state.countB + "\tWhite's Count: " + state.countW, 850, 1650);
}
//-----------------------------------------------------------

/** @function gameLoop
* function to constantly refresh the legal moves, to keep the game moving
*/
function gameLoop() {
  highlightSquare();
}

/** @function main
* Calls all the setup functions and sets gameLoop on an interval to constantly refresh
*/
function main() {
  canvasSetup();
  getColorMoves(state.turn);
  highlightSquare();
  displayTurn();
  displayCounts();
  setInterval(()=> gameLoop(), 100);
}

main();
