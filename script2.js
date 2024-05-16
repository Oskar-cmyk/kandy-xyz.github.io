function expandAndRedirect(url) {
    const leftSide = document.querySelector('.leftside');
    const rightSide = document.querySelector('.rightside');

    if (leftSide.contains(event.target)) {
        rightSide.classList.remove('expanded');
        leftSide.classList.add('expanded');
        leftSide.style.color = '#1C00FF'; // Change text color to #1C00FF
    } else if (rightSide.contains(event.target)) {
        leftSide.classList.remove('expanded');
        rightSide.classList.add('expanded');
        rightSide.style.color = '#1C00FF'; // Change text color to #1C00FF
    }

    setTimeout(() => {
        window.location.href = url;
    }, 300); // Adjust the delay time as needed
}

document.addEventListener('DOMContentLoaded', function() {
    const leftSide = document.querySelector('.leftside');
    const rightSide = document.querySelector('.rightside');

    leftSide.addEventListener('click', function(event) {
        expandAndRedirect('https://oskarkandare.myportfolio.com/work');
    });

    rightSide.addEventListener('click', function(event) {
        expandAndRedirect('mainpage');
    });
});
