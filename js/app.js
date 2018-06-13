/* global document, window */

/*
 * Create a list that holds all of your cards
 */
const cardValues = [
    'fa fa-diamond',
    'fa fa-paper-plane-o',
    'fa fa-anchor',
    'fa fa-bolt',
    'fa fa-cube',
    'fa fa-leaf',
    'fa fa-bicycle',
    'fa fa-bomb',
  ]

const cardsList = [...cardValues, ...cardValues];

const star = '<li><i class="fa fa-star"></i></li>';

const timerContainer = document.getElementById('timer');
const cardsContainer = document.querySelector('.deck');
const movesContainer = document.querySelector('.moves');
const starsContainer = document.querySelector('.stars');
const restartBtn = document.querySelector('.restart');
const modal = document.getElementById('modal');
const modalBody = document.querySelector('.modal-body');
const modalPlayAgainBtn = document.getElementById('play-again-btn');

let gameStats = null;
let clock = null;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 /**
 *  Calculates stars based on the moves
 */
function gameRating() {
  if (gameStats.moves < 16) {
    return star + star + star;
  } else if (gameStats.moves < 24) {
    return star + star;
  }

  return star;
}


/**
 *  Updates moves in score panel
 */
function updateMoves() {
  movesContainer.innerHTML = gameStats.moves;
}


/**
 *  Updates stars in score panel
 */
function updateStars() {
  gameStats.stars = gameRating();

  starsContainer.innerHTML = gameStats.stars;
}

/**
 *  Update score panel info
 */
function updateScore() {
  updateMoves();
  updateStars();
}


/*
 * Open Score Modal
 */
function openScoreModal() {
  const timer = gameStats.timer;

  modalBody.innerHTML = `
    <p><b>Moves:</b> ${gameStats.moves}<br>
      <b>Time taken:</b> ${timer.minutes} minutes, ${timer.seconds} seconds<br>
      <b>Rating:</b> 
    </p>
    <span class="stars">${gameStats.stars}</span>`;

  modal.style.display = 'block';
}


/**
 *  Checks if game has ended
 */
function isGameOver() {
  if (gameStats.matchedCards.length === cardsList.length) {
    clearTimeout(clock);

    openScoreModal();
  }
}

/**
 *  Hide flipped cards
 */
function hideCards() {
  for (let i = 0; i < gameStats.cardsFlipped.length; i += 1) {
    const cardElem = gameStats.cardsFlipped[i];

    cardElem.classList.remove('open', 'show', 'disable');
  }

  gameStats.cardsFlipped = [];
}


/**
 *  Checks if two cards match
 */
function compareCards(currentCard, previousCard) {
  if (currentCard.type === previousCard.type) {
    currentCard.classList.add('match');
    previousCard.classList.add('match');

    gameStats.matchedCards.push(currentCard, previousCard);

    gameStats.cardsFlipped = [];

    isGameOver();
  } else {
    setTimeout(hideCards, 1000);
  }
}


/**
 *  Clock function to update seconds and the time in the panel
 */
function clockTick() {
  const timer = gameStats.timer;

  timer.seconds += 1;
  if (timer.seconds % 60 === 0) {
    timer.minutes += 1;
    timer.seconds = 0;
  }
  timerContainer.innerHTML = `${timer.minutes} minutes, ${timer.seconds} seconds `;

}

/**
 *  Clear running clock
 */
function clearClock() {
  clearTimeout(clock);
  clock = null;
  timerContainer.innerHTML = 'Timer not started';
}


/**
 *  Clock to track  time
 */
function startClock() {
  clockTick();
  clock = setInterval(clockTick, 1000);
}


/**
 *  Handle click action on cards
 */
function handleCardClick() {
  const card = this;

  // start clock if not running
  if (!clock) {
    startClock();
  }

  // ignore other clicks if there are two cards flipped
  if (gameStats.cardsFlipped.length < 2) {
    card.classList.add('open', 'show', 'disable');
    gameStats.cardsFlipped.push(card);

    // increment moves and update score panel
    gameStats.moves += 1;
    updateScore();

    // compare both cards to check if matches
    if (gameStats.cardsFlipped.length === 2) {
      compareCards(card, gameStats.cardsFlipped[0]);
    }
  }
}

/**
 *  Starts a new game
 */
function startGame() {
  const cardsShuffled = shuffle(cardsList);

  // init game stats
  gameStats = {
    cardsFlipped: [],
    matchedCards: [],
    moves: 0,
    stars: star + star + star,
    timer: {
      minutes: 0,
      seconds: 0,
    },
  };

  // clear running clock
  if (clock) {
    clearClock();
  }

  // delete cards in cards container
  cardsContainer.innerHTML = '';

  // update score panel
  updateScore();

  // add cards to cards container
  for (let i = 0, length = cardsShuffled.length; i < length; i++) {
    const card = createCardElem(cardsShuffled[i]);

    cardsContainer.appendChild(card);

    card.addEventListener('click', handleCardClick);
  }
}


/**
 *  Helper function that creates a card element
 */
function createCardElem(cardType) {
  const card = document.createElement('li');

  card.setAttribute('type', cardType);
  card.classList.add('card');
  card.innerHTML = `<i class="${cardType}"></i>`;

  return card;
}

/**
 *  Helper function to register listeners
 */
function registerListeners() {
  restartBtn.addEventListener('click', startGame);

  modalPlayAgainBtn.addEventListener('click', handleModalClick);

  modal.addEventListener('click',handleModalClick);
}

/**
 *  Helper function to handle modal click
 */
function handleModalClick() {
    modal.style.display = 'none';
    startGame();
}


/**
 *  Create a new game when it loads
 */
window.addEventListener('load', () => {
  registerListeners();
  startGame();
});

