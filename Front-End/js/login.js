const LOGIN_URL = "login.html";

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = {};

// Objeto para o usuário corrente
var usuarioCorrente = {};

// função para gerar códigos randômicos a serem utilizados como código de usuário
// Fonte: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Dados de usuários para serem utilizados como carga inicial
const dadosIniciais = {
  usuarios: [
    {
      id: generateUUID(),
      login: "admin",
      senha: "123",
      nome: "Administrador do Sistema",
      email: "admin@abc.com",
    },
    {
      id: generateUUID(),
      login: "user",
      senha: "123",
      nome: "Usuario Comum",
      email: "user@abc.com",
    },
  ],
};



// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser(login, senha) {
  // Verifica todos os itens do banco de dados de usuarios
  // para localizar o usuário informado no formulario de login
  let status = false;
  let usuario = { login: login, senha: senha };
  let init = {
    method: "POST",
    body: JSON.stringify(usuario)
  }
  let resp = "";
  // Se encontrou login, carrega usuário corrente e salva no Session Storage
  fetch("http://localhost:4567/verificarUsuarioLogin", init)
    .then(response => response.json())
    .then(data => resp = data)
    .then(function () {
      if (resp) {
        sessionStorage.setItem(
          "usuarioCorrente",
          JSON.stringify(usuario.login));
        window.location.href = "index.html";
      } else {
        // Se login falhou, avisa ao usuário
        alert("Usuário ou senha incorretos");
      }
    });

}

// Apaga os dados do usuário corrente no sessionStorage --Nao Mexer--
function logoutUser() {
  usuarioCorrente = {};
  sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuarioCorrente));
  window.location = LOGIN_URL;
}

function addUser(nome, login, senha, email) {
  // Cria um objeto de usuario para o novo usuario
  let newId = generateUUID();
  let usuario = {


    id: newId,
    login: login,
    senha: senha,
    nome: nome,
    email: email,


  };

  let init = {
    method: 'POST',
    body: JSON.stringify(usuario)
  }
  let resp = {
    status: true,
    message: "Usuario cadastrado com sucesso",
    extra: ""
  };
  shouldFetchData(usuario, resp);
  // Inclui o novo usuario no banco de dados baseado em JSON
  //db_usuarios.usuarios.push(usuario);
  if (resp.status) {
    fetch("http://localhost:4567/adicionarUsuario", init)
      .then(response => response.json())
      .then(function (data) {
        resp.extra = data;
      });
  } else {
    alert(resp.message);
  }
  //.then(() => {
  //if (resp) {
  //alert("Usuário salvo com sucesso. Proceda com o login");
  //} else {
  //    alert("Usuario ja existente");
  //    }
  //    });

}

function setUserPass() { }

function shouldFetchData(user, resp) {
  if (//validação da senha do usuário
    user.senha === " " || /*Se a senha é somente um espaço em branco*/
    user.senha === "" /* se a senha é nula*/
  ) {
    resp.status = false;
    resp.message = "Senha inválida";
  }
  else if (
    !/(?=[A-Za-z0-9@#$%*_^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^*_&+!=])(?=.{8,}).*$/.test(user.senha) /*Se inclui ao menos 8 letras, uma maiuscula, um numer, um caracter especial */
  ) {
    resp.status = false;
    resp.message = "Senha deve incluir ao menos 8 letras ou números, uma letra maíuscula e ao mínimo um carater especial.";
  }
  return resp;
}



// Inicializa as estruturas utilizadas pelo LoginApp


// Declara uma função para processar o formulário de login
function processaFormLogin(event) {
  // Cancela a submissão do formulário para tratar sem fazer refresh da tela
  event.preventDefault();

  // Obtem os dados de login e senha a partir do formulário de login
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Valida login e se estiver ok, redireciona para tela inicial da aplicação
  var resultadoLogin = loginUser(username, password);

}

function salvaLogin(event) {
  // Cancela a submissão do formulário para tratar sem fazer refresh da tela
  event.preventDefault();

  // Obtem os dados do formulário
  let login = document.getElementById("txt_login").value;
  let nome = document.getElementById("txt_nome").value;
  let email = document.getElementById("txt_email").value;
  let senha = document.getElementById("txt_senha").value;
  let senha2 = document.getElementById("txt_senha2").value;
  if (senha != senha2) {
    alert("As senhas informadas não conferem.");
    return;
  }

  // Adiciona o usuário no banco de dados
  addUser(nome, login, senha, email);

  // Oculta a div modal do login
  //document.getElementById ('loginModal').style.display = 'none';
  $("#loginModal").modal("hide");
}

// Associa a funçao processaFormLogin  formulário adicionado um manipulador do evento submit
document
  .getElementById("login-form")
  .addEventListener("submit", processaFormLogin);

// Associar salvamento ao botao
document
  .getElementById("btn_salvar")
  .addEventListener("click", salvaLogin);
