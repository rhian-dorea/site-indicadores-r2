import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase.js';
import catalog from './config/reports.json';
import r2Logo from '../img/image.png';

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

function R2Logo({ className = '' }) {
  return <img className={className} src={r2Logo} alt="R2 Telecomunicações" />;
}

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
        <div className="brand brand-light login-brand"><R2Logo className="login-logo" /><span>R2 Telecomunicações</span></div>
        <div className="aside-copy">
          <span className="eyebrow"><span className="live-dot" /> INTELIGÊNCIA PARA DECIDIR</span>
          <h1>Clareza para<br />avançar.</h1>
          <p>Indicadores confiáveis, decisões melhores.</p>
          <p>Acesse seus relatórios gerenciais em um só lugar.</p>
        </div>
        <div className="aside-bottom"><Icon name="shield" size={16} /> Ambiente privado e seguro</div>
        <div className="aside-orb orb-one" /><div className="aside-orb orb-two" />
      </section>
      <section className="login-content">
        <div className="login-mobile-brand brand"><R2Logo className="login-logo" /><span>R2 Telecomunicações</span></div>
        <div className="login-card">
          <div className="login-heading-icon"><Icon name="lock" size={20} /></div>
          <p className="eyebrow eyebrow-blue">PORTAL RESTRITO</p>
          <h2>Bem-vindo de volta</h2>
          <p className="login-subtitle">Entre com suas credenciais para acessar os indicadores.</p>
          {!supabaseConfigured && <div className="notice" role="alert">Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no arquivo <code>.env</code> para habilitar o acesso.</div>}
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
  const reports = Array.isArray(catalog.reports)
    ? catalog.reports.filter((report) => report?.id && report.name && validPowerBiUrl(report.url))
    : [];
  const [activeReportId, setActiveReportId] = useState(() => reports[0]?.id ?? null);
  const activeReport = reports.find((report) => report.id === activeReportId);

  return (
    <div className="reports-portal">
      <header className="portal-header">
        <div className="portal-brand">
          <R2Logo className="portal-logo" />
          <div className="portal-brand-copy">
            <strong>R2 Telecomunicações</strong>
            <span>Clareza para avançar. Indicadores confiáveis, decisões melhores.</span>
          </div>
        </div>
        <div className="portal-actions">
          <span className="portal-user" title={user.email}>{user.email}</span>
          <button className="portal-logout" type="button" onClick={onLogout}>
            <Icon name="logout" size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <section className="portal-intro" aria-label="Apresentação">
        <p>Acesse seus relatórios gerenciais em um só lugar.</p>
        {activeReport && <strong>{activeReport.name}</strong>}
      </section>

      <nav className="report-tabs" aria-label="Relatórios gerenciais">
        {reports.map((report) => (
          <button
            key={report.id}
            className={`report-tab${activeReportId === report.id ? ' is-active' : ''}`}
            type="button"
            aria-pressed={activeReportId === report.id}
            onClick={() => setActiveReportId(report.id)}
          >
            {report.name}
          </button>
        ))}
      </nav>

      <main className="report-workspace">
        {activeReport ? (
          <iframe
            key={activeReport.id}
            className="report-iframe"
            title={`Relatório ${activeReport.name}`}
            src={activeReport.url}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="report-empty" role="status">Nenhum relatório válido foi configurado.</div>
        )}
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
