import java.sql.*;
import java.security.*;
import java.math.*;


public class DAOUs {
    private Connection conexao;

    public DAOUs() {
        conexao = null;
    }

    // jdbc:postgresql://$AZ_DATABASE_NAME.postgres.database.azure.com:5432/demo?ssl=true&sslmode=require
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

    public boolean adicionarUsuario(Usuario usuario) throws Exception {
        boolean status = false;
        boolean resp = verificarUsuarioDuplicado(usuario);
        usuario.setSenha(criptografarSenhaMD5(usuario.getSenha()));
        if (!resp) {
            try {
                Statement st = conexao.createStatement();
                st.executeUpdate("INSERT INTO usuario(login,nome,senha,email)" + "VALUES ('" + usuario.getLogin()
                        + "','" + usuario.getNome() + "','" + usuario.getSenha() + "','" + usuario.getEmail() + "')");
                st.close();
                status = true;
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } else {
        	System.out.println("Usuario ja existente!");
        }
        
        return status;
    }

    public boolean verificarUsuarioDuplicado(Usuario usuario) {
        boolean status = false;
        String login;
        try {
            Statement st = conexao.createStatement();
            ResultSet rs = st.executeQuery("SELECT login FROM usuario WHERE login ='" + usuario.getLogin() + "'");
            System.out.println(rs.getRow());
            rs.next();
            System.out.println(rs.getRow());
            login = rs.getString("login").replaceAll(" ", "");
            System.out.println(usuario.getLogin());
            if (usuario.getLogin().compareTo(login)==0) {
                status = true;
            } 
            st.close();
        } catch (SQLException e) {
            status = false;
        }

        return status;
    }

    public boolean verificarUsuarioLogin(String senhaPost, String loginPost) throws Exception{
        boolean status = false;
        String login;
        String senha;
        try {
            Statement st = conexao.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM usuario WHERE login ='" + loginPost + "'");
            rs.next();
            System.out.println(rs.getRow());
            login = rs.getString("login");
            login = login.replaceAll(" ", "");
            senha = rs.getString("senha");
            senha = senha.replaceAll(" ", "");
            senhaPost = criptografarSenhaMD5(senhaPost);
            System.out.println("senha: '" + senha + "'");
            System.out.println("senhaPost: '" + senhaPost + "'");
            if (login.compareTo(loginPost) == 0 && senha.compareTo(senhaPost) == 0) {
                status = true;
            }
            st.close();
        } catch (SQLException e) {
        	System.out.println(e);
            status = false;
        }

        return status;
    }

    public String criptografarSenhaMD5(String s) throws Exception {
    	String MD5 = s;
    	try {
    		MessageDigest m = MessageDigest.getInstance("MD5");
            m.update(s.getBytes(),0,s.length());
            MD5 = new BigInteger(1,m.digest()).toString(16);	
    	} catch (Exception e) {
    		throw new Exception("Falha ao criptografar!");
    	}
    	return MD5;
    }

}
