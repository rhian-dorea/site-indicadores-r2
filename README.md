# Portal Gerencial de Indicadores

Portal responsivo para acessar relatórios públicos do Power BI. A autenticação usa Supabase Auth com e-mail e senha; o portal não oferece cadastro público.

## Requisitos

- Node.js 20.19 ou superior e npm.
- Projeto Supabase com autenticação por e-mail habilitada.
- Relatórios configurados para incorporação pública no Power BI.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a URL do projeto e a chave pública publishable do Supabase.
3. No painel do Supabase, crie os usuários autorizados ou convide-os. Não há rota de cadastro no portal.
4. Inicie o servidor de desenvolvimento com `npm run dev` e abra o endereço informado pelo Vite.

O arquivo `.env` é local e está ignorado pelo Git. A configuração Vite lê e incorpora ao JavaScript do navegador somente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nunca coloque `sb_secret`, `service_role`, senha de banco ou outra chave secreta nessas variáveis. A chave publishable é pública por definição e não substitui as políticas de acesso do Supabase; configure as políticas e os controles de Auth do seu projeto.

## Configurar relatórios

Edite `src/config/reports.json`:

```json
{
  "categories": ["Financeiro", "Comercial"],
  "reports": [
    {
      "id": "resultado-mensal",
      "name": "Resultado mensal",
      "description": "Acompanhe receita, margem e resultado por período.",
      "category": "Financeiro",
      "url": "https://app.powerbi.com/view?r=SEU_LINK_PUBLICO"
    }
  ]
}
```

Adicione um item por relatório. O catálogo valida que a URL use HTTPS e o domínio `app.powerbi.com` antes de exibi-la. Os relatórios incorporados por link público podem ser acessados por qualquer pessoa que tenha o link; não publique dados confidenciais dessa forma. A lista JSON também fica disponível no pacote do navegador e não deve conter informações secretas.

## Publicar no Railway

1. Envie este repositório para um provedor Git e crie um projeto Railway a partir dele.
2. No serviço, defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` em **Variables** com a URL e a chave publishable do Supabase. Essas variáveis são usadas durante o build.
3. O Railway detecta o projeto Node.js, executa o build por `npm run build` e inicia a aplicação por `npm start`. A aplicação escuta a porta `PORT` fornecida pela plataforma.
4. Gere um domínio público no Railway e adicione o domínio do portal às URLs permitidas de autenticação do Supabase (Site URL e Redirect URLs).
5. Para alterar relatórios ou variáveis de build, faça novo deploy após salvar as alterações.

O servidor Express aplica cabeçalhos de segurança, restringe iframes ao Power BI e expõe `/health` para verificação de disponibilidade.

Referências oficiais: [comandos de build e start do Railway](https://docs.railway.com/builds/build-and-start-commands) e [variáveis de ambiente em aplicações frontend](https://docs.railway.com/guides/frontend-environment-variables).

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` compila o portal e publica `dist/` no GitHub Pages sempre que houver push na branch `main`, ou quando executado manualmente em **Actions**. O Vite usa o caminho base `/site-indicadores-r2/` para o endereço `https://rhian-dorea.github.io/site-indicadores-r2/`.

1. Em **Settings → Secrets and variables → Actions → Variables**, crie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a URL do projeto e a chave publishable do Supabase. O workflow disponibiliza somente essas duas variáveis à etapa de build.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação.
3. Envie as alterações para a branch `main` ou inicie o workflow **Deploy to GitHub Pages** em **Actions**. Após a conclusão, o site estará em `https://rhian-dorea.github.io/site-indicadores-r2/`.
4. No Supabase, adicione esse endereço às URLs permitidas para autenticação (Site URL e Redirect URLs), conforme o fluxo de login do portal.

O build incorpora a URL e a chave publishable no JavaScript entregue ao navegador, pois ambas são públicas. Não cadastre uma chave `Secret` ou `service_role` no GitHub nem no projeto frontend.

## Comandos

- `npm run dev` — desenvolvimento local com Vite.
- `npm run build` — gera a versão de produção em `dist/`.
- `npm start` — serve a versão de produção.

Este projeto é JavaScript/Node.js, portanto não usa ambiente virtual Python (`.venv`). O `.gitignore` cobre `node_modules`, `dist`, ambientes Python eventuais e arquivos de ambiente.
