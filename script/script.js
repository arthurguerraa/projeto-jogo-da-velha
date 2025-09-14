// Factory Function para criar jogadores
    const Jogador = (nome, simbolo) => {
      return { nome, simbolo };
    };

    // Módulo Tabuleiro (Module Pattern)
    const Tabuleiro = (() => {
      let casas = ["", "", "", "", "", "", "", "", ""];

      const getCasas = () => casas;
      const marcarCasa = (indice, simbolo) => {
        if (casas[indice] === "") {
          casas[indice] = simbolo;
          return true;
        }
        return false;
      };
      const resetar = () => {
        casas = ["", "", "", "", "", "", "", "", ""];
      };

      return { getCasas, marcarCasa, resetar };
    })();

    // Módulo Controlador do Jogo
    const ControladorJogo = (() => {
      const jogador1 = Jogador("Jogador 1", "X");
      const jogador2 = Jogador("Jogador 2", "O");
      let jogadorAtual = jogador1;
      let fimDeJogo = false;

      const trocarJogador = () => {
        jogadorAtual = jogadorAtual === jogador1 ? jogador2 : jogador1;
      };

      const verificarVencedor = () => {
        const casas = Tabuleiro.getCasas();
        const combinacoes = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
        ];

        for (let combinacao of combinacoes) {
          const [a, b, c] = combinacao;
          if (casas[a] && casas[a] === casas[b] && casas[a] === casas[c]) {
            return casas[a];
          }
        }

        if (!casas.includes("")) return "Empate";

        return null;
      };

      const jogar = (indice) => {
        if (fimDeJogo) return;

        if (Tabuleiro.marcarCasa(indice, jogadorAtual.simbolo)) {
          const vencedor = verificarVencedor();
          if (vencedor) {
            fimDeJogo = true;
            if (vencedor === "Empate") {
              Exibir.mostrarMensagem("Empate!");
            } else {
              Exibir.mostrarMensagem(`${jogadorAtual.nome} venceu!`);
            }
          } else {
            trocarJogador();
            Exibir.mostrarMensagem(`Vez de ${jogadorAtual.nome}`);
          }
          Exibir.atualizarTabuleiro();
        }
      };

      const reiniciar = () => {
        Tabuleiro.resetar();
        jogadorAtual = jogador1;
        fimDeJogo = false;
        Exibir.atualizarTabuleiro();
        Exibir.mostrarMensagem(`Vez de ${jogadorAtual.nome}`);
      };

      return { jogar, reiniciar };
    })();

    // Módulo Exibir (para DOM)
    const Exibir = (() => {
      const tabuleiroDiv = document.querySelector(".tabuleiro");
      const mensagemDiv = document.querySelector(".mensagem");
      const botaoReiniciar = document.querySelector("#reiniciar");

      const atualizarTabuleiro = () => {
        tabuleiroDiv.innerHTML = "";
        Tabuleiro.getCasas().forEach((valor, indice) => {
          const casa = document.createElement("div");
          casa.classList.add("casa");
          casa.textContent = valor;
          casa.addEventListener("click", () => ControladorJogo.jogar(indice));
          tabuleiroDiv.appendChild(casa);
        });
      };

      const mostrarMensagem = (msg) => {
        mensagemDiv.textContent = msg;
      };

      botaoReiniciar.addEventListener("click", ControladorJogo.reiniciar);

      return { atualizarTabuleiro, mostrarMensagem };
    })();

    // Inicializar o jogo
    Exibir.atualizarTabuleiro();
    Exibir.mostrarMensagem("Vez de Jogador 1");