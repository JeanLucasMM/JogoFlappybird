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




// Agora, carregue a imagem da moeda no evento onload
imagemMoeda = new Image();
imagemMoeda.src = "assets/moeda.jpg"; // Substitua "assets/moeda.png" pelo caminho real da sua imagem de moeda
imagemMoeda.onload = function () {
    // Inicia o loop de atualização do jogo usando requestAnimationFrame
    requestAnimationFrame(atualizar);

    // Gera novas moedas a cada 2 segundos usando setInterval
    setInterval(gerarMoedas, 2000);
};

function gerarMoedas() {
    // Verifica se o jogo está encerrado antes de gerar novas moedas
    if (jogoEncerrado || !imagemMoeda.complete) {
        return;
    }

    // Gera uma posição aleatória para a moeda
    let posicaoXMoeda = larguraTabuleiro;
    let posicaoYMoeda = Math.random() * (alturaTabuleiro - alturaMoeda);

    // Cria um objeto representando a moeda
    let moeda = {
        imagem: imagemMoeda, // Imagem da moeda
        x: posicaoXMoeda, // Posição inicial da moeda no eixo X
        y: posicaoYMoeda, // Posição inicial da moeda no eixo Y
        largura: larguraMoeda, // Largura da moeda
        altura: alturaMoeda // Altura da moeda
    };

    // Adiciona a moeda ao array de moedas
    arrayMoedas.push(moeda);
}

