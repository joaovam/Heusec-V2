public class Card {
	private int id;
	private String titulo;
	private String categoria;
	private String url;
	private String  imagem;
	private String resumo;
	private String texto;
	
	
	
	public Card() {
		
		
	}
	public Card(int id, String titulo, String categoria, String url, String imagem, String resumo, String texto) {
		this.id = id;
		this.titulo = titulo;
		this.categoria = categoria;
		this.url = url;
		this.imagem = imagem;
		this.resumo = resumo;
		this.texto = texto;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitulo() {
		return titulo;
	}
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}
	public String getCategoria() {
		return categoria;
	}
	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getImagem() {
		return imagem;
	}
	public void setImagem(String imagem) {
		this.imagem = imagem;
	}
	public String getResumo() {
		return resumo;
	}
	public void setResumo(String resumo) {
		this.resumo = resumo;
	}
	public String getTexto() {
		return texto;
	}
	public void setTexto(String texto) {
		this.texto = texto;
	}
	@Override
	public String toString() {
		return "Card [id=" + id + ", titulo=" + titulo + ", categoria=" + categoria + ", url=" + url + ", imagem="
				+ imagem + ", resumo=" + resumo + ", texto=" + texto + "]";
	}
	
	

}
