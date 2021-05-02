import static spark.Spark.*;

import java.util.*;
import org.json.*;
import java.net.*;
import java.net.http.*;
import java.io.*;

public class Spark {
	static Scanner sc = new Scanner(System.in);

	public static void main(String[] Args) {
		
		staticFiles.location("/public");

		System.out.println("SPARK Main - Servidor está rodando com sucesso.");

		get("/", (request, response) -> {
			response.redirect("/index.html");
			return "200 OK";
		});

		post("/senhaForca", (request, response) -> {
			//JSONArray j2 = new JSONArray(request.body());
	        //System.out.println(j2.getString(0));
	        
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");	
			//System.out.println(response.toString());
			String returnVal[];
			try {

				String url = "https://ussouthcentral.services.azureml.net/workspaces/34c27db996a549be84d8289e923d4da0/services/6cf1f6cbd1a64b2ca1125c5cffc91f4a/execute?api-version=2.0&format=swagger";
				 HttpClient client = HttpClient.newHttpClient();
			        HttpRequest req = HttpRequest.newBuilder()
			                .uri(URI.create(url)).header("Content-Type","application/json")
			                .header("Authorization","Bearer KFMY5hDLlxtxNlL9mzGh/1TLkoe/xx2KkmFb5taAyrOtSOaCuRutrHc7G0+aaePmLshfT5XlEt6jBaWCx+8cEA==")
			                .header("Accept","application/json")
			                .POST(HttpRequest.BodyPublishers.ofString(request.body()))
			                .build();
			        HttpResponse<String> resp = client.send(req,
			                HttpResponse.BodyHandlers.ofString());
			                
			        String s = resp.body();
					String[] splitted = s.split(",");
					returnVal = splitted[9].split("}");
					System.out.println(returnVal[0]);
			}catch(Exception e) {
			
				System.out.println("SPARK senhaForca: Não foi possível efetuar o request");			
				returnVal = new String[0];
				returnVal[0] = "500 INTERNAL ERROR";
			}
			JSONObject jo = new JSONObject("{" + returnVal[0].replace("Scored Labels", "score") + "}");
			System.out.println(jo);
		        return jo;
		});

		post("/adicionaCard", (request, response) -> {
			JSONObject jo = new JSONObject(request.body());
			int id = 0;
			String titulo = jo.getString("titulo");
			String categoria = jo.getString("categoria");
			String url = jo.getString("url");
			String imagem = jo.getString("img");
			String resumo = jo.getString("resumo");
			String texto = jo.getString("texto");
			boolean resp = false;
			try {
				DAO dao = new DAO();
				dao.conectar();
				resp = dao.adicionaCard(new Card(id, titulo, categoria, url, imagem, resumo, texto));
				dao.close();
				response.status(200);
				System.out.println("SPARK /adicionarCard - Card adicionado com sucesso ");
			} catch (NullPointerException eNull) {
				System.out.println(
						"SPARK /adicionarCard - Ocorreu um erro na conexão com o banco de dados. Verifique se o mesmo está ativo e tente novamente.");
				response.status(500);
				response.redirect("error500.html");
			} catch (Exception e) {
				System.out.println("SPARK /adicionarCard - O erro ocorreu no cliente por razões desconhecidas");
				response.status(400);
				response.redirect("error400.html");
			}
			return resp;
		});

		get("/apagarCard", (request, response) -> {
			DAO dao = new DAO();
			dao.conectar();
			int id = Integer.parseInt(request.queryParams("id"));
			// System.out.println(id);
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			dao.excluirCard(id);
			dao.close();
			System.out.println("Excluido com sucesso = " + id);
			return "200 OK";
		});

		get("/listarCards", (request, response) -> {

			DAO dao = new DAO();
			dao.conectar();
			Card[] cards = dao.getCards();
			dao.close();
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");

			JSONObject jo = new JSONObject();
			jo.put("Cards", cards);

			return jo.toString();

		});

		get("/selecao", (request, response) -> {

			DAO dao = new DAO();
			dao.conectar();
			String categoria = request.queryParams("categoria");
			// System.out.println(categoria);

			Card[] cards = dao.getCardsPorCategoria(categoria);

			JSONObject jo = new JSONObject(cards);

			jo.put("Cards", cards);
			// System.out.println(jo);

			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");

			return jo.toString();

		});

		post("/adicionarUsuario", (request, response) -> {
			System.out.println(request.body());
			JSONObject jo = new JSONObject(request.body());
			String nome = jo.getString("nome");
			String email = jo.getString("email");
			String senha = jo.getString("senha");
			String login = jo.getString("login");
			boolean resp = false;
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			try {
				DAOUs dao = new DAOUs();
				dao.conectar();
				dao.adicionarUsuario(new Usuario(nome, login, senha, email));
				dao.close();
				response.status(200);
			} catch (NullPointerException eNull) {
				System.out.println(
						"SPARK /adicionarUsuario - Conexão com o banco não foi iniciada. Por favor cheque se o banco de dados está ativo.");
				response.status(500);
				// TODO redirect to server error.
				response.redirect("/error500.html");
			} catch (Exception e) {
				System.out.println("SPARK /adicionarUsuario - O erro ocorreu no cliente por razões desconhecidas");
				response.status(400);
				response.redirect("/error400.html");
			}
			return resp;
		});

		post("/verificarUsuarioLogin", (request, response) -> {
			DAOUs dao = new DAOUs();
			dao.conectar();
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			// System.out.println(request.body());
			JSONObject jo = new JSONObject(request.body());
			String login = jo.getString("login");
			String senha = jo.getString("senha");
			boolean resp = dao.verificarUsuarioLogin(senha, login);
			// System.out.println("resp " + resp);
			dao.close();
			return resp;

		});

		post("/salvarSenha", (request, response) -> {

			DAOSenha dao = new DAOSenha();
			JSONObject jo = new JSONObject(request.body());
			// System.out.println(jo);
			int id = 0;
			String site = jo.getString("endereco");
			String senha = jo.getString("senha");
			String login = jo.getString("login");
			String usuario = jo.getString("usuario");
			Senha csenha = new Senha(id, login, usuario, site, senha);

			dao.conectar();
			boolean resp = dao.adicionaSenha(csenha);
			dao.close();
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			return resp;

		});

		get("exibeSenhas", (request, response) -> {

			String usuario = request.queryParams("usuario");
			DAOSenha dao = new DAOSenha();
			dao.conectar();
			Senha[] cofre = dao.getSenhas(usuario);
			dao.close();
			JSONObject jo = new JSONObject();
			jo.put("senhas", cofre);
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			// System.out.println(jo);
			return jo;

		});

		post("apagaSenha", (request, response) -> {
			// System.out.println("aaaaaaaa" + request.body());
			JSONObject jo = new JSONObject(request.body());
			int id = jo.getInt("id");

			DAOSenha dao = new DAOSenha();
			dao.conectar();
			boolean resp = dao.excluirSenha(id);
			dao.close();
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			return resp;

		});

		post("/adicionarFavorito", (request, response) -> {
			System.out.println("SPARK /adicionarFavorito - Corpo do Request: " + request.body());
			JSONObject jo = new JSONObject(request.body());
			String login = jo.getString("usuario");
			System.out.println(login);
			int id = jo.getInt("card");
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			boolean resp = false;
			try {
				DAOFav dao = new DAOFav();
				dao.conectar();
				resp = dao.adicionaFav(new Favoritos(id, login));
				dao.close();
				response.status(200);
			} catch (NullPointerException eNull) {
				System.out.println(
						"SPARK /adicionarUsuario - Conexão com o banco não foi iniciada. Por favor cheque se o banco de dados está ativo.");
				response.status(500);
				// TODO redirect to server error.
				// response.redirect("/error500.html");
			} catch (Exception e) {
				// System.out.println("SPARK /adicionarUsuario - O erro ocorreu no cliente por
				// razões desconhecidas");
				throw new Exception(e);
				// response.status(400);
				// response.redirect("/error400.html");
			}
			return resp;
		});

		get("/listarFavoritos", (request, response) -> {

			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			JSONObject jo = new JSONObject();
			try {
				DAOFav dao = new DAOFav();
				dao.conectar();
				String login = request.queryParams("login");

				// System.out.println("login = " + login);
				Card[] favoritos = dao.listaFav(login);

				jo.put("Favoritos", favoritos);
				dao.close();
				response.status(200);
			} catch (NullPointerException eNull) {
				System.out.println(
						"SPARK /adicionarUsuario - Conexão com o banco não foi iniciada. Por favor cheque se o banco de dados está ativo.");
				response.status(500);
				// TODO redirect to server error.
				response.redirect("/error500.html");
			} catch (Exception e) {
				System.out.println("SPARK /adicionarUsuario - O erro ocorreu no cliente por razões desconhecidas");
				response.status(400);
				response.redirect("/error400.html");
			}

			return jo;
		});

		post("/removerFavorito", (request, response) -> {
			System.out.println("SPARK /removerFavorito - Corpo do Request: " + request.body());
			JSONObject jo = new JSONObject(request.body());
			String login = jo.getString("usuario");
			int id = jo.getInt("id");
			boolean resp = false;
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Methods", "POST,GET");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Max-Age", "86400");
			try {

				DAOFav dao = new DAOFav();
				dao.conectar();
				resp = dao.removeFav(id, login);
				dao.close();
				response.status(200);
			} catch (NullPointerException eNull) {
				System.out.println(
						"SPARK /adicionarUsuario - Conexão com o banco não foi iniciada. Por favor cheque se o banco de dados está ativo.");
				response.status(500);
				// TODO redirect to server error.
				response.redirect("/error500.html");
			} catch (Exception e) {
				System.out.println("SPARK /adicionarUsuario - O erro ocorreu no cliente por razões desconhecidas");
				response.status(400);
				response.redirect("/error400.html");
			}
			return resp;
		});
	}

}
