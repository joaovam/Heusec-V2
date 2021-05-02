public class Usuario {

	// Atributos
	
	private String nome;
	private String login;
	private String senha;
	private String email;
	
	// Construtores
	
	public Usuario() {
		nome = "N/D";
		login = "N/D";
		senha = "N/D";
		email= "N/D";
	}
	
	public Usuario(String nome, String login, String senha, String email) {
		this.nome = nome;
		this.login = login;
		this.senha = senha;
		this.email= email;
	}
	
	// Métodos
	
	public void setNome(String x) {
		this.nome = x;
	}
	public String getNome() {
		return this.nome;
	}
	public void setLogin(String x) {
		this.login = x;
	}
	public String getLogin() {
		return this.login;
	}
	public void setSenha(String x) {
		this.senha = x;
	}
	public String getSenha() {
		return this.senha;
	}
	public void setEmail(String x) {
		this.email = x;
	}
	public String getEmail() {
		return this.email;
	}


	@Override
	public String toString() {
		return "Usuario [nome=" + nome + ", login=" + login + ", senha=" + senha + ", email=" + email + ", favoritos="
				+ "]";
	}
}
