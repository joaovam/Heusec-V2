public class Senha {

	// Atributos

	private int id;
	private String login;
	private String usuario;
	private String site;
	private String senha;

	// Construtores
	
	public Senha() {

	}

	public Senha(int id, String login, String usuario, String site, String senha) {
		this.id = id;
		this.login = login;
		this.usuario = usuario;
		this.site = site;
		this.senha = senha;
	}

	// Metodos
	
	public void setId(int x) {
		this.id = x;
	}

	public int getId() {
		return this.id;
	}

	public void setLogin(String x) {
		this.login = x;
	}

	public String getLogin() {
		return this.login;
	}

	public void setUsuario(String x) {
		this.usuario = x;
	}

	public String getUsuario() {
		return this.usuario;
	}

	public void setSite(String x) {
		this.site = x;
	}

	public String getSite() {
		return this.site;
	}

	public void setSenha(String x) {
		this.senha = x;
	}

	public String getSenha() {
		return this.senha;
	}

	@Override
	public String toString() {
		return "Senha [id=" + id + ", login=" + login + ", usuario=" + usuario + ", site=" + site + ", senha=" + senha + "]";
	}

}
