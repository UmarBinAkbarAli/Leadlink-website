import { gsap } from 'gsap';

export function initProcessTimeline() {
  const W = 2027, H = 1107;
  const stations = [
    { n:'01', title:'The Coffee Call', body:'A real conversation about what is broken, what is working, what you have tried, and what you actually need.', x:150,  circleY:740, curveY:1012, w:0 },
    { n:'02', title:'The Diagnosis',   body:'We audit your marketing, tech stack, content, and funnel to find gaps, leaks, and opportunities.',          x:472,  circleY:612, curveY:920,  w:0 },
    { n:'03', title:'The Strategy',    body:'A custom roadmap with services, sequence, KPIs, and the first 90 days. No generic templates.',                x:778,  circleY:498, curveY:775,  w:0 },
    { n:'04', title:'The Build',       body:'Content gets created, tech gets built, campaigns go live, and everything is documented in plain English.',     x:1088, circleY:384, curveY:620,  w:13 },
    { n:'05', title:'The Optimise',    body:'Week by week, data drives testing, refining, and improvement until the numbers move.',                         x:1412, circleY:250, curveY:485,  w:0 },
    { n:'06', title:'The Scale',       body:'Once the foundation works, we add channels, markets, volume, and momentum.',                                  x:1738, circleY:140, curveY:440,  w:0 },
  ];

  const X_START = 108, X_END = 1995;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const stage       = document.getElementById('ptl-stage');
  const curve       = document.getElementById('ptl-curve') as SVGGeometryElement | null;
  const connectorsG = document.getElementById('ptl-connectors');
  const ringsG      = document.getElementById('ptl-rings');
  const stationsEl  = document.getElementById('ptl-stations');

  if (!stage || !curve || !connectorsG || !ringsG || !stationsEl) return;

  // Narrow type for use inside nested functions
  const stageEl = stage as HTMLElement;

  function buildCurvePath() {
    const p = stations.map(s => ({ x: s.x, y: s.curveY }));
    let d = `M ${X_START} ${p[0].y} L ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      const cp1x = a.x + (b.x - a.x) * 0.5;
      const cp2x = b.x - (b.x - a.x) * 0.5;
      d += ` C ${cp1x} ${a.y} ${cp2x} ${b.y} ${b.x} ${b.y}`;
    }
    d += ` L ${X_END} ${p[p.length - 1].y}`;
    return d;
  }

  curve.setAttribute('d', buildCurvePath());

  const connectorEls: SVGGeometryElement[] = [];
  const topRingEls: Element[] = [];
  const bottomRingEls: Element[] = [];
  const stationEls: HTMLElement[] = [];

  stations.forEach(s => {
    const line = document.createElementNS(SVGNS, 'line');
    line.setAttribute('x1', String(s.x)); line.setAttribute('y1', String(s.circleY));
    line.setAttribute('x2', String(s.x)); line.setAttribute('y2', String(s.curveY));
    line.setAttribute('stroke', 'var(--connector)');
    line.setAttribute('stroke-width', '1.5');
    connectorsG.appendChild(line);
    connectorEls.push(line as unknown as SVGGeometryElement);

    const rb = document.createElementNS(SVGNS, 'circle');
    rb.setAttribute('cx', String(s.x)); rb.setAttribute('cy', String(s.curveY)); rb.setAttribute('r', '6.5');
    rb.setAttribute('fill', 'var(--bg)'); rb.setAttribute('stroke', 'var(--ring-bottom)');
    rb.setAttribute('stroke-width', '1.8'); rb.setAttribute('class', 'ring');
    ringsG.appendChild(rb);
    bottomRingEls.push(rb);

    const rt = document.createElementNS(SVGNS, 'circle');
    rt.setAttribute('cx', String(s.x)); rt.setAttribute('cy', String(s.circleY)); rt.setAttribute('r', '7.5');
    rt.setAttribute('fill', 'var(--bg)'); rt.setAttribute('stroke', 'var(--ring-top)');
    rt.setAttribute('stroke-width', '2'); rt.setAttribute('class', 'ring');
    ringsG.appendChild(rt);
    topRingEls.push(rt);

    const div = document.createElement('div');
    div.className = 'station';
    div.style.left = `${(s.x + 26) / W * 100}%`;
    div.style.top  = `${(s.circleY - 96) / H * 100}%`;
    if (s.w) div.style.width = `${s.w}cqw`;
    div.innerHTML = `<div class="num">${s.n}</div><div class="title">${s.title}</div><div class="desc">${s.body}</div>`;
    stationsEl.appendChild(div);
    stationEls.push(div);
  });

  const curveLen = curve.getTotalLength();
  gsap.set(curve, { strokeDasharray: curveLen, strokeDashoffset: curveLen });
  connectorEls.forEach(el => {
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });

  function play() {
    gsap.set(stageEl.querySelectorAll('.axis'), { opacity: 0 });
    gsap.set(stageEl.querySelectorAll('.label'), { opacity: 0, y: 8 });
    gsap.set(curve, { strokeDashoffset: curveLen });
    connectorEls.forEach(el => { gsap.set(el, { strokeDashoffset: el.getTotalLength() }); });
    gsap.set([...topRingEls, ...bottomRingEls], { opacity: 0, scale: 1 });
    gsap.set(stationEls, { opacity: 0, y: 26 });

    const CURVE_DUR = 2.0, START = 0.35;
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(stageEl.querySelectorAll('.axis'), { opacity: 1, duration: .7 }, 0)
      .to(stageEl.querySelectorAll('.label'), { opacity: 1, y: 0, duration: .8 }, .15)
      .to(curve, { strokeDashoffset: 0, duration: CURVE_DUR, ease: 'power1.inOut' }, START);

    stations.forEach((s, i) => {
      const reach = START + ((s.x - X_START) / (X_END - X_START)) * CURVE_DUR;
      tl.to(bottomRingEls[i], { opacity: 1, duration: .5, ease: 'power2.out' }, reach)
        .to(connectorEls[i],  { strokeDashoffset: 0, duration: .55, ease: 'power2.out' }, reach + .04)
        .to(topRingEls[i],    { opacity: 1, duration: .5, ease: 'power2.out' }, reach + .46)
        .to(stationEls[i],    { opacity: 1, y: 0, duration: .75, ease: 'power3.out' }, reach + .42);
    });
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(stageEl);
  } else {
    gsap.set([stageEl.querySelectorAll('.axis'), stageEl.querySelectorAll('.label'), stageEl.querySelectorAll('.ring'), stationEls], { opacity: 1, scale: 1, y: 0 });
    gsap.set(curve, { strokeDashoffset: 0 });
    connectorEls.forEach(el => { gsap.set(el, { strokeDashoffset: 0 }); });
  }
}
