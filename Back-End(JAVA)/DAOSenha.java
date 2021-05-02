import java.sql.*;

public class DAOSenha {
	private Connection conexao;

	public DAOSenha() {
		conexao = null;
	}

//jdbc:postgresql://$AZ_DATABASE_NAME.postgres.database.azure.com:5432/demo?ssl=true&sslmode=require
	public boolean conectar() {// heusecbd.postgres.database.azure.com
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
			System.out.println("Conexao efetuada com o postgres!");
		} catch (ClassNotFoundException e) {
			System.err.println("Conexao NAO efetuada com o postgres -- Driver nao encontrado -- " + e.getMessage());
		} catch (SQLException e) {
			System.err.println("Conexao NAO efetuada com o postgres -- " + e.getMessage());
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

	public boolean adicionaSenha(Senha senha) {
		boolean status = false;
		try {
			Statement st = conexao.createStatement();
			st.executeUpdate("INSERT INTO cofre_senha(usuario, login, site, senha)" + "VALUES ('" + senha.getUsuario()
					+ "','" + senha.getLogin() + "','" + senha.getSite() + "','" + senha.getSenha() + "')");
			st.close();
			status = true;
		} catch (SQLException e) {
			throw new RuntimeException(e);

		}

		return status;

	}

	public boolean excluirSenha(int id) {
		boolean status = false;

		try {
			Statement st = conexao.createStatement();
			st.executeUpdate("DELETE FROM cofre_senha WHERE id = " + id);
			st.close();
			status = true;

		} catch (SQLException e) {

			throw new RuntimeException(e);

		}
		return status;
	}

	public Senha[] getSenhas(String usuario) {
		Senha[] senhas = null;
		try {

			Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery("SELECT * FROM cofre_senha WHERE login = '" + usuario + "'");
			if (rs.next()) {
				rs.last();
				senhas = new Senha[rs.getRow()];
				rs.beforeFirst();

				for (int i = 0; rs.next(); i++) {
					senhas[i] = new Senha(rs.getInt("id"), rs.getString("login"), rs.getString("usuario"), rs.getString("site"),
							rs.getString("senha"));

				}
			}
			st.close();
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}
		
		return senhas;
	}

}
