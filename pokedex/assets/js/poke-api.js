
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

function searchPokemons() {
    const searchInput = document.querySelector('.search input');
    const pokemonName = searchInput.value.toLowerCase();

    if (!pokemonName) return;

    const pokemonList = document.querySelector('.pokemon-list');
    if (!pokemonList) {
        console.error('Element with class "pokemon-list" not found.');
        return;
    }

    pokeApi.getPokemons(0, 151) // Busca todos os Pokémon para comparação
        .then((pokemons) => {
            const foundPokemon = pokemons.find(pokemon => pokemon.name.toLowerCase() === pokemonName);
            pokemonList.innerHTML = ''; // Limpa a lista atual

            if (foundPokemon) {
                const pokemonItem = document.createElement('li');
                pokemonItem.classList.add('found-pokemon');
                pokemonItem.innerHTML = convertPokemonToLi(foundPokemon); // Adiciona o Pokémon encontrado
                pokemonList.appendChild(pokemonItem);

                // Salva o Pokémon encontrado no Local Storage
                savePokemonToLocalStorage(foundPokemon);
            } else {
                const notFoundItem = document.createElement('li');
                notFoundItem.classList.add('pokemon');
                notFoundItem.textContent = 'Pokémon not found';
                pokemonList.appendChild(notFoundItem);
            }
        })
        .catch((error) => {
            console.error('Error fetching pokemons:', error);
        });

    searchInput.value = ''; // Limpa o campo de busca
}

function savePokemonToLocalStorage(pokemon) {
    let searchedPokemons = JSON.parse(localStorage.getItem('searchedPokemons')) || [];
    searchedPokemons.push(pokemon);
    localStorage.setItem('searchedPokemons', JSON.stringify(searchedPokemons));
}

function loadSearchedPokemons() {
    const searchedPokemons = JSON.parse(localStorage.getItem('searchedPokemons')) || [];
    const pokemonList = document.querySelector('.pokemon-list');
    pokemonList.innerHTML = ''; // Limpa a lista atual

    searchedPokemons.forEach(pokemon => {
        const pokemonItem = document.createElement('li');
        pokemonItem.classList.add('pokemon'); // Use uma classe padrão para exibição
        pokemonItem.innerHTML = convertPokemonToLi(pokemon);
        pokemonList.appendChild(pokemonItem);
    });
}

function showSearchedPokemons() {
    loadSearchedPokemons(); // Recarrega os Pokémon pesquisados
}
// Adiciona eventos ao botão e ao campo de entrada
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

const searchButton = document.querySelector('.search button');
searchButton.addEventListener('click', searchPokemons);

// Adiciona evento para pressionar "Enter"
const searchInput = document.querySelector('.search input');
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});