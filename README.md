# 💬 ZapLead Pro

Gerador de Campanhas do WhatsApp desenvolvido com **React.js** + **Vite** e escrito em **TypeScript**. Este projeto automatiza e facilita o envio de mensagens padronizadas no WhatsApp para uma lista de leads ou contatos, sejam eles inseridos via arquivo ou transcritos de fotos via IA.

> **💡 Dica de Ouro (Workflow Rápido):** Para um uso massivo de envios, instale o aplicativo **WhatsApp Desktop** nativo da sua loja de aplicativos (Microsoft Store ou Mac App Store). Utilizar o aplicativo via Desktop fará com que as conversas abram imediatamente na mesma janela, evitando que o navegador abra centenas de novas guias no WhatsApp Web para cada lead!

## ✅ Funcionalidades

- **Importação Dinâmica:** Aceita inserção direta em modo texto ou uploads de arquivos `.CSV`.
- **Mão na roda com IAs:** Inclui instruções e atalhos embutidos, permitindo que você envie a foto de um papel com contatos para uma IA (DeepSeek, ChatGPT, Gemini, Copilot, Grok) e ela mesmo estruture a lista que o painel irá receber.
- **Tabela Progressiva:** Lista os leads organizadamente em tabela e permite que você cruze ("check") quais clientes já entrou em contato durante a rodada.
- **Variáveis Padronizadas:** Configure a mensagem de campanha trocando `{Nome}` dinamicamente pelo primeiro nome registrado na tabela na hora do envio.
- **Totalmente Local & Seguro:** O projeto armazena e processa todos os estados e a base em lote através do `LocalStorage`. Sem back-ends ou banco de dados na nuvem que comprometam o sigilo da lista de contatos corporativos.
- **Interface Premium e Moderna:** Sistema com tema claro/escuro e grid interativa CSS.

## 🚀 Como rodar localmente

```bash
# Com npm
npm install
npm run dev

# Com bun (mais rápido!)
bun install
bun run dev
```

Acesse a porta retornada no terminal (geralmente [http://localhost:5173](http://localhost:5173))

## 🛠 Tecnologias

- [React.js](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Papa Parse](https://www.papaparse.com/)
- [Lucide Icons](https://lucide.dev/)
