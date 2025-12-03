document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.querySelector('.searchBtn');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    // Open search bar
    searchBtn.addEventListener('click', () => {
        searchBar.classList.add('open');
        searchInput.focus();
    });

    // Close search bar
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('open');
    });
});
