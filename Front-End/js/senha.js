(function (doc) {
	var passwordInput = doc.getElementById("password-box"),
		timeDiv = doc.getElementById("password-time"),
		checksList = doc.getElementById("password-checks");
	var passwordplain;

	// Código para renderizar o tempo retornado pelo HSIMP
	var renderTime = function (time, input) {
		timeDiv.innerHTML = time || "";
	};

	// Código para emitir as verificações retornadas pelo HSIMP
	var renderChecks = function (checks, input) {
		checksList.innerHTML = "";

		for (var i = 0, l = checks.length; i < l; i++) {
			var li = doc.createElement("li"),
				title = doc.createElement("h2"),
				message = doc.createElement("p");
			title.innerHTML = checks[i].name;
			li.appendChild(title);
			message.innerHTML = checks[i].message;
			li.appendChild(message);
			checksList.appendChild(li);
		}
	};

	// Configurar o objeto HSIMP
	var attachTo = hsimp({
		options: {
			calculationsPerSecond: 10e9, // 10 bilhões de cálculos por segundo
			good: 31557600e9, // 1 bilhão de anos
			ok: 31557600e3 // 1 mil anos
		},
		outputTime: renderTime,
		outputChecks: renderChecks
	});

	// configurar valores personalizados para "instantaneamente" / "para sempre"
	hsimp.setDictionary({
		"instantly": "Imediatamente",
		"forever": "Aaaaaaaaaaaaaaaanos",
	});
	// Roda o HSIMP
	attachTo(passwordInput);
}(this.document));

var requestTimeout;

var bodyOfPassword = {
	"Inputs": {
		"input1": {
			"ColumnNames": [
				"senha",
				"special character",
				"uppercase",
				">=8",
				"number",
				"strength"
			],
			"Values": [
				[
					"value",
					"0",
					"0",
					"0",
					"0",
					"0"
				]
			]
		}
	},
	"GlobalParameters": {}
};

var helper = 0;

function GetInputPassword(password) {
	let toReturn = [];
	toReturn.push(password);

	let counter = 0;
	helper = 0;
	counter = (/^(?=.*[@#$%^*_&+!=])/g.test(password)) ? 1 : 0;// tem caractere especial;
	toReturn.push(counter);
	helper += counter;
	counter = (/^(?=.*[A-Z])/g.test(password)) ? 1 : 0;// tem caractere especial;
	toReturn.push(counter);
	helper += counter;
	counter = (password.length >= 8) ? 1 : 0;// tem caractere especial;
	toReturn.push(counter);
	helper += counter;
	counter = (/^(?=.*[0-9])/g.test(password)) ? 1 : 0;// tem caractere especial;
	toReturn.push(counter);
	helper += counter;

	// toReturn.push(
	// 	(/^(?=.*[@#$%^*_&+!=])/g.test(password)) ? "1" : "0" // tem caractere especial
	// );
	// toReturn.push(
	// 	(/^(?=.*[A-Z])/g.test(password)) ? "1" : "0" // tem letra maiuscula
	// );
	// toReturn.push(
	// 	(password.length >= 8) ? "1" : "0" // tamanho da length;
	// );
	// toReturn.push(
	// 	(/^(?=.*[0-9])/g.test(password)) ? "1" : "0" // tem numero
	// );

	toReturn.push(0);
	return toReturn;
}

function passwordKeyPress() {
	document.getElementById("iscompromised").innerHTML = '<span style="color: #ff9900;"><img src="img/loading.gif" alt="" width="50" height="50" />&nbsp;Verificando se sua senha já foi comprometida ...</span>';

	var pass = document.getElementById("password-box");
	bodyOfPassword.Inputs.input1.Values[0] = GetInputPassword(pass.value);

	clearTimeout(requestTimeout);
	requestTimeout = setTimeout(passwordmodified, 2000);
	var myinit = {
		method: "POST",
		body: bodyOfPassword
	};

	// console.log("SENHA passwordKeyPress - request ficou: ", myinit)
	let subs = document.getElementById("inputGroup-sizing-default")
	setTimeout(
		fetch('https://studio.azureml.net/apihelp/workspaces/34c27db996a549be84d8289e923d4da0/webservices/e1e6f13c9fa24e2096042c97cf5d55be/endpoints/671ad57505e3484296e0f44c14ab1288/score#requestSummary', myinit)
			.then((resp) => {
				alert(resp);
			}).catch((err) => {
				console.log(helper)
				let print = "Senha Fraca";
				if (helper > 1 && helper < 3)
					print = "Senha Media"
				else if (helper == 4)
					print = "Senha Forte"
				subs.innerHTML = print;
			}), 2000);
}

var passwordInput = document.getElementById("password-box");
var passwordplain = '';
var xhttp;

function passwordmodified() {
	var modifiedpassword = passwordInput.value;
	if (modifiedpassword !== passwordplain) {

		passwordplain = modifiedpassword;

		if (passwordplain !== '') {

			var sha1pass = SHA1(passwordplain);
			sha1pass = sha1pass.toUpperCase();
			var subsha1pass = sha1pass.substring(5);
			if (xhttp) {
				xhttp.abort();
			}
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var xhttpresponse = this.responseText;
					if (xhttpresponse.indexOf(subsha1pass) !== -1) {

						var passlist = xhttpresponse.split("\n");
						var pwnedcount = 0;
						var timespell = 'de';
						for (var i = 0; i < passlist.length; i++) {
							if (subsha1pass == passlist[i].split(":")[0]) {
								pwnedcount = passlist[i].split(":")[1];
								if (passlist[i].split(":")[1] == 1) { timespell = "time"; }
							}
						}

						document.getElementById("iscompromised").innerHTML = '<span style="color: #ff0000;">Essa senha foi encontrada <b>' + pwnedcount + '</b> ' + timespell + ' vezes em bancos de dados de senhas comprometidas! Se essa é sua senha, você deve alterá-la imediatamente. Usar uma senha que foi violada é extremamente perigoso. <br><br><h4>Se você estiver usando essa senha em vários sites, aproveite a oportunidade para começar a usar senhas diferentes para cada site. Invasores podem tirar proveito da reutilização de senha automatizando as tentativas de login em sua conta usando e-mails e pares de senhas violadas.</h4></span>';
					} else {
						document.getElementById("iscompromised").innerHTML = '<span style="color: #339966;">Essa senha nunca foi violada!</span>';
					}
				}
			};

			xhttp.open('GET', 'https://api.pwnedpasswords.com/range/' + sha1pass.substring(0, 5));
			xhttp.send();
		}

	}
}


/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
function SHA1(msg) {
	function rotate_left(n, s) {
		var t4 = (n << s) | (n >>> (32 - s));
		return t4;
	};
	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;
		for (i = 0; i <= 6; i += 2) {
			vh = (val >>> (i * 4 + 4)) & 0x0f;
			vl = (val >>> (i * 4)) & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
	function cvt_hex(val) {
		var str = "";
		var i;
		var v;
		for (i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
	msg = Utf8Encode(msg);
	var msg_len = msg.length;
	var word_array = new Array();
	for (i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
			msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}
	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;
		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;
		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}
	word_array.push(i);
	while ((word_array.length % 16) != 14) word_array.push(0);
	word_array.push(msg_len >>> 29);
	word_array.push((msg_len << 3) & 0x0ffffffff);
	for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
		for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
		for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
		for (i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	}
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
}
