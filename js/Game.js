
/**
 * I need to
 *      - set all the table cells to 'listen' for the dice to change
 *      - set all the table cells to 'listen' for a click event and freeze at that point
 *
 */

let dieResults = [1, 1, 1, 1, 1]; //one for each die
let tCells;
const CLICKABLE_CLASS  = 'player-clickable';
const SELECTED_CLASS = 'player-selected';
const ACTIVE_ATTRIBUTE = 'data_active';
const ACTIVE = { ACTIVE: 'True', NOT_ACTIVE: 'False'}

/**
 * resets the game
 */
function onLoad()
{
    tCells= document.getElementsByTagName('td');

    for(let i = 0; i < tCells.length; i++)
    {
        let cell = tCells[i];
        cell.innerText = null;//resetting the cell for the next game
        cell.classList = null;
        cell.classList.add(CLICKABLE_CLASS);
        cell.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.ACTIVE);

        if(i%2 === 0 && (i < 11 || (i > 14 && i < 30))) //setting the ranges that the user can score with
        {
            cell.addEventListener("click", click);
            cell.style.cursor = "pointer";
        }
        else if(i%2 !== 0 && (i <= 11 || (i > 15 && i < 30))) //setting the ranges that the foe can score with
        {
            /*cell.innerText = i.toString();*/
            //this is where stuff relating to the foe will be
        }
    }

    tCells[12].id = "playerTopTotal";
    tCells[14].id = "playerTopBonus";
    tCells[30].id = "playerBottomTotal";
    tCells[32].id = "playerBottomBonus";
    tCells[34].id = "playerGrandTotal";
    tCells[13].id = "foeTopTotal";
    tCells[15].id = "foeTopBonus";
    tCells[31].id = "foeBottomTotal";
    tCells[33].id = "foeBottomBonus";
    tCells[35].id = "foeGrandTotal";
}

/**
 * click handler for the cells the player can use
 * @param event
 */
function click(event)
{
    let el = event.target;
    el.removeEventListener("click", event);
    el.classList.remove(CLICKABLE_CLASS);
    el.classList.add(SELECTED_CLASS);
    el.setAttribute(ACTIVE_ATTRIBUTE, ACTIVE.NOT_ACTIVE)
    calculateTotals();
}


/**
 * takes the start and end, then sums the cells
 * @param start
 * @param end
 * @returns {number} sum of the column
 */
function sumColumn(start, end)
{
    let ret = 0;
    for(let i = start; i <= end; i+=2 ) //player top scores
    {
        if(tCells[i].innerText != null)
            ret += parseInt(tCells[i].innerText);
    }

    return ret;
}

/**
 * sets all the non-player set values in the table
 * e.g. totals for the top, then the bonus
 */
function calculateTotals()
{

    let playerTopTotal = sumColumn(0, 10);
    let playerBottomTotal = sumColumn(16, 28);
    let foeTopTotal = sumColumn(1, 11);
    let foeBottomTotal = sumColumn(17, 29);

    document.getElementById('playerTopTotal').innerText = playerTopTotal.toString();
    document.getElementById('playerBottomTotal').innerText = playerBottomTotal.toString();

    document.getElementById('foeTopTotal').innerText = foeTopTotal.toString();
    document.getElementById('foeBottomTotal').innerText = foeBottomTotal.toString();


    ///here be the bonus checks

    let playerTopBonus = 0, foeTopBonus = 0;

    if(playerTopTotal >= 63)
        playerTopBonus = 35;

    if(foeTopTotal >= 63)
        foeTopBonus = 35;

    document.getElementById('playerTopBonus').innerText = playerTopBonus.toString();
    document.getElementById('foeTopBonus').innerText = foeTopBonus.toString();
}


function rollDice()
{
    for(let i = 0; i < 5; i++)
    {
        dieResults[i] = Math.floor(Math.random() * 6) + 1;
    }
    updateCells();
}

function updateCells()
{
    let tallies = [0, 0, 0, 0, 0, 0];//number of each number [ones, twos, etc..]

    for(let i = 1; i <= 6; i++)//actual number
    {
        for(let j = 0; j <= 5; j++)//value in dieResults
        {
            if(dieResults[j] === i)
                tallies[i-1] += 1;
        }
    }

    //from ones to sixes
    for(let i = 0; i < 6; i++)
    {
        let cell = tCells[(i*2)]
        if(cell.getAttribute(ACTIVE_ATTRIBUTE) === ACTIVE.ACTIVE) // not working... should stop from overwriting the current value
            cell.innerText = (tallies[i] * (i+1)).toString();
    }


}