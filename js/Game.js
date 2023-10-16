
let diceList; //one for each die
let tCells;
let rollCount;
let hasRolledSinceClick;
const CLICKABLE_CLASS = 'player-clickable';
const SELECTED_CLASS = 'player-selected';
const ACTIVE_ATTRIBUTE = 'data_active';
const ACTIVE = {ACTIVE: 'True', NOT_ACTIVE: 'False'}
const STRAIGHT_SIZE = {SMALL: 4, LARGE: 5}
const NUMBER_OF_DICE = 5;


/**
 * resets the game
 */
function onLoad() {

    diceList = [];
    rollCount = 0;
    hasRolledSinceClick = true;
    tCells = document.getElementsByTagName('td');

    for(let i = 0; i < NUMBER_OF_DICE; i++)
    {
        diceList.push(new Dice());
    }

    for (let i = 0; i < tCells.length; i++) {
        let cell = tCells[i];
        cell.innerText = null;//resetting the cell for the next game
        cell.classList = null;
        cell.classList.add(CLICKABLE_CLASS);
        cell.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.ACTIVE);

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
    el.removeEventListener("click", event);

    el.classList.replace(CLICKABLE_CLASS, SELECTED_CLASS);
    el.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE)
    calculateTotals();
}


/**
 * takes the start and end, then sums the cells
 * @param start
 * @param end
 * @returns {number} sum of the column
 */
function sumColumn(start, end) {
    let ret = 0;
    for (let i = start; i <= end; i += 2) //player top scores
    {
        if (tCells[i].innerText != null && tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE.NOT_ACTIVE)
            ret += parseInt(tCells[i].innerText);
    }

    if (!(ret >= 0)) //stops the page from displaying NaN for null values
        ret = 0;


    return ret;
}


function isRangeComplete(start, end)
{
    for(let i = start; i <= end; i+=2)
    {
        if(tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE.ACTIVE)
        {
            return false;
        }
    }

    return true;
}

/**
 * sets all the non-player set values in the table
 * e.g. totals for the top, then the bonus
 */
function calculateTotals() {



    //checks top half of player
    if(isRangeComplete(0,10))
    {
        let playerTopTotal = sumColumn(0, 10);
        updateCell(12, playerTopTotal.toString());
        if(playerTopTotal >= 63)
        {
            updateCell(14, '35');
        }
        tCells[12].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
        tCells[14].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
    }

    //checks top half of foe
    if(isRangeComplete(1,11))
    {
        let foeTopTotal = sumColumn(1, 11);
        updateCell(13, foeTopTotal.toString());


        if(foeTopTotal >= 63)
        {
            updateCell(15, '35');
        }
        tCells[13].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
        tCells[15].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
    }

    //checks bottom half of player
    if(isRangeComplete(16, 28))
    {
        let playerBottomTotal = sumColumn(16, 28);
        updateCell(30, playerBottomTotal.toString());

        tCells[30].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
    }

    //checks bottom half of foe
    if(isRangeComplete(17,29))
    {
        let foeBottomTotal = sumColumn(17,29);
        updateCell(31, foeBottomTotal.toString());

        tCells[31].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE);
    }


    tCells[32].id = "playerBottomBonus";
    tCells[34].id = "playerGrandTotal";
    tCells[33].id = "foeBottomBonus";
    tCells[35].id = "foeGrandTotal";
}


function rollDice() {
    if(rollCount === 3)
        return;

    hasRolledSinceClick = true;

    for (let i = 0; i < diceList.length; i++)
    {
        diceList[i].rollDie();
    }

    updateCells();


    rollCount++;
}

function updateCells() {

    clearRange(0, 36);


    let tallies = [0, 0, 0, 0, 0, 0];//number of each number [ones, twos, etc..]
    for (let i = 1; i <= 6; i++)//actual number
    {
        for (let j = 0; j < diceList.length; j++)//value in dieResults
        {
            if (diceList[j].getNumber() === i)
                tallies[i - 1] += 1;
        }
    }

    updateTopCells(tallies);

    updateBottomCells(tallies);

}

/**
 * empties the innerText for the cells in the range provided
 */
function clearRange(start, finish)
{
    for(let i = start; i < finish; i+=2)
    {
        if(tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE.ACTIVE)
        {
            tCells[i].innerText = null;
        }

    }
}


/**
 * changes the value of a single cell if that cell is marked as active
 * @param cellNumber the index of the cell
 * @param newValue what the new text will be
 */
function updateCell(cellNumber, newValue)
{
    if(tCells[cellNumber].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE.ACTIVE)
    {
        tCells[cellNumber].innerText = newValue;
    }
}


/**
 * Changes the values of the top section **Excludes Total and Bonus
 * @param tallies how many of each number there are
 */
function updateTopCells(tallies)
{
    for (let i = 0; i < 6; i++) //first 6
    {
        updateCell(i*2, (tallies[i] * (i + 1)).toString()) ;
    }
}


/**
 * Changes the values of the bottom section **Excludes Totals and Bonus
 * @param tallies how many of each number there are
 */
function updateBottomCells(tallies)
{
    let dieSum = 0; //summing the dice
    for(let i = 0; i < diceList.length; i++)
    {
        dieSum += diceList[i].getNumber();
    }

    let hasThreeOfKind = false;
    let minTally = 1;

    for (let i = 0; i < tallies.length; i++) {
        if (tallies[i] > minTally)
        {
            minTally = tallies[i];
        }
    }



    if (minTally >= 3) {
        hasThreeOfKind = true;
        updateCell(16, dieSum.toString());
    }

    if (minTally >= 4) {
        updateCell(18, dieSum.toString());
    }

    if (hasThreeOfKind && tallies.includes(2)) {
        updateCell(20, '25');
    }

    if (getStraight(STRAIGHT_SIZE.SMALL, tallies)) {
        updateCell(22, '30');
    }

    if (getStraight(STRAIGHT_SIZE.LARGE, tallies)) {
        updateCell(24, '40');
    }

    if (minTally === 5) {
        updateCell(26, '50');
    }

    updateCell(28, dieSum.toString());


}


/**
 * Returns if a straight with the given length is found in the dice
 * straights are like boolean because you get all points, or no points
 * @param straightLength
 * @param tallies
 * @returns {boolean}
 */
function getStraight(straightLength, tallies) {
    //e.g smallLength = 4. starting indexes is 3. because you can have three possible small straight
    let startingIndexes = 6 - straightLength + 1;

    let hasStraight;

    for (let offset = 0; offset < startingIndexes; offset++) {
        hasStraight = true;
        for (let i = 0; i < straightLength; i++) {
            if (tallies[i + offset] === 0) //within the straight, the value cannot be zero
            {
                hasStraight = false;
            }
        }
        if(hasStraight)break;
    }

    return hasStraight;
}