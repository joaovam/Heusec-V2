

let logado = () => {
  let usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  nome = usuarioCorrente;

  let logins = document.querySelectorAll(".login");
  let usuario = document.querySelectorAll(".usuario");

  for (i = 0; i < logins.length; i++) {
    usuario[i].innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  ${nome}
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="#" id = "favoritos">Favoritos</a>
                  <a class="dropdown-item" href="minhaConta.html">Minha Conta</a>
                  <a class="dropdown-item" href="#" id = "logout">Sair</a>
                </div>
      `;
    logins[i].innerHTML = `${nome}`;
  }
};
let login = () => {
  let logins = document.querySelectorAll(".login");

  for (i = 0; i < logins.length; i++) {
    logins[i].setAttribute("href", "login.html");
  }
};

let encontraFavoritos = () => {

  let usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  let bodyUsuario = { usuario: usuario };
  let init = {
    method: 'GET'
  }

  fetch("http://localhost:4567/"+ `listarFavoritos?login=${usuario}`, init)
    .then(response => response.json())
    .then((dados)=>{
      atualizaTela(dados);
    });

};

let atualizaTela = (conteudo) => {
  let tela = document.querySelector(".cards-minhaConta");
  let texto = "";
  console.log(conteudo);
  for (i = 0; i < conteudo.Favoritos.length; i++) {
    let noticia = conteudo.Favoritos[i];
    

    texto += `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 cards" id="${noticia.id}">
    <div class="card bg-dark" style="width: 18rem;">
    <a href="${noticia.url}" target = "blank" rel="noopener noreferrer"
      ><img src="${noticia.imagem}" class="card-img-top padrao" alt="..."
    /></a>
    <div class="card-body">
    <a href="${noticia.url}" target="blank" rel="noopener noreferrer"><h5 class="card-title">${noticia.titulo}</h5></a>
      <p class="card-text">
        ${noticia.resumo}
      </p>
      </div>
      <p class="more">
      <div class = "card-footer">
        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal${i}">Saber mais</button>
      </div>

      <div class="modal fade" id="exampleModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content text-dark">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">${noticia.titulo}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            <h5>${noticia.texto}</h5>
            </div>
            <div class="modal-footer">
              <a href="${noticia.url}" target="blank" rel="noopener noreferrer">
                <button type="button" class="btn btn-primary visitaSite" >Visitar Site</button>
              </a>
              <button type="button" class="btn btn-secondary adicionaFavorito disabled" id="${noticia.id}" onclick = "adicionaFavorito(this)"> Favoritar</button>
              <button type="button" class="btn btn-dark adicionaFavorito" id="${noticia.id}" onclick = "removeFavorito(this)" data-dismiss="modal"> Remover</button>
              <button type="button" class="btn btn-dark" data-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
            </p>
          </div>
        </div>
  
  
  `;
  }
  tela.innerHTML = texto;
};

let removeFavorito = (e) => {
  let id = e.getAttribute("id");
  let usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  // let favoritos = JSON.parse(localStorage.getItem("favoritos"));
  let bodyUsuario = {
    usuario: usuario,
    id: id
  };
  let init = {
    method: 'POST',
    body: JSON.stringify(bodyUsuario)
  }
  let resp = "";
  fetch("http://localhost:4567/" + "removerFavorito", init)
    .then(response => response.json())
    .then(data => resp = data)
    .then(()=>{
      
      encontraFavoritos();

    });
};

let salvas = []; // Array senhas salvas
let salvarSenha = () => {
  let endereco, login, senha, usuario;

  endereco = document.getElementById("txtEndereco").value;
  usuario = document.getElementById("txtLogin").value;
  senha = document.getElementById("txtSenha").value;
  login = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  let csenha = { usuario: usuario, endereco: endereco, senha: senha, login: login };
  let init = {

    method: 'POST',
    body: JSON.stringify(csenha)

  }
  fetch("http://localhost:4567/salvarSenha", init)
    .then(() => {
      exibeSenhasSalvas();

    })
};

let exibeSenhasSalvas = () => {
  let tela = document.querySelector("#listaSenhas");
  let texto = "";
  let telaQt = document.querySelector("#qtSenhas");
  let textoQt = "";
  let usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  let init = { method: 'GET' };
  fetch(`http://localhost:4567/exibeSenhas?usuario=${usuarioCorrente}`, init)
    .then(response => response.json())
    .then(function (resp) {
      if (resp.senhas != undefined) {
        let qtSenhas = 0;
        resp = resp.senhas;
        // resp = JSON.parse(resp);
        for (i = 0; i < resp.length; i++) {

          let id = resp[i].id;
          let endereco = resp[i].site;
          let login = resp[i].usuario;
          let senha = resp[i].senha;
          qtSenhas++;

          texto =
            texto +
            `
      <li class="list-group-item list-group-item-action" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
        <section>${endereco}</section>
      </li>
      <div class="collapse" id="collapse${i}">
        <div class="card-informacoes card card-body">
          <h5><strong>Login:</strong> ${login}</h5>
          <h5><strong>Senha:</strong> ${senha}</h5>
          <button type="button" value="${i}" class="btn btn-danger" data-dismiss="modal" onclick="apagaSenha(${id})">Apagar senha</button>
        </div>
      </div>`;
        }

        textoQt = `
      <p>${qtSenhas} senha(s)</p>
    `;

        telaQt.innerHTML = textoQt;
        tela.innerHTML = texto;
      }
    }
    );
};

let pesquisaSenhas = () => {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("txtBusca");
  filter = input.value.toUpperCase();
  ul = document.getElementById("listaSenhas");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    tag = li[i].getElementsByTagName("section")[0];
    txtValue = tag.textContent || tag.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
};

let apagaSenha = (id) => {
  let d = { id: id };
  let init = { method: 'POST', body: JSON.stringify(d) };
  fetch("http://localhost:4567/apagaSenha", init)
    .then(document.location.reload());

};

let logout = () => {
  sessionStorage.removeItem("usuarioCorrente");
  document.location.reload();
};

onload = () => {
  let usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  if (usuarioCorrente != null) {
    logado();
    exibeSenhasSalvas();
    encontraFavoritos();

    document.getElementById("logout").addEventListener("click", logout);
  } else {
    login();
  }
};