function desenharMoedas() {
    for (let i = 0; i < arrayMoedas.length; i++) {
        let moeda = arrayMoedas[i];

        // Move a moeda para a esquerda com base na velocidadeX
        moeda.x += velocidadeX;

        // Desenha a moeda no contexto do tabuleiro
        contexto.drawImage(moeda.imagem, moeda.x, moeda.y, moeda.largura, moeda.altura);

        // Verifica se há colisão entre o pássaro e a moeda
        if (detectarColisao(passaro, moeda)) {
            // Remove a moeda do array ao colidir com o pássaro
            arrayMoedas.splice(i, 1);
            
            // Adiciona pontuação ou moedas ao jogador, conforme necessário
            totalMoedas += 10; // ou adicione o valor desejado
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





// Aguarda até que a página HTML seja totalmente carregada antes de executar o código
window.onload = function () {
    // Obtém a referência do elemento do tabuleiro no HTML usando o ID "tabuleiro"
    tabuleiro = document.getElementById("tabuleiro");

    // Define a altura e largura do tabuleiro com base nas variáveis predefinidas
    tabuleiro.height = alturaTabuleiro;
    tabuleiro.width = larguraTabuleiro;

    // Obtém o contexto de desenho 2D do tabuleiro
    contexto = tabuleiro.getContext("2d"); // Usado para desenhar no tabuleiro

    // Desenha a imagem do pássaro no tabuleiro quando ela é carregada
    imagemPassaro = new Image(); //Construtor padrão para criar objetos de imagem
    imagemPassaro.src = "assets/flappybird.png"; //Define o PNG da imagem
    imagemPassaro.onload = function () {
        contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);
    }

    let btnReiniciar = document.getElementById("btnReiniciar");
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", reiniciarJogo);
    }

    // Carrega a imagem do cano superior
    imagemCanoSuperior = new Image();
    imagemCanoSuperior.src = "assets/cano-alto.png";

    // Carrega a imagem do cano inferior
    imagemCanoInferior = new Image();
    imagemCanoInferior.src = "assets/cano-baixo.png";

    // Inicia o loop de atualização do jogo usando requestAnimationFrame
    requestAnimationFrame(atualizar);

    // Gera novos canos a cada 1.5 segundos usando setInterval
    setInterval(gerarCanos, 1500);

    // Adiciona um ouvinte de evento para responder às teclas pressionadas
    document.addEventListener("keydown", moverPassaro);

    carregarMoedas();

}

function moverPassaro(evento) {
    // Verifica se a tecla pressionada é a barra de espaço, seta para cima ou tecla X
    if (evento.code == "Space" || evento.code == "ArrowUp" || evento.code == "KeyX") {
        // Ajusta a velocidade vertical para simular um salto
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



let quantidadeDinheiroInserido = 0; // Adicione esta variável para rastrear a quantidade de dinheiro inserido
function reiniciarJogo() {
    // Reinicia variáveis do jogo
    document.getElementById("btnReiniciar").style.display = "none";

    jogoEncerrado = false;
    pontuacao = 0;
    aposta = 0;

    ajustarDificuldade();
    verificarMetaClicado = false;

    // Reinicia a posição do pássaro
    passaro.x = posicaoXPassaro;
    passaro.y = posicaoYPassaro;

    // Limpa o array de canos
    arrayCanos = [];

    // Esconde a tela de game over
    document.getElementById("telaGameOver").style.display = "none";

    // Reinicia o loop de atualização do jogo usando requestAnimationFrame
    requestAnimationFrame(atualizar);
    // Atualiza a contagem total de moedas
    totalMoedasGlobal += totalMoedas;

    // Salva as moedas antes de reiniciar o jogo
    salvarMoedas();

    // Atualiza a contagem de moedas
    renderizarContagemMoedas();
    document.getElementById("btnReiniciar").addEventListener("click", reiniciarJogo);

    jogoIniciado = false;
}
function ajustarDificuldade() {
    // Ajusta a velocidade com base na quantidade de dinheiro inserido
    if (quantidadeDinheiroInserido > 30) {
        velocidadeX = -2.5; // ou ajuste conforme necessário
    } else {
        velocidadeX = -1.5; // ou ajuste conforme necessário
    }

    // Ajusta o atraso do pulo/voo com base na quantidade de dinheiro inserido
    if (quantidadeDinheiroInserido > 60) {
        // Adicione um delay maior para tornar o jogo mais difícil
        // Exemplo: aumenta a velocidade vertical do pássaro (atraso no pulo)
        velocidadeY = -4.5; // ou ajuste conforme necessário
    } else {
        velocidadeY = -5; // Valor padrão
    }
}
let metaPontuacao = 10;

function fazerAposta() {
    // Verifica se o jogo já foi iniciado
    if (jogoIniciado) {
        alert("O jogo já foi iniciado. Você não pode fazer uma nova aposta.");
        return;
    }

    // Obtém a aposta do usuário através de um prompt ou algum outro meio de entrada
    let novaAposta = prompt("Duvido você chegar a " + metaPontuacao + " de pontuação. Quer apostar? Digite a quantidade de moedas que deseja apostar:");

    // Valida se a entrada é um número e se o jogador tem moedas suficientes para apostar
    if (!isNaN(novaAposta) && novaAposta <= totalMoedas) {
        aposta = parseInt(novaAposta);
        totalMoedas -= aposta; // Deduz a aposta do total de moedas do jogador
        renderizarContagemMoedas(); // Atualiza a exibição da contagem de moedas
        ajustarDificuldade(); // Ajusta a dificuldade com base na nova aposta
        jogoIniciado = true; // Marca que o jogo foi iniciado
        alert("Agora inicie o jogo para validar sua aposta.");
    } else {
        alert("Aposta inválida. Certifique-se de digitar um número e ter moedas suficientes.");
    }
}

// Adicione uma função para atualizar a quantidade de dinheiro inserido
function atualizarQuantidadeDinheiro(valor) {
    quantidadeDinheiroInserido += valor;
}



function atualizar() {
    // Solicita ao navegador que chame novamente a função atualizar na próxima renderização
    requestAnimationFrame(atualizar);
    if (jogoEncerrado) {
        contexto.fillStyle = "white";
        contexto.font = "30px sans-serif";
        contexto.fillText("FIM DE JOGO", 80, alturaTabuleiro / 2 - 30);
        contexto.fillText("Pontuação: " + pontuacao, 100, alturaTabuleiro / 2 + 20);
        renderizarContagemMoedas();
        
        // Adicione o total de moedas ao totalMoedasGlobal
        totalMoedasGlobal += totalMoedas;
    
        // Salva as moedas antes de reiniciar o jogo
        salvarMoedas();
    
        // Mostra o botão de reinício
        document.getElementById("btnReiniciar").style.display = "block";
    
        return;
    }

    

    
    // Limpa a área do tabuleiro para desenhar a próxima moldura
    contexto.clearRect(0, 0, tabuleiro.width, tabuleiro.height);
    
    // Pássaro
    // Aumenta a velocidade vertical do pássaro aplicando a força da gravidade
    velocidadeY += gravidade;
    
    // Atualiza a posição vertical do pássaro com base na velocidade
    passaro.y = Math.max(passaro.y + velocidadeY, 0); // Aplica a gravidade à posição Y atual do pássaro, limitando a posição Y ao topo do canvas
    
    // Desenha a imagem do pássaro na nova posição
    contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);
    
    // Itera sobre os canos presentes no arrayCanos
    for (let i = 0; i < arrayCanos.length; i++) {
        let cano = arrayCanos[i];
        
        // Move o cano para a esquerda com base na velocidadeX
        cano.x += velocidadeX;
        
        // Desenha o cano no contexto do tabuleiro
        contexto.drawImage(cano.imagem, cano.x, cano.y, cano.largura, cano.altura);
        
        // Verifica se o pássaro passou pelo cano
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
    // Limpa os canos que já passaram da tela
    while (arrayCanos.length > 0 && arrayCanos[0].x < -larguraCano) {
        arrayCanos.shift(); // Remove o primeiro elemento do array de canos
    }

    // Pontuação
    contexto.fillStyle = "white";
    contexto.font = "45px sans-serif";
    contexto.fillText(pontuacao, 5, 45);

}

function gerarCanos() {
    // Verifica se o jogo está encerrado antes de gerar novos canos
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