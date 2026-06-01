import Link from 'next/link'
import {
  Kanban,
  Users,
  BarChart2,
  Activity,
  Bell,
  Shield,
  Check,
  ArrowRight,
  MoveRight,
} from 'lucide-react'

const features = [
  {
    icon: Kanban,
    title: 'Pipeline Kanban',
    description:
      'Arraste negócios entre etapas com drag-and-drop. Visualize onde cada oportunidade está no funil em tempo real.',
  },
  {
    icon: Users,
    title: 'Gestão de Leads',
    description:
      'Cadastre, filtre e acompanhe cada contato com histórico completo de interações, responsáveis e status.',
  },
  {
    icon: BarChart2,
    title: 'Dashboard de Métricas',
    description:
      'Taxa de conversão, valor do pipeline e negócios por etapa. Decisões baseadas em dados reais, não intuição.',
  },
  {
    icon: Activity,
    title: 'Timeline de Atividades',
    description:
      'Registre ligações, e-mails, reuniões e notas vinculadas a cada lead. Histórico completo sempre disponível.',
  },
  {
    icon: Bell,
    title: 'Alertas de Prazo',
    description:
      'Nunca perca um follow-up. Saiba quais negócios precisam de atenção hoje, esta semana ou estão atrasados.',
  },
  {
    icon: Shield,
    title: 'Multi-empresa',
    description:
      'Cada workspace completamente isolado. Convide membros, defina papéis de Admin e Membro, controle o acesso.',
  },
]

const stats = [
  { value: '+47%', label: 'taxa de conversão' },
  { value: '3.2x', label: 'leads qualificados' },
  { value: '-62%', label: 'ciclo de venda' },
  { value: '1.200+', label: 'times usando' },
]

const freePlan = [
  '2 colaboradores por workspace',
  'Até 50 leads',
  'Pipeline Kanban',
  'Dashboard de métricas',
  'Timeline de atividades',
]

