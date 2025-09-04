const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Typing animation
const words = document.querySelectorAll('.dynamic-txts li');
let currentWordIndex = 0;

function showNextWord() {
    // Remove active class from all words
    words.forEach(word => word.classList.remove('active'));
    
    // Add active class to current word
    words[currentWordIndex].classList.add('active');
    
    // Move to next word
    currentWordIndex = (currentWordIndex + 1) % words.length;
}

// Start the animation
if (words.length > 0) {
    showNextWord(); // Show first word immediately
    setInterval(showNextWord, 2000); // Change word every 2 seconds
}