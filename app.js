document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left');
  const result = document.querySelector('#result')
  let width = 10
  let squares = [];
  let bombAmount = 20;
  let isGameOver = false;
  let flags = 0;
  const reset = document.querySelector('.reset');

  reset.addEventListener('click', function(e){
    while (grid.firstChild) {
      grid.removeChild(grid.lastChild);
    }

    const flagsLeft = document.querySelector('#flags-left');
    result.innerHTML = 'Game in progress...';
    squares = [];
    bombAmount = 20;
    isGameOver = false;
    flags = 0;
    createBoard();
  })

  function createBoard(){
    flagsLeft.innerHTML = bombAmount;
    //random bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width*width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    // const shuffledArray = gameArray.sort(() => Math.random() -0.5);
    for (let i = gameArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [gameArray[i], gameArray[j]] = [gameArray[j], gameArray[i]];
    }
  
    //console.log(gameArray);

    //create board
    for(let i = 0; i < width * width; i++){
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(gameArray[i]);
      square.classList.add('square')
      grid.appendChild(square);
      squares.push(square);
      //left click
      square.addEventListener('click', function(e){
        click(square)
      })

      //ctrl and right click
      square.oncontextmenu = function(e){
        e.preventDefault()
        addFlag(square)
      }

      //square.innerHTML = i;
    }

    for(let i = 0; i < squares.length; i++){
    
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width - 1);
      let total = 0;
      //count bombs around this square
      if (squares[i].classList.contains('valid')) {
        //north
        if(i > 9 && squares[i - width].classList.contains('bomb')) total++;
        //north east
        if(i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
        //east
        if(!isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
        //south east
        if(i < 90 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
        //south
        if(i < 90 && squares[i + width].classList.contains('bomb')) total++;
        //south west
        if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
        //west
        if(i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
        //north west
        if(i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
        squares[i].setAttribute('data', total);
        // console.log(squares);  
      }
    }
  }

  createBoard();

  function addFlag(square){
    if(isGameOver) return
    if(!square.classList.contains('checked')
      && (flags < bombAmount)){
        if(!square.classList.contains('flag')){
          square.classList.add('flag');
          square.innerHTML = "🚩";
          flags++;
          checkForWin();
        } else {
          square.classList.remove('flag');
          square.innerHTML = '';
          flags--;
        }
        flagsLeft.innerHTML = bombAmount - flags;
      }
  }

  function click(square){
    let currentId = square.id;
    if(isGameOver) return
    if(square.classList.contains('checked')
    || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')){
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if(total != 0){
        square.classList.add('checked');
        if(total == 1){
          square.classList.add('one')
        } else if(total == 2) {
          square.classList.add('two')
        } else if(total == 3){
          square.classList.add('three')
        } else {
          square.classList.add('four-or-more')
        } 
        square.innerHTML = total;
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked');
  }

  //check all neighboring squares

  function checkSquare(square, currentId){
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
      //west
      if(currentId > 0 && !isLeftEdge){
        const newId = squares[parseInt(currentId) - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      //northeast
      if(currentId > 9 && !isRightEdge){
        const newId = squares[parseInt(currentId) + 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //north
      if(currentId > 9){
        const newId = squares[parseInt(currentId - width)].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //northwest
      if(currentId > 10 && !isLeftEdge){
        const newId = squares[parseInt(currentId) - 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //east
      if(!isRightEdge){
        const newId = squares[parseInt(currentId) + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //south
      if(currentId < 90){
        const newId = squares[parseInt(currentId) + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //southeast
      if(currentId < 89 && !isRightEdge){
        const newId = squares[parseInt(currentId) + 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
      //soutwest
      if(currentId < 90 && !isLeftEdge){
        const newId = squares[parseInt(currentId) - 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare);
      }
    }, 10)
  }

  //game over
  function gameOver(square){
    result.innerHTML = 'GAME OVER!'
    isGameOver = true;

    //show all bombs
    squares.forEach(square => {
      if(square.classList.contains('bomb')){
        let isMac = navigator.platform.indexOf('Mac') > -1
        // let isWindow = navigator.platform.indexOf('Win') > -1
        // square.innerHTML =  "<img src='./bomb.jpg' width=40px height=40px />";
        square.innerHTML = '💣';
        // if(isMac){
        //   square.innerHTML = '💣';
        // } else {
        //   square.innerHTML =  "<img src='./bomb.jpg' width=40px height=40px />";
        // }
      }
    })
  }

  //check for win

  function checkForWin(){
    let matches = 0;
    for(let i = 0; i < squares.length; i++){
      if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
        matches ++
      }

      if(matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true;
      }
    }
  }




})