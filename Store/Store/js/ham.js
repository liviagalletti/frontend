const mainnav = document.querySelector('.main-nav');
const hambutton = document.querySelector('#menu');

// Add a click event listener to the hamburger button and use a callback function that toggles the list element's list of classes.
hambutton.addEventListener('click', () => {
    console.log('Hamburger button clicked!');
    mainnav.classList.toggle('show');
    hambutton.classList.toggle('show');
});