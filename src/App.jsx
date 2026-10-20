import { useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase.js';
import catalog from './config/reports.json';

const Icon = ({ name, size = 20 }) => {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h12"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    pulse: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    empty: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5"/></>,
  };
  return <svg {...shared}>{paths[name]}</svg>;
};

function authErrorMessage(error) {
  const message = error?.message?.toLowerCase() ?? '';
  if (message.includes('invalid login') || message.includes('invalid credentials')) return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (message.includes('too many requests')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  return 'Não foi possível entrar agora. Verifique sua conexão e tente novamente.';
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (loginError) setError(authErrorMessage(loginError));
    else onLogin(data.session);
  }

  return (
    <main className="login-page">
      <section className="login-aside">
        <div className="brand brand-light"><span className="brand-mark"><Icon name="chart" size={21} /></span><span>Portal<span className="brand-dot">.</span></span></div>
        <div className="aside-copy">
          <span className="eyebrow"><span className="live-dot" /> INTELIGÊNCIA PARA DECIDIR</span>
          <h1>Clareza para<br />avançar.</h1>
          <p>Indicadores confiáveis, decisões melhores. Acesse seus relatórios gerenciais em um só lugar.</p>
        </div>
        <div className="aside-bottom"><Icon name="shield" size={16} /> Ambiente privado e seguro</div>
        <div className="aside-orb orb-one" /><div className="aside-orb orb-two" />
      </section>
      <section className="login-content">
        <div className="login-mobile-brand brand"><span className="brand-mark"><Icon name="chart" size={20} /></span><span>Portal<span className="brand-dot">.</span></span></div>
        <div className="login-card">
          <div className="login-heading-icon"><Icon name="lock" size={20} /></div>
          <p className="eyebrow eyebrow-blue">PORTAL RESTRITO</p>
          <h2>Bem-vindo de volta</h2>
          <p className="login-subtitle">Entre com suas credenciais para acessar os indicadores.</p>
          {!supabaseConfigured && <div className="notice" role="alert">Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> para habilitar o acesso.</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">E-mail corporativo</label>
            <div className="input-wrap"><Icon name="mail" size={18} /><input id="email" type="email" autoComplete="username" placeholder="voce@empresa.com.br" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div className="password-label"><label htmlFor="password">Senha</label><span>Acesso por convite</span></div>
            <div className="input-wrap"><Icon name="lock" size={18} /><input id="password" type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            <button className="button button-primary login-button" type="submit" disabled={!supabaseConfigured || busy}>{busy ? <><span className="spinner" />Entrando...</> : <>Entrar no portal <Icon name="arrow" size={18} /></>}</button>
          </form>
          <div className="login-footnote"><Icon name="shield" size={15} /> Acesso disponível apenas para usuários autorizados</div>
        </div>
        <footer className="login-footer">© {new Date().getFullYear()} · Portal Gerencial de Indicadores</footer>
      </section>
    </main>
  );
}

function validPowerBiUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'app.powerbi.com';
  } catch {
    return false;
  }
}

