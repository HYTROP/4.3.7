const searchInput = document.getElementById('search-input');
const autocompleteList = document.getElementById('autocompleteList');
const repositoryList = document.getElementById('repositoryList');

let debounceTimer; // debounce

searchInput.addEventListener('keyup', function () { // проверяем ждем событие нажатия
  clearTimeout(debounceTimer); // чистим таймаут 
  debounceTimer = setTimeout(() => { // создаем отсрочку запроса
    const query = searchInput.value; // записываем в поле ввода запрос

    if (query.trim() === '') { // проверяем на лишние пробелы
      autocompleteList.innerHTML = '';
    } else {
      fetch(`https://api.github.com/search/repositories?q=${query}`)
        .then(response => response.json())
        .then(data => {
          autocompleteList.innerHTML = '';
          for (let i = 0; i < Math.min(5, data.items.length); i++) {
            const repo = data.items[i];
            const li = document.createElement('li');
            li.textContent = repo.name;
            li.addEventListener('click', function () {
              addRepository(repo);
              searchInput.value = '';
              autocompleteList.innerHTML = '';
            });
            autocompleteList.insertAdjacentElement('beforeend', li);
          }
        });
    }
  }, 300);
});

function addRepository(repo) {
  const ul = document.createElement('ul');
  ul.innerHTML = `
    <li>Name: ${repo.name}</li>
    <li>Owner: ${repo.owner.login}</li>
    <li>Stars: ${repo.stargazers_count}</li>
    <button class="remove-button">
      <img src="./img/output.png" alt="Remove" class="img-btn">
    </button>
  `;
  ul.querySelector('.remove-button').addEventListener('click', function () {
    repositoryList.removeChild(ul);
  });
  repositoryList.appendChild(ul);
}