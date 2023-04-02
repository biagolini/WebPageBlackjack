const dealerCardsElement = document.getElementById('dealer-cards')
const dealerScoreElement = document.getElementById('dealer-score')
const playerCardsElement = document.getElementById('player-cards')
const playerScoreElement = document.getElementById('player-score')
const hitButton = document.getElementById('hit')
const standButton = document.getElementById('stand')

const suits = ['♠', '♥', '♦', '♣']
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A'
]

let dealerCards = []
let playerCards = []

function createDeck() {
  let deck = []
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value })
    }
  }
  return deck
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function dealCard(deck) {
  return deck.pop()
}

function createCardElement(card) {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card')
  cardElement.textContent = `${card.value}${card.suit}`
  return cardElement
}

function updateUI() {
  dealerCardsElement.innerHTML = ''
  playerCardsElement.innerHTML = ''

  for (let card of dealerCards) {
    const cardElement = createCardElement(card)
    dealerCardsElement.appendChild(cardElement)
  }

  for (let card of playerCards) {
    const cardElement = createCardElement(card)
    playerCardsElement.appendChild(cardElement)
  }

  updateScores()
}

function startGame() {
  let deck = createDeck()
  deck = shuffleDeck(deck)

  dealerCards = [dealCard(deck), dealCard(deck)]
  playerCards = [dealCard(deck), dealCard(deck)]

  updateUI()

  checkBlackjack()
}

function calculateScore(hand) {
  let score = 0
  let aces = 0

  for (let card of hand) {
    let value = card.value
    if (value === 'A') {
      aces++
      score += 11
    } else if (value === 'K' || value === 'Q' || value === 'J') {
      score += 10
    } else {
      score += parseInt(value)
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10
    aces--
  }

  return score
}

function updateScores() {
  const dealerScore = calculateScore(dealerCards)
  const playerScore = calculateScore(playerCards)

  dealerScoreElement.textContent = dealerScore
  playerScoreElement.textContent = playerScore
}

function checkBlackjack() {
  const dealerScore = calculateScore(dealerCards)
  const playerScore = calculateScore(playerCards)

  if (playerScore === 21 && dealerScore !== 21) {
    alert('Blackjack! You win!')
    startGame()
  } else if (dealerScore === 21 && playerScore !== 21) {
    alert('Dealer has Blackjack! You lose.')
    startGame()
  }
}

hitButton.addEventListener('click', () => {
  const deck = createDeck()
  shuffleDeck(deck)
  const newCard = dealCard(deck)
  playerCards.push(newCard)
  updateUI()

  const playerScore = calculateScore(playerCards)
  if (playerScore > 21) {
    alert('You busted! You lose.')
    startGame()
  }
})

standButton.addEventListener('click', () => {
  const deck = createDeck()
  shuffleDeck(deck)

  while (calculateScore(dealerCards) < 17) {
    const newCard = dealCard(deck)
    dealerCards.push(newCard)
  }

  updateUI()
  updateScores()

  const playerScore = calculateScore(playerCards)
  const dealerScore = calculateScore(dealerCards)
  let message

  if (dealerScore > 21 || playerScore > dealerScore) {
    message = 'You win!'
  } else if (dealerScore === playerScore) {
    message = "It's a draw!"
  } else {
    message = 'You lose!'
  }

  alert(message)
  startGame()
})

startGame()
