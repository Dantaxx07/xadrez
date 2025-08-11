# ♟️ Xadrez Online - 2 Jogadores

Este é um jogo de xadrez online desenvolvido com React e Tailwind CSS, otimizado para dois jogadores. O tabuleiro possui um design assimétrico único e as peças brancas foram aprimoradas com efeitos visuais premium.

## ✨ Funcionalidades

- **Modo 2 Jogadores:** Jogue contra um amigo no mesmo dispositivo.
- **Layout Assimétrico:** Tabuleiro com bordas e cantos únicos, além de uma rotação sutil para um visual moderno.
- **Peças Brancas Premium:** Design aprimorado com gradientes metálicos, brilhos e efeitos interativos.
- **Responsivo:** Otimizado para funcionar perfeitamente em dispositivos móveis, tablets e desktops.
- **Controles Essenciais:** Botões para iniciar um novo jogo e desfazer o último movimento.
- **Status do Jogo:** Exibe o turno atual, peças capturadas e o status do jogo (xeque, xeque-mate, etc.).

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/) (versão 18 ou superior) e o [pnpm](https://pnpm.io/installation) instalados.

### Instalação

1. **Clone este repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd chess-game-fixed
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

### Execução

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

O jogo estará disponível em `http://localhost:5173/` (ou outra porta, se 5173 estiver em uso).

### Build para Produção

Para gerar uma versão otimizada para produção:

```bash
pnpm run build
```

Os arquivos de build serão gerados na pasta `dist/`.

## 📄 Estrutura do Projeto

```
chess-game-fixed/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ChessBoard.jsx
│   │   ├── ChessSquare.jsx
│   │   ├── GameControls.jsx
│   │   ├── GameStatus.jsx
│   │   └── ui/ (componentes de UI como botões, etc.)
│   ├── hooks/
│   │   └── use-mobile.js
│   ├── lib/
│   │   ├── chessLogic.js
│   │   └── utils.js
│   └── main.jsx
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── README.md
├── TESTE_LAYOUT_RESULTADOS.md
├── MELHORIAS_IA.md
├── DELAY_ZERO.md
└── SEM_IA.md
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📜 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. (Nota: O arquivo LICENSE não está incluído neste ZIP, mas é uma boa prática adicioná-lo em um repositório real.)