function Dashboard({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas as categorias');
  const [query, setQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);
  const reports = Array.isArray(catalog.reports) ? catalog.reports.filter((report) => report && report.name && report.description && validPowerBiUrl(report.url)) : [];
  const categories = ['Todas as categorias', ...new Set([...(catalog.categories ?? []), ...reports.map((report) => report.category)].filter(Boolean))];
  const visibleReports = useMemo(() => reports.filter((report) => {
    const matchesCategory = selectedCategory === 'Todas as categorias' || report.category === selectedCategory;
    const needle = query.trim().toLocaleLowerCase('pt-BR');
    return matchesCategory && (!needle || `${report.name} ${report.description} ${report.category}`.toLocaleLowerCase('pt-BR').includes(needle));
  }), [reports, selectedCategory, query]);
  const initials = (user.email ?? 'U').slice(0, 1).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#inicio" className="brand brand-light" onClick={(event) => { event.preventDefault(); setActiveReport(null); }}><span className="brand-mark"><Icon name="chart" size={21} /></span><span>Portal<span className="brand-dot">.</span></span></a>
        <div className="sidebar-section-label">ESPAÇO DE TRABALHO</div>
        <button className={`side-link ${!activeReport ? 'active' : ''}`} onClick={() => setActiveReport(null)}><Icon name="grid" size={18} /> Catálogo</button>
        <div className="sidebar-section-label category-label">CATEGORIAS</div>
        <nav className="side-categories" aria-label="Filtrar por categoria">{categories.filter((category) => category !== 'Todas as categorias').map((category) => <button key={category} className={`side-link ${selectedCategory === category ? 'active' : ''}`} onClick={() => { setSelectedCategory(category); setActiveReport(null); }}><span className="category-dot" />{category}</button>)}</nav>
        <div className="sidebar-bottom"><div className="secure-card"><span className="secure-icon"><Icon name="shield" size={17} /></span><div><strong>Ambiente seguro</strong><small>Conexão protegida</small></div><span className="secure-check">✓</span></div><button className="side-link logout-link" onClick={onLogout}><Icon name="logout" size={18} /> Sair da conta</button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb"><span>Portal</span><span className="crumb-slash">/</span><strong>{activeReport ? activeReport.name : 'Catálogo de relatórios'}</strong></div><div className="user-area"><div className="user-meta"><strong>{user.email?.split('@')[0]}</strong><span>Usuário autorizado</span></div><span className="avatar" title={user.email}>{initials}</span><button className="icon-button mobile-logout" aria-label="Sair da conta" onClick={onLogout}><Icon name="logout" size={18} /></button></div></header>
        {activeReport ? <section className="report-view"><button className="back-button" onClick={() => setActiveReport(null)}><Icon name="back" size={18} /> Voltar ao catálogo</button><div className="report-heading"><div><span className="eyebrow eyebrow-blue">{activeReport.category}</span><h1>{activeReport.name}</h1><p>{activeReport.description}</p></div></div><div className="report-frame"><iframe title={activeReport.name} src={activeReport.url} allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /><div className="frame-caption"><Icon name="shield" size={14} /> Relatório disponibilizado pelo Power BI</div></div></section> : <>
          <section className="welcome-banner"><div className="banner-copy"><span className="eyebrow banner-eyebrow"><span className="live-dot" /> VISÃO EXECUTIVA</span><h1>Portal Gerencial de<br className="desktop-break" /> Indicadores</h1><p>Os dados certos para decisões que movem o negócio.</p></div><div className="banner-art" aria-hidden="true"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-bars"><i/><i/><i/><i/><i/><i/><i/></div><div className="art-line"/><span className="art-point point-one"/><span className="art-point point-two"/><span className="art-point point-three"/><span className="art-point point-four"/></div><div className="banner-corner"><Icon name="pulse" size={16} /> PAINÉIS ATUALIZADOS</div></section>
          <section className="catalog-section"><div className="section-heading"><div><span className="eyebrow eyebrow-blue">CENTRAL DE RELATÓRIOS</span><h2>Seus indicadores</h2><p>Acesse os painéis disponíveis para sua área.</p></div><div className="report-count"><strong>{visibleReports.length.toString().padStart(2, '0')}</strong><span>relatórios</span></div></div>
            <div className="catalog-controls"><div className="search-wrap"><Icon name="search" size={19} /><input type="search" aria-label="Buscar relatórios" placeholder="Buscar por nome ou descrição..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button className="clear-search" aria-label="Limpar busca" onClick={() => setQuery('')}><Icon name="close" size={15} /></button>}</div><div className="category-pills" aria-label="Categorias">{categories.map((category) => <button key={category} className={`category-pill ${selectedCategory === category ? 'selected' : ''}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div></div>
            {visibleReports.length ? <div className="report-grid">{visibleReports.map((report) => <article className="report-card" key={report.id ?? report.name}><div className="card-topline"><span className="report-icon"><Icon name="chart" size={20} /></span><span className="card-category">{report.category}</span></div><h3>{report.name}</h3><p>{report.description}</p><button className="open-report" onClick={() => setActiveReport(report)}>Abrir relatório <Icon name="arrow" size={17} /></button></article>)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="empty" size={22} /></span><h3>{reports.length ? 'Nenhum relatório encontrado' : 'Seu catálogo está sendo preparado'}</h3><p>{reports.length ? 'Tente ajustar a busca ou escolha outra categoria.' : 'Os relatórios autorizados para sua área aparecerão aqui assim que forem configurados.'}</p>{query && <button className="clear-filter" onClick={() => { setQuery(''); setSelectedCategory('Todas as categorias'); }}>Limpar filtros</button>}</div>}
          </section>
          <footer className="app-footer"><span>© {new Date().getFullYear()} · Uso interno</span><span><Icon name="shield" size={14} /> Acesso protegido</span></footer>
        </>}
      </main>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setCheckingSession(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setCheckingSession(false);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase?.auth.signOut();
    setSession(null);
  }

  if (checkingSession) return <main className="loading-screen"><span className="spinner spinner-dark" /><span>Verificando seu acesso...</span></main>;
  return session ? <Dashboard user={session.user} onLogout={signOut} /> : <Login onLogin={setSession} />;
}
