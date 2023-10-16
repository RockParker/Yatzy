
class Dice
{
    constructor(number = null)
    {
        this.number = number;
        this.isActive = true;
    }

    getNumber()
    {
        return this.number;
    }

    rollDie()
    {
        if(this.isActive)
        {
            this.number = Math.floor(Math.random() * 6) + 1;
        }

    }

    changeActive()
    {
        this.isActive = !this.isActive;
    }

}