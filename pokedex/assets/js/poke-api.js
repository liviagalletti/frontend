
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

function searchPokemons () {
    const searchInput = document.querySelector('.search input');
    const pokemonName = searchInput.value.toLowerCase();

    if(!pokemonName) return;

    pokeApi.getPokemons(0, 151) // Busca todos os Pokémon para comparação
    .then((pokemons) => {
        const foundPokemon = pokemons.find(pokemon => pokemon.name.toLowerCase() === pokemonName);
        pokemonList.innerHTML = ''; // Limpa a lista atual

        if (foundPokemon) {
            pokemonList.innerHTML = convertPokemonToLi(foundPokemon); // Adiciona o Pokémon encontrado
        } else {
            pokemonList.innerHTML = `<li class="pokemon">Pokémon não encontrado</li>`; // Mensagem de erro
        }
    });

searchInput.value = ''; // Limpa o campo de busca
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