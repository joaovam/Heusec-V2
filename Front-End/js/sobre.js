onload = () => {
  let usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));

  if (usuarioCorrente != null) {
    logado();
    document.getElementById("logout").addEventListener("click", logout);
  } else {
    login();
    formulario();
  }

  let botoes;
  botoes = document.querySelectorAll(".btn-iniciante");
  for (i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", iniciante);
  }

  botoes = document.querySelectorAll(".btn-intermediario");
  for (i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", intermediario);
  }

  botoes = document.querySelectorAll(".btn-avancado");
  for (i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", avancado);
  }
};

let login = () => {
  let logins = document.querySelectorAll(".login");

  for (i = 0; i < logins.length; i++) {
    logins[i].setAttribute("href", "login.html");
  }
};

let logout = () => {
  sessionStorage.removeItem("usuarioCorrente");
  document.location.reload();
};

let logado = () => {
  let usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
  nome = usuarioCorrente;

  let logins = document.querySelectorAll(".login");
  let usuario = document.querySelectorAll(".usuario");

  if (usuarioCorrente == "admin") {
    for (i = 0; i < logins.length; i++) {
      usuario[i].innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        ${nome}
      </a>
      
      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        <a class="dropdown-item" href="minhaConta.html">Minha Conta</a>
        
        <a class="dropdown-item" href="#" id = "logout">Sair</a>
      </div>
        `;
      logins[i].innerHTML = `${nome}`;
      logins[i].setAttribute("href", "usuario.html");
    }
  } else {
    for (i = 0; i < logins.length; i++) {
      usuario[i].innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  ${nome}
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="minhaConta.html">Minha Conta</a>
                  <a class="dropdown-item" href="#" id = "logout">Sair</a>
                </div>
      `;
      logins[i].innerHTML = `${nome}`;
      logins[i].setAttribute("href", "usuario.html");
    }
  }
};
