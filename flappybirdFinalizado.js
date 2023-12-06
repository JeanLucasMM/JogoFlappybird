// Configurações do jogo
let tabuleiro; // Referência ao elemento do tabuleiro no HTML
let larguraTabuleiro = 360; // Largura do tabuleiro em pixels
let alturaTabuleiro = 640; // Altura do tabuleiro em pixels
let contexto; // Contexto de renderização 2D do tabuleiro

// Configurações do pássaro
let larguraPassaro = 34; // Largura do pássaro em pixels
let alturaPassaro = 24; // Altura do pássaro em pixels
let posicaoXPassaro = 45; // Posição inicial do pássaro no eixo X
let posicaoYPassaro = 320; // Posição inicial do pássaro no eixo Y
let imagemPassaro; // Imagem do pássaro a ser carregada

// Objeto representando o pássaro
let passaro = {
    x: posicaoXPassaro, // Posição atual do pássaro no eixo X
    y: posicaoYPassaro, // Posição atual do pássaro no eixo Y
    largura: larguraPassaro, // Largura do pássaro
    altura: alturaPassaro // Altura do pássaro
};

// Configurações dos canos
let arrayCanos = []; // Array para armazenar os canos em cena
let larguraCano = 64; // Largura dos canos em pixels
let alturaCano = 512; // Altura dos canos em pixels
let posicaoXCano = larguraTabuleiro; // Posição inicial dos canos no eixo X
let posicaoYCano = 0; // Posição inicial dos canos no eixo Y

let imagemCanoSuperior; // Imagem do cano superior a ser carregada
let imagemCanoInferior; // Imagem do cano inferior a ser carregada

// Configurações de física
let velocidadeX = -1.5; // Velocidade de movimento dos canos para a esquerda
let velocidadeY = 0; // Velocidade de salto do pássaro
let gravidade = 0.2; // Gravidade aplicada ao pássaro

let jogoEncerrado = false; // Indica se o jogo está encerrado
let pontuacao = 0; // Pontuação do jogador

let aposta = 0;
let jogoIniciado = false;




let arrayMoedas = []; // Array para armazenar as moedas em cena
let larguraMoeda = 30; // Largura da moeda em pixels
let alturaMoeda = 30; // Altura da moeda em pixels
let imagemMoeda; // Imagem da moeda a ser carregada
let totalMoedas = 0;
let totalMoedasGlobal = 0; // Nova variável para manter a contagem total de moedas entre os jogos
let verificarMetaClicado = false; // Nova variável para controlar se o botão de verificar meta já foi clicado




imagemMoeda = new Image();
imagemMoeda.src = "assets/moeda.jpg"; 
imagemMoeda.onload = function () {
    requestAnimationFrame(atualizar);

    setInterval(gerarMoedas, 2000);
};

function gerarMoedas() {
    if (jogoEncerrado || !imagemMoeda.complete) {
        return;
    }

    // Gera uma posição aleatória para a moeda
    let posicaoXMoeda = larguraTabuleiro;
    let posicaoYMoeda = Math.random() * (alturaTabuleiro - alturaMoeda);

    // Cria um objeto representando a moeda
    let moeda = {
        imagem: imagemMoeda, 
        x: posicaoXMoeda, 
        y: posicaoYMoeda, 
        largura: larguraMoeda,
        altura: alturaMoeda 
    };

    // Adiciona a moeda ao array de moedas
    arrayMoedas.push(moeda);
}

function desenharMoedas() {
    for (let i = 0; i < arrayMoedas.length; i++) {
        let moeda = arrayMoedas[i];

        moeda.x += velocidadeX;

        contexto.drawImage(moeda.imagem, moeda.x, moeda.y, moeda.largura, moeda.altura);

        if (detectarColisao(passaro, moeda)) {
            arrayMoedas.splice(i, 1);
            
            totalMoedas += 10; 
        }
    }
}
function salvarMoedas() {
    localStorage.setItem("moedas", totalMoedasGlobal);
}

