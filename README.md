# 💬 ZapLead Pro

[![Demo ao vivo](https://img.shields.io/badge/Demo-Acessar%20App-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://zaplead-pro.vercel.app)
[![Documentação](https://img.shields.io/badge/Docs-Ver%20Documentação-0d0f12?style=for-the-badge&logo=gitbook&logoColor=white)](https://zaplead-pro.vercel.app/docs.html)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](LICENSE)
[![Feito com React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

Gerador de campanhas do WhatsApp desenvolvido com **React 19** + **Vite** e escrito em **TypeScript**. Facilita o envio de mensagens personalizadas para uma lista de leads — sem automação total, sem risco de ban, em conformidade com a LGPD.

> **💡 Dica de Ouro:** Instale o **WhatsApp Desktop** nativo (Microsoft Store ou Mac App Store). As conversas abrirão na mesma janela, sem o navegador criar centenas de abas por campanha.

---

## ✅ Funcionalidades

- **Importação dupla:** texto colado ou arquivo `.CSV` com drag-and-drop
- **IA integrada:** prompt pré-pronto para extrair contatos de fotos via Gemini, ChatGPT, DeepSeek, Copilot ou Grok
- **Tabela progressiva:** lista paginada com checkbox de progresso por lead
- **Variáveis dinâmicas:** `{Nome}` e `{Corretor}` substituídos automaticamente em cada mensagem
- **100% local:** tudo processado no navegador via `localStorage` — nenhum dado sai do seu computador
- **Tema claro/escuro:** preferência salva entre sessões

---

## 🚀 Como rodar localmente

```bash
# Com npm
npm install
npm run dev

# Com bun (mais rápido!)
bun install
bun run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev/) | Interface reativa com Hooks |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática completa |
| [Vite](https://vitejs.dev/) | Build e dev server ultrarrápido |
| [Papa Parse](https://www.papaparse.com/) | Parser de arquivos CSV |
| [Lucide React](https://lucide.dev/) | Ícones SVG acessíveis |

---

## 📁 Estrutura do projeto

```
zaplead-pro/
├── src/
│   ├── App.tsx               # Raiz da aplicação — estado global, layout
│   ├── index.css             # Design system — variáveis, componentes
│   ├── main.tsx              # Entry point React
│   └── components/
│       ├── SettingsPanel.tsx  # Nome do corretor + template de mensagem
│       ├── Uploader.tsx       # Upload CSV, texto e integração com IAs
│       └── ContactsTable.tsx  # Tabela paginada + geração de links wa.me
├── public/
│   └── docs.html             # Documentação técnica (SPA)
└── exemplo_contatos.csv      # Arquivo de exemplo para testes
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Use, modifique e distribua livremente — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Criado por [Max Roslaniec](https://github.com/max-roslaniec) · Projeto open-source para estudo e uso profissional.
