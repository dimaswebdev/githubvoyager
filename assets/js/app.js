let filtroPesquisa = 'repositorios';

// Funções para mudar o filtro com base no botão clicado
document.getElementById('buscar-repositorios').addEventListener('click', function() {
    setBotaoAtivo('buscar-repositorios');
    filtroPesquisa = 'repositorios';
});

document.getElementById('buscar-desenvolvedores').addEventListener('click', function() {
    setBotaoAtivo('buscar-desenvolvedores');
    filtroPesquisa = 'desenvolvedores';
});

document.getElementById('explorar-trending').addEventListener('click', function() {
    setBotaoAtivo('explorar-trending');
    filtroPesquisa = 'trending';
});

// Função para limpar a pesquisa
document.getElementById('botao-limpar').addEventListener('click', function() {
    document.getElementById('input-pesquisa').value = '';
    document.getElementById('container-resultados').innerHTML = '';
    removeBotoesAtivos();
    filtroPesquisa = 'repositorios'; // Reset para o filtro padrão
    document.querySelector('.pesquisa-principal').classList.remove('mover-esquerda');
    document.querySelector('.resultados').classList.remove('mostrar');
});

// Função para realizar a busca
document.getElementById('botao-pesquisa').addEventListener('click', realizarPesquisa);

document.getElementById('input-pesquisa').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        realizarPesquisa();
    }
});

function realizarPesquisa() {
    const query = document.getElementById('input-pesquisa').value;

    if (query || filtroPesquisa === 'trending') {
        document.querySelector('.pesquisa-principal').classList.add('mover-esquerda');
        document.querySelector('.resultados').classList.add('mostrar');

        if (filtroPesquisa === 'repositorios') {
            buscarRepositorios(query);
        } else if (filtroPesquisa === 'desenvolvedores') {
            buscarDesenvolvedores(query);
        } else if (filtroPesquisa === 'trending') {
            buscarTrending();
        }
    }
}

// Função para buscar repositórios no GitHub
async function buscarRepositorios(query) {
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        const data = await response.json();
        exibirRepositorios(data.items);
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}

// Função para buscar desenvolvedores no GitHub
async function buscarDesenvolvedores(query) {
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${query}`);
        const data = await response.json();
        exibirDesenvolvedores(data.items);
    } catch (error) {
        console.error('Erro ao buscar desenvolvedores:', error);
    }
}

// Função para exibir repositórios
function exibirRepositorios(repositorios) {
    const containerResultados = document.getElementById('container-resultados');
    containerResultados.innerHTML = '';  // Limpa os resultados anteriores

    repositorios.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('resultado-item');
        repoItem.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : "Sem descrição disponível"}</p>
            <a href="${repo.html_url}" target="_blank">Visitar Repositório</a>
        `;
        containerResultados.appendChild(repoItem);
    });
}

// Função para exibir desenvolvedores
function exibirDesenvolvedores(desenvolvedores) {
    const containerResultados = document.getElementById('container-resultados');
    containerResultados.innerHTML = '';  // Limpa os resultados anteriores

    desenvolvedores.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('resultado-item');
        userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}">
            <h3>${user.login}</h3>
            <a href="${user.html_url}" target="_blank">Visitar Perfil</a>
        `;
        containerResultados.appendChild(userItem);
    });
}

// Função para destacar o botão ativo
function setBotaoAtivo(botaoId) {
    removeBotoesAtivos();
    document.getElementById(botaoId).classList.add('active');
}

// Função para remover a classe 'active' de todos os botões
function removeBotoesAtivos() {
    document.querySelectorAll('.dropdown-content a.active').forEach(botao => {
        botao.classList.remove('active');
    });
}

// Função para buscar os repositórios em "trending"
async function buscarTrending() {
    try {
        const response = await fetch('https://api.github.com/search/repositories?q=stars:>1000&sort=stars');
        const data = await response.json();
        exibirRepositorios(data.items);
    } catch (error) {
        console.error('Erro ao buscar trending:', error);
    }
}

// Função para exibir/esconder o menu suspenso
document.querySelector('.dropbtn').addEventListener('click', function() {
    const dropdown = document.getElementById('filtro-menu');
    dropdown.classList.toggle('show');
});
