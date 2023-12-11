getDeck();

let deckId;
let cardsArr=[];

const cardsEL = document.getElementById("cards-img");
const winEl = document.getElementById("display-winner");
const cardsRemaining = document.getElementById('cards-remaining');
const drawCardsBtn = document.getElementById("new-cards")
const playerPointsEl = document.getElementById("player-points");
const computerPointsEl = document.getElementById("computer-points")

let computerPoints = 0;
let playerPoints = 0;

document.getElementById("new-deck").addEventListener("click", getDeck);
drawCardsBtn.addEventListener('click',getCards);

function getDeck(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/", {method:"GET"})
    .then(res => res.json())
    .then(data => {
        deckId=data.deck_id;
        cardsRemaining.textContent = `Remaining cards: ${data.remaining}`
        
        drawCardsBtn.disabled=false;
        
        playerPoints=0;
        computerPoints=0;
        computerPointsEl.textContent = `Computer Points: ${computerPoints}`
        playerPointsEl.textContent = `Player Points: ${playerPoints}`
        
        console.log(deckId)})
}

function getCards(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`, {method:"GET"})
        .then(res => res.json())
        .then(data =>{
            console.log(data);
        
            cardsRemaining.textContent = `Remaining cards: ${data.remaining}`
        
            if(data.remaining === 0){
                drawCardsBtn.disabled = true;

                if(playerPoints>computerPoints){
                    winEl.textContent ="You won the game!";
                }else if(playerPoints<computerPoints){
                    winEl.textContent ="The Computer won the game!";
                }else {
                    winEl.textContent ="It's a tie game!";
                }
            }

            cardsArr=[];
          
            (data.cards).forEach(card => {
                cardsArr.push(card.image)
            });

            renderCards(cardsArr);

            getWinner(data.cards[0],data.cards[1],data.remaining)
        })
}

function renderCards(array){
    cardsEL.children[0].innerHTML= `
        <img src="${array[0]}" class="card" />
    `;

    cardsEL.children[1].innerHTML= `
        <img src="${array[1]}" class="card" />
    `;
}

function getValue(card){
    if(card.value=="JACK"){
        return 11;
    }else if(card.value=="QUEEN"){
        return 12;
    }else if(card.value=="KING"){
        return 13;
    }else if(card.value=="ACE"){
        return 14;
    }else return card.value;
}

function getWinner(card1,card2){
    if(getValue(card1)>getValue(card2)){
         winEl.textContent = "Computer wins!";
         computerPoints++;
         computerPointsEl.textContent = `Computer Points: ${computerPoints}`
    } else if(getValue(card1)<getValue(card2)){
        winEl.textContent ="You win!";
        playerPoints++;
        playerPointsEl.textContent = `Player Points: ${playerPoints}`
    } else {
        winEl.textContent ="War!";
    }
}
