import java.sql.*;




public class DAO {
	private Connection conexao;


	public DAO() {
		conexao = null;
	}
	
//jdbc:postgresql://$AZ_DATABASE_NAME.postgres.database.azure.com:5432/demo?ssl=true&sslmode=require
	public boolean conectar() {//heusecbd.postgres.database.azure.com
		String driverName = "org.postgresql.Driver";                    
		String serverName = "heusec.postgres.database.azure.com";
		String azure = "gssEncMode=disable";
		int porta = 5432;
		String url = "jdbc:postgresql://" + serverName +":"+porta + "/postgres?"+azure;
		System.out.println(url);
		String username = "adm_heusec@heusec";
		String password = "@heus2020";
		boolean status = false;

		try {
			Class.forName(driverName);
			conexao = DriverManager.getConnection(url, username, password);
			status = (conexao == null);
			System.out.println("Conexão efetuada com o postgres!");
		} catch (ClassNotFoundException e) { 
			System.err.println("Conexão NÃO efetuada com o postgres -- Driver não encontrado -- " + e.getMessage());
		} catch (SQLException e) {
			System.err.println("Conexão NÃO efetuada com o postgres -- " + e.getMessage());
		}

		return status;
	}
	
	public boolean close() {
		boolean status = false;
		
		try {
			conexao.close();
			status = true;
		} catch (SQLException e) {
			System.err.println(e.getMessage());
		}
		return status;
	}
	
	public boolean adicionaCard(Card card) {
		boolean status = false;
		try {
		Statement st = conexao.createStatement();
		st.executeUpdate("INSERT INTO cards(titulo,categoria,url,imagem,resumo,texto)" + "VALUES ('" + card.getTitulo() 
		 +"','" +  card.getCategoria()+"','" + card.getUrl()+"','" + card.getImagem()+"','" +
		card.getResumo()+"','" + card.getTexto() + "')");
		st.close();
		status = true;
		}catch(SQLException e) {
			throw new RuntimeException(e);
			
		}
		
		
		return status;
	
	}
	public boolean excluirCard(int id) {
		boolean status = false;
		
		try {
			Statement st = conexao.createStatement();
			st.executeUpdate("DELETE FROM cards WHERE id = " + id );
			st.close();
			status = true;
			
		}catch(SQLException e){
			
			throw new RuntimeException(e);
				
		}
		return status;
	}
	
	public Card[] getCards() {
		Card[] cards = null;
		try {
			
			Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery("SELECT * FROM cards");
			if(rs.next()) {
				rs.last();
				cards = new Card[rs.getRow()];
				rs.beforeFirst();
				
				for(int i = 0;rs.next();i++) {
					cards[i] = new Card(rs.getInt("id"),rs.getString("titulo"),rs.getString("categoria"),
					rs.getString("url"),rs.getString("imagem"),rs.getString("resumo"),rs.getString("texto"));
					
					
				}
			}
			st.close();
		}catch(Exception e) {
			
			System.err.println(e.getMessage());
			
			
		}	
		return cards;
	}
	
	public Card[] getCardsPorCategoria(String categoria) {
		Card []cards = null;
		try {
			Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery("SELECT * FROM cards WHERE cards.categoria='" + categoria + "'");
			if(rs.next()) {
				rs.last();
				cards = new Card[rs.getRow()];
				rs.beforeFirst();
				for(int i = 0;rs.next();i++) {
					
					cards[i] = new Card(rs.getInt("id"),rs.getString("titulo"),rs.getString("categoria"),
							rs.getString("url"),rs.getString("imagem"),rs.getString("resumo"),rs.getString("texto"));
					
				}
			}
			st.close();
		}catch(Exception e){
			System.err.println(e.getMessage());
				
		}
		return cards;
	}


}
