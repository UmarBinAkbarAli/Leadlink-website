import { gsap } from 'gsap';

const TEAM = [
  { img: 'assets/team-left.png',   name: 'Alex Chen',   role: 'Head of Growth',   quote: 'Building growth systems that compound over time is the only sustainable way to win.' },
  { img: 'assets/team-center.png', name: 'Saqib Awan',  role: 'Founder & CEO',    quote: 'The SEO strategy was well structured and easy to follow. Within months, our search rankings improved and our website traffic doubled.' },
  { img: 'assets/team-right.png',  name: 'Sara Hassan', role: 'Creative Director', quote: 'Every brand has a story worth telling. Our job is to make sure the right people hear it at the right time.' },
  { img: 'assets/team-left.png',   name: 'Omar Malik',  role: 'Tech Lead',         quote: 'Solid infrastructure is invisible — until you need it most. We build it right the first time.' },
  { img: 'assets/team-center.png', name: 'Zara Ahmed',  role: 'Strategy Lead',     quote: 'Strategy without execution is just a document. We do both, every single time.' },
];

const TESTS = [
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'LeadLink built our entire growth engine in 90 days. Pipeline doubled, brand clarified, and the team finally had direction.',
    name:   'James Caldwell',
    role:   'Founder, Clearpath Ventures',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'They are not an agency — they think like operators. Our content now converts, and our tech stack actually works together.',
    name:   'Priya Sharma',
    role:   'CMO, Wavefront Digital',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'From brand identity to lead generation, LeadLink handled everything under one roof. No back-and-forth, no gaps — just results.',
    name:   'Tariq Al-Mansouri',
    role:   'CEO, Pinnacle Retail Group',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'We had three agencies before LeadLink. None of them talked to each other. LeadLink replaced all three and our cost per lead dropped by 40%.',
    name:   'Sophie Laurent',
    role:   'Marketing Director, Elara Skincare',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'Our TikTok Shop went from zero to six figures in eight weeks. The commerce team knew exactly what levers to pull.',
    name:   'Daniel Osei',
    role:   'Co-Founder, NovaNest',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'The website they built is the best investment we have made. Conversion rate tripled within the first month of going live.',
    name:   'Aisha Karimi',
    role:   'CEO, Luminary Consulting',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'LeadLink Press got us featured in three major publications in 60 days. The credibility that came with it is priceless.',
    name:   'Marcus Webb',
    role:   'Founder, Apex Capital Partners',
  },
  {
    person: 'assets/testimonial-person.png',
    logo:   'assets/testimonial-logo.png',
    quote:  'I was sceptical about handing everything to one team. Six months later I cannot imagine running our marketing any other way.',
    name:   'Rania Haddad',
    role:   'Head of Growth, Stackora',
  },
];