// Função para carregar as moedas do armazenamento local
function carregarMoedas() {
    const moedasSalvas = localStorage.getItem("moedas");
    totalMoedasGlobal = moedasSalvas ? parseInt(moedasSalvas) : 0;
}

function renderizarContagemMoedas() {
    contexto.fillStyle = "white";
    contexto.font = "20px sans-serif";
    contexto.fillText("Moedas: " + totalMoedas, larguraTabuleiro - 120, 30);
}





window.onload = function () {
    tabuleiro = document.getElementById("tabuleiro");

    tabuleiro.height = alturaTabuleiro;
    tabuleiro.width = larguraTabuleiro;

    contexto = tabuleiro.getContext("2d"); 

    imagemPassaro = new Image(); 
    imagemPassaro.src = "assets/flappybird.png"; 
    imagemPassaro.onload = function () {
        contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);
    }

    let btnReiniciar = document.getElementById("btnReiniciar");
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", reiniciarJogo);
    }

    imagemCanoSuperior = new Image();
    imagemCanoSuperior.src = "assets/cano-alto.png";

    imagemCanoInferior = new Image();
    imagemCanoInferior.src = "assets/cano-baixo.png";

    requestAnimationFrame(atualizar);

    setInterval(gerarCanos, 1500);

    document.addEventListener("keydown", moverPassaro);

    carregarMoedas();

}

function moverPassaro(evento) {
    if (evento.code == "Space" || evento.code == "ArrowUp" || evento.code == "KeyX") {
        velocidadeY = -5;

    }
}
function verificarMeta() {
    if (!jogoIniciado) {
        alert("Inicie o jogo antes de verificar a meta.");
        return;
    }

    if (verificarMetaClicado) {
        alert("A meta já foi verificada. Inicie um novo jogo para verificar novamente.");
        return;
    }

    verificarMetaClicado = true;

    if (pontuacao >= metaPontuacao) {
        totalMoedasGlobal += aposta * 2;
        alert("Parabéns! Você atingiu ou ultrapassou a meta. Ganhou o dobro da aposta!");
    } else {
        totalMoedasGlobal -= aposta;
        alert("Você não atingiu a meta. Perdeu a aposta.");
    }
}



let quantidadeDinheiroInserido = 0; 
function reiniciarJogo() {
    // Reinicia variáveis do jogo
    document.getElementById("btnReiniciar").style.display = "none";

    jogoEncerrado = false;
    pontuacao = 0;
    aposta = 0;

    ajustarDificuldade();
    verificarMetaClicado = false;

    passaro.x = posicaoXPassaro;
    passaro.y = posicaoYPassaro;

    arrayCanos = [];

    document.getElementById("telaGameOver").style.display = "none";

    requestAnimationFrame(atualizar);
    totalMoedasGlobal += totalMoedas;

    salvarMoedas();

    renderizarContagemMoedas();
    document.getElementById("btnReiniciar").addEventListener("click", reiniciarJogo);

    jogoIniciado = false;
}
function ajustarDificuldade() {
    if (quantidadeDinheiroInserido > 30) {
        velocidadeX = -2.5; 
    } else {
        velocidadeX = -1.5; 
    }

    if (quantidadeDinheiroInserido > 60) {
        velocidadeY = -4.5; 
    } else {
        velocidadeY = -5; 
    }
}
let metaPontuacao = 10;

function fazerAposta() {
    if (jogoIniciado) {
        alert("O jogo já foi iniciado. Você não pode fazer uma nova aposta.");
        return;
    }

    let novaAposta = prompt("Duvido você chegar a " + metaPontuacao + " de pontuação. Quer apostar? Digite a quantidade de moedas que deseja apostar:");

    if (!isNaN(novaAposta) && novaAposta <= totalMoedas) {
        aposta = parseInt(novaAposta);
        totalMoedas -= aposta; 
        renderizarContagemMoedas(); 
        ajustarDificuldade(); 
        jogoIniciado = true; 
        alert("Agora inicie o jogo para validar sua aposta.");
    } else {
        alert("Aposta inválida. Certifique-se de digitar um número e ter moedas suficientes.");
    }
}

