
let diceList = null; //one for each die
let tCells;
let rollCount;
let hasRolledSinceClick;
const CLICKABLE_CLASS = 'player-clickable';
const SELECTED_CLASS = 'player-selected';
const ACTIVE_ATTRIBUTE = 'data_is_active';
const ACTIVE_LEVEL = {ACTIVE: 'True', NOT_ACTIVE: 'False'};
const STRAIGHT_SIZE = {SMALL: 4, LARGE: 5};
const NUMBER_OF_DICE = 5;
const POE ={PLAYER:'player', FOE:'foe'};


/**
 * resets the game
 */
function startNewGame() {
    rollCount = 0;
    hasRolledSinceClick = true;
    tCells = document.getElementsByTagName('td');

    if(diceList === null)
        createDice();
    else
        resetDice();

    for (let i = 0; i < tCells.length; i++) {
        let cell = tCells[i];
        cell.innerText = null;//resetting the cell for the next game
        cell.classList = null;
        cell.classList.add(CLICKABLE_CLASS);
        cell.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.ACTIVE);

        if (i % 2 === 0 && (i < 11 || (i > 14 && i < 30))) //setting the ranges that the user can score with
        {
            cell.addEventListener("click", cellClick);
            cell.style.cursor = "pointer";
        } else if (i % 2 !== 0 && (i <= 11 || (i > 15 && i < 30))) //setting the ranges that the foe can score with
        {
            /*cell.innerText = i.toString();*/
            //this is where stuff relating to the foe will be
        }
    }


}

/**
 * click handler for the cells the player can use
 * @param event
 */
function cellClick(event) {
    if(!hasRolledSinceClick)
        return;

    hasRolledSinceClick = false;
    rollCount = 0;
    let el = event.target;

    el.classList.replace(CLICKABLE_CLASS, SELECTED_CLASS);
    el.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE)
    calculateTotals();
    resetDice();
}




/**
 * ensures that all the values are filled in
 * allows the total to only appear after a section is done
 * @param start
 * @param end
 * @returns {boolean}
 */
function isRangeComplete(start, end)
{
    for(let i = start; i <= end; i+=2)
    {
        if(tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE_LEVEL.ACTIVE)
        {
            return false;
        }
    }

    return true;
}



/**
 * rolls all the dice
 * @param poe
 */
function rollDice(poe) {
    if(rollCount === 3)
        return;

    hasRolledSinceClick = true;

    for (let i = 0; i < diceList.length; i++)
    {
        diceList[i].roll();
    }

    updateCells(poe);


    rollCount++;
}


/**
 * just made to shrink the startNewGame Method
 */
function createDice()
{
    diceList = [];
    for(let i = 0; i < NUMBER_OF_DICE; i++)
    {
        diceList.push(new Dice(null, 'die-img'+(i+1)));
    }
}

/**
 * called to set the dice up for the next roll or game.
 * Just sets them all to active
 */
function resetDice()
{
    for (let i = 0; i< NUMBER_OF_DICE; i++)
    {
        diceList[i].reset();
    }
}