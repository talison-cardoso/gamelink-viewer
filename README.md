# 🎮 GameLink Vault

![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyui-58337E?style=flat-square&logo=daisyui&logoColor=white)

GameLink Vault é um renderizador minimalista e performático de links para download de jogos baseado em arquivos JSON externos.

A aplicação não hospeda arquivos, não armazena conteúdo em servidores e funciona 100% no client-side.
Ela apenas consome arquivos JSON públicos e organiza os links de forma estruturada e configurável.

![Local Storage](https://img.shields.io/badge/Data-Local_Storage-orange?style=flat-square&logo=icloud&logoColor=white)
![I18N](https://img.shields.io/badge/Language-PT--BR%20%7C%20EN%20%7C%20ES-green?style=flat-square&logo=translate&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
![AI-Generated](https://img.shields.io/badge/Generated_by-AI-7433ff?style=flat-square&logo=openai&logoColor=white)
![Google AI Studio](https://img.shields.io/badge/Developed_via-Google_AI_Studio-4285F4?style=flat-square&logo=google-gemini&logoColor=white)

## ⚠️ Aviso Legal (Disclaimer)

Este projeto é estritamente um renderizador de dados.

- Não hospedamos arquivos, jogos ou links em servidores próprios.
- O aplicativo apenas formata e exibe informações contidas em arquivos JSON fornecidos manualmente pelo usuário.
- A responsabilidade pelo conteúdo dos links é inteiramente da fonte original e do usuário que a adicionou.

## ✨ Funcionalidades

- ⚡ Performance Extrema: Renderização otimizada com carregamento progressivo (Load More) para evitar travamentos de interface.
- 📂 Gestão de Fontes: Adicione múltiplas URLs JSON. O aplicativo faz o fetch dos dados e salva as fontes no seu navegador (LocalStorage).
- 🌐 Modo "All Sources": Visualize todos os jogos de todas as suas fontes em uma única lista, com tags coloridas identificando a origem.
- 🛠️ Customização Total:
  - Temas: Suporte completo aos temas do daisyUI (Light, Dark, Cupcake, Cyberpunk, etc).
  - Layout Adaptável: Escolha entre visualização em 1, 2 ou 3 colunas (ideal para monitores Wide-screen).
  - Controle de Renderização: Defina quantos itens carregar por vez ou renderize tudo de uma vez.

* 🔗 Detecção de Mirrors: Identificação automática de ícones e nomes para mirrors populares (Torrent, Gofile, Buzzheavier, etc).
* 🌍 Multi-idioma: Interface disponível em Português, Inglês e Espanhol.

## 📋 Formato do JSON Suportado

Para que o renderizador funcione corretamente, o arquivo JSON deve seguir esta estrutura:

```json
{
  "name": "Nome da source",
  "downloads": [
    {
      "title": "Game Title (v1.0.0)",
      "uploadDate": "2026-02-26T16:14:10+00:00",
      "fileSize": "8.3 GB",
      "uris": ["https://example1.com/file", "https://example2.com/file"]
    }
  ]
}
```

## 🚀 Como Usar

1. No icone de engrenagem > Mirrors, insira a URL direta do seu arquivo .json.

> A source será salvo automaticamente no localStorage.

## ⚡ Performance

Para evitar travamentos ao renderizar listas grandes:

1. A aplicação usa renderização incremental.
2. Apenas uma quantidade limitada de itens é exibida por vez. É possível renderizar todos os itens manualmente caso desejado.

> Ainda que a renderização seja incremental, a busca é realizada considerando **todos** os itens da lista.

## 🔧 Instalação (Desenvolvimento)

Se desejar rodar/modificar o projeto localmente:

```sh
git clone https://github.com/talison-cardoso/gamelink-viewer.git
cd gamelink-viewer
npm install
npm run dev
```
