
public class Favoritos {

	private int id_card;
	private String login;
	

	public Favoritos() {

		this.id_card = 0;
		login = "N/D";
	}
	
	public Favoritos(int id_card,String login) {
		
		this.id_card = id_card;
		this.login = login;
	}

	public  void setId_Card(int x) {
		this.id_card = x;

	}
	public int getId_Card() {
			return this.id_card;
	}

	public void setlogin(String x) {
		this.login = x;
	}
	public String getLogin() {
			return this.login;
	}
	
	@Override
	public String toString() {
		return "Favoritos [id_card=" + id_card + ", login=" + login + "]";
	}

}
