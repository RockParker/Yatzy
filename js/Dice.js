
class Dice
{
    constructor(number = null, element)
    {
        this.number = number;
        this.isActive = true;

        this.imgEl = document.getElementById(element);

        this.imgEl.onclick = (event) =>
        {
            this.isActive = !this.isActive;
            if(!this.isActive)
                this.imgEl.classList.add('blur');
            else
                this.imgEl.classList.remove('blur');
        }
    }

    getNumber()
    {
        return this.number;
    }

    roll()
    {
        if(this.isActive)
        {
            this.number = Math.floor(Math.random() * 6) + 1;
            this.imgEl.setAttribute('src', ('Dice/'+this.number+'_face.png'));
        }

    }

    reset()
    {
        this.isActive = true;
        this.imgEl.classList.remove('blur');
        this.imgEl.setAttribute('src', 'Dice/'+1+'_face.png');
        this.number = null;
    }
}