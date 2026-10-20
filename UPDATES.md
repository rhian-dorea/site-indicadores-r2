# Atualizações

## 2026-10-20 — Publicação no GitHub Pages

- Configurado o caminho base do Vite para `/portal-indicadores/`.
- Adicionado workflow do GitHub Actions para instalar dependências, compilar e publicar `dist/` no GitHub Pages.
- Limitadas as variáveis disponíveis durante o build às variáveis públicas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; nenhuma chave Secret/service_role é usada.
- Documentados o cadastro das variáveis e a ativação do GitHub Pages.

## 2026-10-20 — Configuração Supabase

- Conectado o cliente Supabase à Project URL e à chave Publishable presentes no `.env`.
- Limitada a exposição ao navegador às duas variáveis públicas explicitamente nomeadas na configuração Vite.
- Mantidos login/logout e o acesso interno condicionado à sessão, sem opção de cadastro público no portal.

## 2026-10-20

- Criado portal responsivo com autenticação Supabase por e-mail e senha, sem cadastro público.
- Adicionado catálogo pesquisável por nome e categoria, com visualização de relatórios Power BI em iframe.
- Separada a lista de relatórios em `src/config/reports.json` e a configuração de ambiente em `.env`/`.env.example`.
- Adicionado servidor de produção Express com cabeçalhos de segurança, compressão, rota de saúde e configuração para Railway.
- Documentados configuração local, gestão de usuários, links públicos e publicação no Railway.
