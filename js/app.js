/* SunSquare — landing page interactions */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ---------- Currency formatting ---------- */
  const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

  function formatLakhs(rupees) {
    if (rupees >= 10000000) return '₹' + (rupees / 10000000).toFixed(2) + ' Cr';
    if (rupees >= 100000)   return '₹' + (rupees / 100000).toFixed(2) + ' L';
    return '₹' + inr.format(Math.round(rupees));
  }

  /* ---------- Savings calculator ----------
   * Assumptions:
   *  - Average tariff ~ Rs 8/unit (blended residential slab)
   *  - System size = min(bill-implied load, roof-implied load)
   *  - Roof: 100 sq ft / kW
   *  - Sunshine (kWh/kW/day) selectable
   *  - Offset capped at 90% of bill
   *  - 25-yr savings uses 4% tariff inflation
   *  - CO2: ~0.82 kg per kWh (Indian grid)
   */
  const TARIFF = 8;
  const SQFT_PER_KW = 100;
  const OFFSET_CAP = 0.90;
  const YEARS = 25;
  const TARIFF_INFLATION = 0.04;
  const CO2_KG_PER_KWH = 0.82;

  const els = {
    bill:  document.getElementById('rngBill'),
    area:  document.getElementById('rngArea'),
    sun:   document.getElementById('rngSun'),
    outBill: document.getElementById('outBill'),
    outArea: document.getElementById('outArea'),
    outSun:  document.getElementById('outSun'),
    resSys:   document.getElementById('resSys'),
    resMonth: document.getElementById('resMonth'),
    resLife:  document.getElementById('resLife'),
    resCo2:   document.getElementById('resCo2')
  };

  function paintRange(input) {
    if (!input) return;
    const min = Number(input.min), max = Number(input.max), val = Number(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background =
      'linear-gradient(90deg, #FFB020 0%, #FF8A00 ' + pct + '%, #E5E7EB ' + pct + '%)';
  }

  function calc() {
    if (!els.bill) return;
    const bill = Number(els.bill.value);
    const area = Number(els.area.value);
    const sun  = Number(els.sun.value);

    // Bill-implied kW (monthly units / (sun * 30) )
    const monthlyUnits = bill / TARIFF;
    const kwFromBill = monthlyUnits / (sun * 30);

    // Roof cap
    const kwFromRoof = area / SQFT_PER_KW;

    // Recommended system, rounded to 0.5 kW, capped by roof
    let kw = Math.min(kwFromBill, kwFromRoof);
    kw = Math.max(1, Math.round(kw * 2) / 2);

    const dailyKwh = kw * sun;
    const monthlyKwh = dailyKwh * 30;

    // Cap savings so we don't imply >90% offset
    const savedUnits = Math.min(monthlyKwh, monthlyUnits * OFFSET_CAP);
    const monthlySavings = savedUnits * TARIFF;

    // 25-year savings with tariff inflation, geometric series
    // sum_{i=0..24} 12 * monthlySavings * (1+r)^i
    const r = TARIFF_INFLATION;
    const lifetime = 12 * monthlySavings * ((Math.pow(1 + r, YEARS) - 1) / r);

    // CO2 lifetime, in tonnes
    const co2Tonnes = (savedUnits * 12 * YEARS * CO2_KG_PER_KWH) / 1000;

    // Paint outputs
    els.outBill.textContent = inr.format(bill);
    els.outArea.textContent = area;
    els.outSun.textContent  = sun.toFixed(1);

    els.resSys.textContent   = kw.toFixed(1) + ' kW';
    els.resMonth.textContent = '₹' + inr.format(Math.round(monthlySavings));
    els.resLife.textContent  = formatLakhs(lifetime);
    els.resCo2.textContent   = co2Tonnes.toFixed(0) + ' tonnes';

    paintRange(els.bill); paintRange(els.area); paintRange(els.sun);
  }

  ['bill','area','sun'].forEach(k => {
    if (els[k]) els[k].addEventListener('input', calc);
  });
  calc();

  /* ---------- Hero form → pre-fills quote form & scrolls ---------- */
  const heroForm = document.getElementById('heroForm');
  const qBill  = document.getElementById('qBill');
  const qCity  = document.getElementById('qCity');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const b = document.getElementById('heroBill').value;
      const c = document.getElementById('heroCity').value;
      if (b && qBill) qBill.value = b;
      if (c && qCity) qCity.value = c;
      // Also seed the calculator bill
      if (b && els.bill) {
        els.bill.value = Math.min(Math.max(Number(b), Number(els.bill.min)), Number(els.bill.max));
        calc();
      }
      const target = document.getElementById('quote');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Quote form ---------- */
  const quoteForm = document.getElementById('quoteForm');
  const quoteSuccess = document.getElementById('quoteSuccess');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation
      const phone = document.getElementById('qPhone').value.trim();
      if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      // Show success overlay (no backend in this static demo)
      if (quoteSuccess) quoteSuccess.hidden = false;
      quoteForm.reset();
    });
  }

  /* ---------- FAQ: keep only one open at a time (progressive enhancement) ---------- */
  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.querySelectorAll('details').forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          faqList.querySelectorAll('details').forEach(o => {
            if (o !== d) o.open = false;
          });
        }
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = 1;
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.feature-card, .step, .pillar, .testi, .calc-card').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }
})();