export function initTeamSlider() {
  const N = TEAM.length;
  const SCALE = 1.428;
  const CARD_W = 196, GAP = 69, SLOT = CARD_W + GAP;

  const track   = document.getElementById('teamTrack');
  const outer   = track?.parentElement ?? null;
  const prevBtn = document.getElementById('teamPrev');
  const nextBtn = document.getElementById('teamNext');
  const tsName  = document.getElementById('tsName');
  const tsRole  = document.getElementById('tsRole');
  const quoteEl = document.getElementById('teamQuote');

  if (!track || !tsName || !tsRole || !quoteEl) return;

  // Narrowed references for use inside nested functions
  const nameEl = tsName as HTMLElement;
  const roleEl = tsRole as HTMLElement;
  const qEl    = quoteEl as HTMLElement;

  const trackData = [TEAM[N - 1], ...TEAM, TEAM[0]];
  const cards = trackData.map(m => {
    const el = document.createElement('div');
    el.className = 'ts-card';
    const img = document.createElement('img');
    img.src = m.img;
    img.alt = m.name;
    el.appendChild(img);
    track.appendChild(el);
    return el;
  });

  let tidx = 1;
  let busy = false;

  const sw = () => outer?.offsetWidth ?? 756;
  const tx = (i: number) => sw() / 2 - (i * SLOT + CARD_W / 2);
  const dataIdx = (ti: number) => (ti - 1 + N) % N;

  function setMeta(di: number, animate: boolean) {
    const m = TEAM[di];
    if (!animate) {
      nameEl.textContent = m.name;
      roleEl.textContent = m.role;
      qEl.textContent = m.quote;
      return;
    }
    gsap.to([nameEl, roleEl, qEl], {
      opacity: 0, y: 8, duration: 0.2, ease: 'power2.in',
      onComplete() {
        nameEl.textContent = m.name;
        roleEl.textContent = m.role;
        qEl.textContent = m.quote;
        gsap.to([nameEl, roleEl, qEl], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      },
    });
  }

  gsap.set(track, { x: tx(tidx) });
  gsap.set(cards[tidx], { scale: SCALE });
  setMeta(dataIdx(tidx), false);

  function navigate(dir: number) {
    if (busy) return;
    busy = true;
    const prev = tidx;
    tidx += dir;

    gsap.to(cards[prev], { scale: 1, duration: 0.45, ease: 'power2.inOut' });
    gsap.to(cards[tidx], { scale: SCALE, duration: 0.45, ease: 'power2.inOut' });
    gsap.to(track, {
      x: tx(tidx), duration: 0.5, ease: 'power2.inOut',
      onComplete() {
        if (tidx === N + 1) {
          tidx = 1;
          gsap.set(track, { x: tx(1) });
          gsap.set(cards[N + 1], { scale: 1 });
          gsap.set(cards[1], { scale: SCALE });
        } else if (tidx === 0) {
          tidx = N;
          gsap.set(track, { x: tx(N) });
          gsap.set(cards[0], { scale: 1 });
          gsap.set(cards[N], { scale: SCALE });
        }
        busy = false;
      },
    });

    setMeta(dataIdx(tidx), true);
  }

  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));
  window.addEventListener('resize', () => gsap.set(track, { x: tx(tidx) }));
}

export function initTestimonialSlider() {
  const N = TESTS.length;
  let idx = 0;
  let busy = false;
  let timer: ReturnType<typeof setInterval>;

  const row      = document.getElementById('testimonialRow');
  const personEl = document.getElementById('testPerson') as HTMLImageElement | null;
  const logoEl   = document.getElementById('testLogo') as HTMLImageElement | null;
  const quoteEl  = document.getElementById('testQuote');
  const nameEl   = document.getElementById('testName');
  const roleEl   = document.getElementById('testRole');
  const prevBtn  = document.getElementById('testPrev');
  const nextBtn  = document.getElementById('testNext');

  if (!row || !personEl || !logoEl || !quoteEl || !nameEl || !roleEl) return;

  function fill(i: number) {
    const t = TESTS[i];
    (personEl as HTMLImageElement).src = t.person;
    (personEl as HTMLImageElement).alt = t.name;
    (logoEl as HTMLImageElement).src = t.logo;
    quoteEl!.textContent = t.quote;
    nameEl!.textContent  = t.name;
    roleEl!.textContent  = t.role;
  }

  function slide(newIdx: number, dir: number) {
    if (busy) return;
    busy = true;
    idx = (newIdx + N) % N;

    gsap.timeline({ onComplete() { busy = false; } })
      .to(row, { x: `${dir * -100}%`, duration: 0.45, ease: 'power2.inOut' })
      .add(() => fill(idx))
      .fromTo(
        row,
        { x: `${dir * 100}%` },
        { x: '0%', duration: 0.45, ease: 'power2.inOut' },
      );
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => slide(idx + 1, 1), 5000);
  }

  fill(0);
  gsap.set(row, { x: '0%' });
  startTimer();

  prevBtn?.addEventListener('click', () => { slide(idx - 1, -1); startTimer(); });
  nextBtn?.addEventListener('click', () => { slide(idx + 1,  1); startTimer(); });
  row.addEventListener('mouseenter', () => clearInterval(timer));
  row.addEventListener('mouseleave', startTimer);
}
