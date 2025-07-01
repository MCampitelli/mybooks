document.getElementById('genero').addEventListener('change', atualizarListaLivros);
document.getElementById('nome').addEventListener('input', atualizarListaLivros);

document.getElementById('voltar-lista').addEventListener('click', () => {
  document.getElementById('painel-detalhes').classList.add('hidden');
  document.querySelector('.card-lista').classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('books.json')
    .then(response => response.json())
    .then(livros => {
      popularFiltros(livros);
      // Se quiser armazenar os livros carregados para uso futuro:
      window.listaDeLivros = livros;
    })
    .catch(error => console.error('Erro ao carregar livros.json:', error));
});

atualizarListaLivros();

document.getElementById('play-music').addEventListener('click', () => {
  const audio = document.getElementById('bg-music');

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

const btnFiltro = document.getElementById('toggle-filtro');
const boxFiltro = document.getElementById('filtro-box');

btnFiltro.addEventListener('click', () => {
  boxFiltro.classList.toggle('hidden');
});

function popularFiltros(livros) {
  const generoSet = new Set();
  const editoraSet = new Set();

  livros.forEach(livro => {
    generoSet.add(livro.genero);
    editoraSet.add(livro.editora);
  });

  const generoSelect = document.getElementById('genero');
  const editoraSelect = document.getElementById('editora');

  generoSet.forEach(genero => {
    const option = document.createElement('option');
    option.value = genero.toLowerCase();
    option.textContent = genero;
    generoSelect.appendChild(option);
  });

  editoraSet.forEach(editora => {
    const option = document.createElement('option');
    option.value = editora.toLowerCase();
    option.textContent = editora;
    editoraSelect.appendChild(option);
  });
}

async function atualizarListaLivros() {
  const container = document.getElementById('livros-container');
  const generoFiltro = document.getElementById('genero').value.toLowerCase();
  const nomeFiltro = document.getElementById('nome').value.toLowerCase();

  try {
    const response = await fetch('books.json');
    if (!response.ok) throw new Error('Erro ao carregar o JSON dos livros');
    const livros = await response.json();

    const livrosFiltrados = livros.filter(livro => {
      const generoLivro = livro.genero.toLowerCase();
      const nomeLivro = livro.nome.toLowerCase();

      const generoOk = !generoFiltro || generoLivro.includes(generoFiltro);
      const nomeOk = !nomeFiltro || nomeLivro.includes(nomeFiltro);

      return generoOk && nomeOk;
    });

    if (livrosFiltrados.length === 0) {
      container.innerHTML = '<p>Nenhum livro encontrado.</p>';
      return;
    }

    // Gera HTML
    container.innerHTML = livrosFiltrados.map(livro => `
      <article class="livro" tabindex="0" data-id="${livro.id}">
        <img src="assets/capas/${livro.id}.jpg" alt="Capa do livro ${livro.nome}" />
        <div class="livro-info">
          <h3>${livro.nome}</h3>
          <p><em>${livro.autor}</em></p>
        </div>
      </article>
    `).join('');

    // Agora os elementos .livro existem — adiciona eventos de clique
    document.querySelectorAll('.livro').forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.getAttribute('data-id'));
        const livro = livrosFiltrados.find(l => l.id === id);
        if (livro) abrirDetalhesLivro(livro);
      });
    });

  } catch (error) {
    container.innerHTML = '<p>Erro ao carregar os livros.</p>';
    console.error(error);
  }
}


function abrirDetalhesLivro(livro) {
  // Preenche os dados
  document.getElementById('detalhe-capa').src = `assets/capas/${livro.id}.jpg`;
  document.getElementById('detalhe-capa').alt = `Capa do livro ${livro.nome}`;
  document.getElementById('detalhe-nome').textContent = livro.nome;
  document.getElementById('detalhe-autor').textContent = livro.autor;
  document.getElementById('detalhe-genero').textContent = livro.genero;
  document.getElementById('detalhe-editora').textContent = livro.editora;
  document.getElementById('detalhe-ano').textContent = livro.ano_lancamento;
  document.getElementById('detalhe-avaliacao').textContent = livro.avaliacao;

  const preco = parseFloat(livro.preco);
  document.getElementById('detalhe-preco').textContent = preco.toFixed(2).replace('.', ',');

  document.getElementById('detalhe-paginas').textContent = livro.paginas;
  
  const linkElement = document.getElementById('detalhe-link');
  linkElement.innerHTML = `<a href="${livro.link}" target="_blank">Ver no site</a>`;

  document.getElementById('detalhe-resumo').textContent = livro.resumo;
  document.getElementById('detalhe-opiniao').textContent = livro.opiniao;

  // Alterna as telas
  document.querySelector('.card-lista').classList.add('hidden');
  document.getElementById('painel-detalhes').classList.remove('hidden');
}
