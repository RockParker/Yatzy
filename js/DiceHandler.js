class DiceHandler {
    constructor(numberOfDice) {
        this.dice = [];
        this.numDice = numberOfDice;
        this.#createDice(numberOfDice);
    }


    #createDice() {
        for (let i = 0; i < this.numDice; i++)
            this.dice.push(new Dice(null, 'die-img' + (i + 1)));
    }

    resetDice() {
        for (let i = 0; i < this.numDice; i++)
            this.dice[i].reset();
    }

    getDice()
    {
        return this.dice;
    }


    /**
     * rolls all the dice
     * @param poe
     */
    async rollDice() {

        await fetch(diceEndPoint)
            .then(response => response.text())
            .then(data => {
                let values = data.replace('[', '')
                    .replace(']', '')
                    .split(',')
                for (let i = 0; i < this.numDice; i++) {
                    this.dice[i].setNumber(Number(values[i])); //set the number
                }
            })
            .catch(e => {
                console.log('Error from fetch: \n' + e)
                for (let i = 0; i < this.numDice; i++)
                    this.dice[i].roll(); //any errors getting server, will default to rolling "offline"
            });
    }




}



