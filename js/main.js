const headerTitle = 'Ross Parker';
const infoText = 'Full Time Student || (xxx) xxx-xxxx || emailaddress@dnsserver.com';
function loadHeader(title= headerTitle, info=infoText)
{
    let cont = document.getElementById('top-container');
    let el = document.createElement('my-header');
    cont.append(el);

    document.getElementById('main-header').innerText = title;
    document.getElementById('info-about-me').innerText = info;


}

function iconClick()
{
    let rotatable = document.getElementById('header-icon');
    let otherPageNav = document.getElementById('many-page-container');
    let list = document.getElementById('page-list');

    if(rotatable.classList.contains('rotate')) //if it is there, remove it
    {
        rotatable.classList.remove('rotate')
        otherPageNav.classList.remove('icon-clicked')
        list.style.visibility = 'hidden';

    }
    else
    {
        rotatable.classList.add('rotate')
        otherPageNav.classList.add('icon-clicked')
        list.style.visibility = 'visible';

    }
}