function atualizarQuantidadeDinheiro(valor) {
    quantidadeDinheiroInserido += valor;
}



function atualizar() {
    requestAnimationFrame(atualizar);
    if (jogoEncerrado) {
        contexto.fillStyle = "white";
        contexto.font = "30px sans-serif";
        contexto.fillText("FIM DE JOGO", 80, alturaTabuleiro / 2 - 30);
        contexto.fillText("Pontuação: " + pontuacao, 100, alturaTabuleiro / 2 + 20);
        renderizarContagemMoedas();
        
        totalMoedasGlobal += totalMoedas;
    
        salvarMoedas();
    
        document.getElementById("btnReiniciar").style.display = "block";
    
        return;
    }

    

    
    contexto.clearRect(0, 0, tabuleiro.width, tabuleiro.height);
    
    velocidadeY += gravidade;
    
    passaro.y = Math.max(passaro.y + velocidadeY, 0); 
    
    contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);
    
    for (let i = 0; i < arrayCanos.length; i++) {
        let cano = arrayCanos[i];
        
        cano.x += velocidadeX;
        
        contexto.drawImage(cano.imagem, cano.x, cano.y, cano.largura, cano.altura);
        
        if (!cano.passou && passaro.x > cano.x + cano.largura) {
            pontuacao += 0.5; // Incrementa a pontuação por meio ponto
            cano.passou = true; // Marca que o pássaro já passou por esse cano
        }
        
        // Verifica se há colisão entre o pássaro e o cano
        if (detectarColisao(passaro, cano)) {
            jogoEncerrado = true; // Marca que o jogo está encerrado em caso de colisão
        }
    }
    
    desenharMoedas();
    while (arrayCanos.length > 0 && arrayCanos[0].x < -larguraCano) {
        arrayCanos.shift(); 
    }

    // Pontuação
    contexto.fillStyle = "white";
    contexto.font = "45px sans-serif";
    contexto.fillText(pontuacao, 5, 45);

}

function gerarCanos() {
    if (jogoEncerrado) {
        return;
    }

    // Calcula uma posição Y aleatória para o conjunto de canos
    let posicaoYCanoAleatoria = posicaoYCano - alturaCano / 4 - Math.random() * (alturaCano / 2);
    // Define o espaço de abertura entre os canos como um quarto da altura do tabuleiro
    let espacoAbertura = tabuleiro.height / 4;

    // Cria um objeto representando o cano superior
    let canoSuperior = {
        imagem: imagemCanoSuperior, // Imagem do cano superior
        x: posicaoXCano, // Posição inicial do cano superior no eixo X
        y: posicaoYCanoAleatoria, // Posição inicial do cano superior no eixo Y
        largura: larguraCano, // Largura do cano
        altura: alturaCano, // Altura do cano
        passou: false // Indica se o pássaro já passou por esse cano
    };
    // Adiciona o cano superior ao array de canos
    arrayCanos.push(canoSuperior);

    // Cria um objeto representando o cano inferior
    let canoInferior = {
        imagem: imagemCanoInferior, // Imagem do cano inferior
        x: posicaoXCano, // Posição inicial do cano inferior no eixo X
        y: posicaoYCanoAleatoria + alturaCano + espacoAbertura, // Posição inicial do cano inferior no eixo Y
        largura: larguraCano, // Largura do cano
        altura: alturaCano, // Altura do cano
        passou: false // Indica se o pássaro já passou por esse cano
    };
    // Adiciona o cano inferior ao array de canos
    arrayCanos.push(canoInferior);
}


// Função para detectar colisão entre dois objetos retangulares (objetoA e objetoB)
function detectarColisao(passaro, cano) {
    //verifica se a sobreposição de objetos
    const colisaoX = passaro.x < cano.x + cano.largura && passaro.x + passaro.largura > cano.x;
    const colisaoY = passaro.y < cano.y + cano.altura && passaro.y + passaro.altura > cano.y;

    if (colisaoX && colisaoY) {
        console.log("Colisão detectada")
        return true;
    }

    return false;
}
