# Portal Gerencial de Indicadores

Portal responsivo para acessar relatórios públicos do Power BI. A autenticação usa Supabase Auth com e-mail e senha; o portal não oferece cadastro público.

## Requisitos

- Node.js 20.19 ou superior e npm.
- Projeto Supabase com autenticação por e-mail habilitada.
- Relatórios configurados para incorporação pública no Power BI.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com a URL do projeto e a chave pública `anon` (ou publishable) do Supabase.
3. No painel do Supabase, crie os usuários autorizados ou convide-os. Não há rota de cadastro no portal.
4. Inicie o servidor de desenvolvimento com `npm run dev` e abra o endereço informado pelo Vite.

O arquivo `.env` é local e está ignorado pelo Git. As variáveis `VITE_*` são incorporadas ao JavaScript entregue ao navegador; use exclusivamente a chave pública do Supabase. Nunca configure `service_role`, senha de banco ou outra chave secreta nessas variáveis. A chave pública não substitui as políticas de acesso do Supabase; configure as políticas e os controles de Auth do seu projeto.

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
2. No serviço, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Variables** com a URL e a chave pública do Supabase. Essas variáveis são usadas durante o build.
3. O Railway detecta o projeto Node.js, executa o build por `npm run build` e inicia a aplicação por `npm start`. A aplicação escuta a porta `PORT` fornecida pela plataforma.
4. Gere um domínio público no Railway e adicione o domínio do portal às URLs permitidas de autenticação do Supabase (Site URL e Redirect URLs).
5. Para alterar relatórios ou variáveis de build, faça novo deploy após salvar as alterações.

O servidor Express aplica cabeçalhos de segurança, restringe iframes ao Power BI e expõe `/health` para verificação de disponibilidade.

Referências oficiais: [comandos de build e start do Railway](https://docs.railway.com/builds/build-and-start-commands) e [variáveis de ambiente em aplicações frontend](https://docs.railway.com/guides/frontend-environment-variables).

## Comandos

- `npm run dev` — desenvolvimento local com Vite.
- `npm run build` — gera a versão de produção em `dist/`.
- `npm start` — serve a versão de produção.

Este projeto é JavaScript/Node.js, portanto não usa ambiente virtual Python (`.venv`). O `.gitignore` cobre `node_modules`, `dist`, ambientes Python eventuais e arquivos de ambiente.
