
/**
 * sets all the non-player set values in the table
 * e.g. totals for the top, then the bonus
 */
function calculateTotals() {

    let playerTopTotal;
    let playerBottomTotal;
    let playerTopBonus = 0;

    //checks top half of player
    if(isRangeComplete(0,10))
    {
        playerTopTotal = sumColumn(0, 10);
        updateCell(12, playerTopTotal.toString());
        if(playerTopTotal >= 63)
        {
            playerTopBonus = 35;
            updateCell(14, '35');
        }
        tCells[12].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
        tCells[14].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
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
        tCells[13].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
        tCells[15].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
    }

    //checks bottom half of player
    if(isRangeComplete(16, 28))
    {
        playerBottomTotal = sumColumn(16, 28);
        updateCell(30, playerBottomTotal.toString());

        tCells[30].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
    }

    //checks bottom half of foe
    if(isRangeComplete(17,29))
    {
        let foeBottomTotal = sumColumn(17,29);
        updateCell(31, foeBottomTotal.toString());

        tCells[31].setAttribute(ACTIVE_ATTRIBUTE, ACTIVE_LEVEL.NOT_ACTIVE);
    }

    if(isRangeComplete(0, 10) && isRangeComplete(16,28))
    {
        let total = playerTopBonus + playerTopTotal + playerBottomTotal;
        updateCell(32, total);
    }



    tCells[33].id = "foeGrandTotal";
}

/**
 * Triggers all the cells to update
 * when the dice are rolled
 * @param poe
 */
function updateCells(poe) {

    clearColumnInRange(0, 34);


    let tallies = [0, 0, 0, 0, 0, 0];//number of each number [ones, twos, etc..]
    for (let i = 1; i <= 6; i++)//actual number
    {
        for (let j = 0; j < diceList.length; j++)//value in dieResults
        {
            if (diceList[j].getNumber() === i)
                tallies[i - 1] += 1;
        }
    }
    let topStart = 1, bottomStart = 17; //foe as default
    if (poe === POE.PLAYER) //change if player
    {
        topStart = 0;
        bottomStart = 16;
    }

    calculateTopCells(tallies, topStart);

    calculateBottomCells(tallies, bottomStart);

}

/**
 * empties the innerText for the cells in the range provided
 */
function clearColumnInRange(start, finish)
{
    for(let i = start; i < finish; i+=2)
    {
        if(tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE_LEVEL.ACTIVE)
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
    if(tCells[cellNumber].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE_LEVEL.ACTIVE)
    {
        tCells[cellNumber].innerText = newValue;
    }
}


/**
 * Changes the values of the top section **Excludes Total and Bonus
 * @param tallies how many of each number there are
 */
function calculateTopCells(tallies, start)
{
    for (let i = 0; i < 6; i++) //first 6
    {
        updateCell(start+(i*2), (tallies[i] * (i + 1)).toString()) ;
    }
}


/**
 * Changes the values of the bottom section **Excludes Totals and Bonus
 * @param tallies how many of each number there are
 */
function calculateBottomCells(tallies, index)
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
        updateCell(index, dieSum.toString());
    }
    else
        updateCell(index, 0)

    index+=2;
    if (minTally >= 4) {
        updateCell(index, dieSum.toString());
    }
    else
        updateCell(index, 0)
    index+=2;
    if (hasThreeOfKind && tallies.includes(2)) {
        updateCell(index, '25');
    }
    else
        updateCell(index, 0)

    index+=2;
    if (hasStraight(STRAIGHT_SIZE.SMALL, tallies)) {
        updateCell(index, '30');
    }
    else
        updateCell(index, 0)
    index+=2;
    if (hasStraight(STRAIGHT_SIZE.LARGE, tallies)) {
        updateCell(index, '40');
    }
    else
        updateCell(index, 0)
    index+=2;
    if (minTally === 5) {
        updateCell(index, '50');
    }
    else
        updateCell(index, 0)
    index+=2;
    updateCell(index, dieSum.toString());


}


/**
 * Returns if a straight with the given length is found in the dice
 * straights are like boolean because you get all points, or no points
 * @param straightLength
 * @param tallies
 * @returns {boolean}
 */
function hasStraight(straightLength, tallies) {
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
        if (tCells[i].innerText != null && tCells[i].getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE_LEVEL.NOT_ACTIVE)
            ret += parseInt(tCells[i].innerText);
    }

    if (!(ret >= 0)) //stops the page from displaying NaN for null values
        ret = 0;


    return ret;
}