const proPlan = [
  'Colaboradores ilimitados',
  'Leads ilimitados',
  'Pipeline Kanban avançado',
  'Dashboard completo',
  'Timeline de atividades',
  'Alertas de prazo inteligentes',
  'Convites por e-mail',
  'Suporte prioritário',
]

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes pf-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pf-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pf-line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .pf-fade-up {
          opacity: 0;
          animation: pf-fade-up 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pf-fade-in {
          opacity: 0;
          animation: pf-fade-in 0.6s ease forwards;
        }
        .d-0  { animation-delay: 0ms; }
        .d-1  { animation-delay: 120ms; }
        .d-2  { animation-delay: 240ms; }
        .d-3  { animation-delay: 360ms; }
        .d-4  { animation-delay: 480ms; }
        .d-5  { animation-delay: 600ms; }

        .hero-radial {
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(202,255,51,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 50% 0%, rgba(202,255,51,0.07) 0%, transparent 60%);
        }
        .dot-grid {
          background-image: radial-gradient(circle, rgba(42,42,46,0.9) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .glow-btn {
          transition: filter 0.2s, box-shadow 0.2s;
        }
        .glow-btn:hover {
          filter: brightness(1.08);
          box-shadow: 0 0 28px rgba(202,255,51,0.35);
        }
        .card-lift {
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .card-lift:hover {
          border-color: rgba(202,255,51,0.2);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
        .pro-card {
          box-shadow: 0 0 60px rgba(202,255,51,0.07);
        }
        .stat-number {
          font-variant-numeric: tabular-nums;
        }
        .nav-blur {
          background: rgba(12,12,14,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="min-h-screen bg-pf-bg text-pf-text overflow-x-hidden">

        {/* ── NAVBAR ────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 nav-blur border-b border-pf-border-subtle">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-pf-accent font-display text-sm font-extrabold text-pf-bg select-none">
                PF
              </span>
              <span className="font-display text-[17px] font-semibold tracking-tight text-pf-text">
                PipeFlow
              </span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <a
                href="#funcionalidades"
                className="text-sm text-pf-text-sec transition-colors hover:text-pf-text"
              >
                Funcionalidades
              </a>
              <a
                href="#precos"
                className="text-sm text-pf-text-sec transition-colors hover:text-pf-text"
              >
                Preços
              </a>
            </div>


            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-pf-text-muted transition-colors hover:text-pf-text-sec"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="glow-btn rounded-lg bg-pf-accent px-4 py-2 text-sm font-semibold text-pf-bg"
              >
                Começar grátis
              </Link>
            </div>
          </div>

          {/* Mobile nav — second row, visible below md */}
          <div className="flex items-center gap-6 border-t border-pf-border-subtle px-6 py-2 md:hidden">
            <a href="#funcionalidades" className="text-sm text-pf-text-muted transition-colors hover:text-pf-text-sec">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm text-pf-text-muted transition-colors hover:text-pf-text-sec">
              Preços
            </a>
          </div>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="hero-radial dot-grid absolute inset-0 pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-20 text-center">

            {/* Badge */}
            <div className="pf-fade-up d-0 mb-8 inline-flex items-center gap-2.5 rounded-full border border-pf-accent/25 bg-pf-accent/8 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pf-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-pf-accent">
                CRM para times que vendem mais
              </span>
            </div>

            {/* Headline */}
            <h1 className="pf-fade-up d-1 mb-6 font-display font-extrabold leading-[1.04] tracking-tight">
              <span className="block text-[2.25rem] text-pf-text sm:text-5xl md:text-7xl lg:text-[88px]">
                Feche mais negócios.
              </span>
              <span className="block text-[2.25rem] text-pf-accent sm:text-5xl md:text-7xl lg:text-[88px]">
                Com muito menos
              </span>
              <span className="block text-[2.25rem] text-pf-text sm:text-5xl md:text-7xl lg:text-[88px]">
                esforço.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="pf-fade-up d-2 mx-auto mb-10 max-w-lg text-lg leading-relaxed text-pf-text-sec">
              Pipeline Kanban, gestão de leads e dashboard de métricas em um só lugar.
              Grátis para começar — escala conforme seu time cresce.
            </p>

            {/* CTA Buttons */}
            <div className="pf-fade-up d-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="glow-btn flex items-center gap-2 rounded-xl bg-pf-accent px-8 py-3.5 text-[15px] font-semibold text-pf-bg"
              >
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-pf-border px-8 py-3.5 text-[15px] font-medium text-pf-text-sec transition-all hover:border-pf-border/60 hover:bg-pf-surface hover:text-pf-text"
              >
                Ver demo
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Social proof micro-line */}
            <p className="pf-fade-up d-4 mt-8 font-mono text-xs text-pf-text-muted">
              Nenhum cartão de crédito necessário · Cancele quando quiser
            </p>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────── */}
        <section className="border-y border-pf-border bg-pf-surface">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 divide-x divide-y divide-pf-border md:grid-cols-4 md:divide-y-0">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="flex flex-col items-center gap-2 px-6 py-12"
                >
                  <span className="stat-number font-mono text-4xl font-bold tracking-tight text-pf-accent md:text-5xl">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-pf-text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section id="funcionalidades" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-pf-accent">
              Funcionalidades
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-pf-text md:text-5xl">
              Tudo que seu time precisa
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-pf-text-sec">
              Do primeiro contato ao fechamento — sem planilhas, sem caos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="card-lift group rounded-xl border border-pf-border bg-pf-surface p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-pf-accent/20 bg-pf-accent/10 text-pf-accent transition-colors group-hover:border-pf-accent/40 group-hover:bg-pf-accent/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-display text-[17px] font-semibold text-pf-text">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pf-text-sec">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="precos" className="bg-pf-surface">
          <div className="mx-auto max-w-4xl px-6 py-24">
            <div className="mb-14 text-center">
              <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-pf-accent">
                Preços
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight text-pf-text md:text-5xl">
                Simples e transparente
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-base text-pf-text-sec">
                Comece grátis. Escale quando precisar.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Free */}
              <div className="flex flex-col rounded-2xl border border-pf-border bg-pf-bg p-8">
                <div className="mb-7">
                  <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-pf-text-muted">
                    Plano
                  </p>
                  <h3 className="font-display text-2xl font-bold text-pf-text">Grátis</h3>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="font-display text-5xl font-extrabold leading-none text-pf-text">
                      R$&nbsp;0
                    </span>
                    <span className="mb-1 text-sm text-pf-text-muted">/mês</span>
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-pf-text-muted">para sempre</p>
                </div>

                <ul className="mb-8 grow space-y-3.5">
                  {freePlan.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-pf-text-sec">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-pf-positive" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="block rounded-xl border border-pf-border py-3 text-center text-sm font-semibold text-pf-text-sec transition-all hover:border-pf-border/60 hover:bg-pf-surface hover:text-pf-text"
                >
                  Começar grátis
                </Link>
              </div>

              {/* Pro */}
              <div className="pro-card relative flex flex-col rounded-2xl border border-pf-accent/40 bg-pf-bg p-8">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-pf-accent px-3.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-pf-bg">
                    Recomendado
                  </span>
                </div>

                <div className="mb-7">
                  <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-pf-text-muted">
                    Plano
                  </p>
                  <h3 className="font-display text-2xl font-bold text-pf-text">Pro</h3>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="font-display text-5xl font-extrabold leading-none text-pf-text">
                      R$&nbsp;49
                    </span>
                    <span className="mb-1 text-sm text-pf-text-muted">/mês</span>
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-pf-text-muted">por workspace</p>
                </div>

                <ul className="mb-8 grow space-y-3.5">
                  {proPlan.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-pf-text-sec">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-pf-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="glow-btn block rounded-xl bg-pf-accent py-3 text-center text-sm font-semibold text-pf-bg"
                >
                  Assinar Pro
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-pf-border">
          <div className="hero-radial absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
            <h2 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-pf-text md:text-6xl">
              Pronto para organizar
              <br />
              <span className="text-pf-accent">seu funil de vendas?</span>
            </h2>
            <p className="mb-10 text-lg text-pf-text-sec">
              Comece grátis hoje. Nenhum cartão de crédito necessário.
            </p>
            <Link
              href="/signup"
              className="glow-btn inline-flex items-center gap-2.5 rounded-xl bg-pf-accent px-10 py-4 text-[15px] font-semibold text-pf-bg"
            >
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="border-t border-pf-border bg-pf-surface">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row">

            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pf-accent font-display text-xs font-extrabold text-pf-bg">
                PF
              </span>
              <span className="font-display text-base font-semibold text-pf-text">PipeFlow</span>
            </Link>

            <div className="flex items-center gap-6">
              <a href="#funcionalidades" className="font-mono text-[11px] text-pf-text-muted transition-colors hover:text-pf-text-sec">
                Funcionalidades
              </a>
              <a href="#precos" className="font-mono text-[11px] text-pf-text-muted transition-colors hover:text-pf-text-sec">
                Preços
              </a>
              <a href="mailto:contato@pipeflow.com.br" className="font-mono text-[11px] text-pf-text-muted transition-colors hover:text-pf-text-sec">
                Contato
              </a>
            </div>

            <p className="font-mono text-[11px] text-pf-text-muted">
              © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
