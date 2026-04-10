// ===== Revenue Tracking Logic =====

(function () {
  var rev = DATA.revenue;
  var sources = DATA.revenueSources;
  var quarters = DATA.quarterlyRevenue;

  // --------------- Computed totals ---------------
  var totalActual = 0, totalTarget = 0, totalCollected = 0;
  rev.forEach(function (r) {
    totalActual += r.actual;
    totalTarget += r.target;
    totalCollected += r.collected;
  });

  var achievementPct = (totalActual / totalTarget * 100).toFixed(1);
  var collectionRate = (totalCollected / totalActual * 100).toFixed(1);

  var bestMonth = rev.reduce(function (best, r) {
    return r.actual > best.actual ? r : best;
  }, rev[0]);

  var avgMonthly = (totalActual / rev.length).toFixed(1);

  // --------------- KPI Cards ---------------
  document.getElementById('kpiTotalRevenue').innerHTML =
    totalActual.toFixed(1) + '<span class="kpi-unit">L</span>';
  document.getElementById('kpiTotalRevenueSub').textContent =
    '\u20B9' + avgMonthly + 'L / month avg';

  document.getElementById('kpiAnnualTarget').innerHTML =
    totalTarget.toFixed(0) + '<span class="kpi-unit">L</span>';
  document.getElementById('kpiTargetAchieved').textContent =
    achievementPct + '% achieved';

  document.getElementById('kpiCollectionRate').innerHTML =
    collectionRate + '<span class="kpi-unit">%</span>';
  document.getElementById('kpiCollectionSub').textContent =
    '\u20B9' + totalCollected.toFixed(1) + 'L collected';

  document.getElementById('kpiBestMonth').innerHTML =
    bestMonth.month.split("'")[0] + '<span class="kpi-unit">\u2019' + bestMonth.month.split("'")[1] + '</span>';
  document.getElementById('kpiBestMonthSub').textContent =
    '\u20B9' + bestMonth.actual.toFixed(1) + 'L revenue';

  // --------------- Monthly Revenue Chart ---------------
  (function () {
    var container = document.getElementById('revChart');
    if (!container) return;

    var maxVal = Math.max.apply(null, rev.map(function (r) {
      return Math.max(r.target, r.actual);
    }));

    rev.forEach(function (r) {
      var group = document.createElement('div');
      group.className = 'rev-bar-group';

      var valDiv = document.createElement('div');
      valDiv.className = 'bar-val';
      valDiv.textContent = r.actual.toFixed(1);

      var trio = document.createElement('div');
      trio.className = 'rev-bar-trio';

      var targetBar = document.createElement('div');
      targetBar.className = 'bar rev-target';
      targetBar.style.height = '0px';
      targetBar.title = 'Target: \u20B9' + r.target + 'L';

      var actualBar = document.createElement('div');
      actualBar.className = 'bar rev-actual';
      actualBar.style.height = '0px';
      actualBar.title = 'Actual: \u20B9' + r.actual + 'L';

      var collectedBar = document.createElement('div');
      collectedBar.className = 'bar rev-collected';
      collectedBar.style.height = '0px';
      collectedBar.title = 'Collected: \u20B9' + r.collected + 'L';

      trio.appendChild(targetBar);
      trio.appendChild(actualBar);
      trio.appendChild(collectedBar);

      var label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = r.month.replace("'", "\u2019");

      // Variance indicator
      var variance = r.actual - r.target;
      var varDiv = document.createElement('div');
      varDiv.className = 'rev-variance ' + (variance >= 0 ? 'positive' : 'negative');
      varDiv.textContent = (variance >= 0 ? '+' : '') + variance.toFixed(1);

      group.appendChild(valDiv);
      group.appendChild(trio);
      group.appendChild(varDiv);
      group.appendChild(label);
      container.appendChild(group);

      requestAnimationFrame(function () {
        targetBar.style.height = (r.target / maxVal * 180) + 'px';
        actualBar.style.height = (r.actual / maxVal * 180) + 'px';
        collectedBar.style.height = (r.collected / maxVal * 180) + 'px';
      });
    });
  })();

  // --------------- Quarterly Achievement ---------------
  (function () {
    var container = document.getElementById('quarterlyBars');
    if (!container) return;

    quarters.forEach(function (q) {
      var row = document.createElement('div');
      row.className = 'q-row';

      var qLabel = document.createElement('div');
      qLabel.className = 'q-label';
      qLabel.textContent = q.quarter;

      var qTrack = document.createElement('div');
      qTrack.className = 'q-track';

      var qFill = document.createElement('div');
      qFill.className = 'q-fill' + (q.achieved >= 100 ? ' exceeded' : '');
      qFill.style.width = '0%';

      var qTarget = document.createElement('div');
      qTarget.className = 'q-target-line';

      qTrack.appendChild(qFill);
      qTrack.appendChild(qTarget);

      var qVal = document.createElement('div');
      qVal.className = 'q-val';
      qVal.innerHTML = '<strong>' + q.achieved.toFixed(1) + '%</strong>';

      var qDetail = document.createElement('div');
      qDetail.className = 'q-detail';
      qDetail.textContent = '\u20B9' + q.actual + 'L / \u20B9' + q.target + 'L';

      row.appendChild(qLabel);
      row.appendChild(qTrack);
      row.appendChild(qVal);
      row.appendChild(qDetail);
      container.appendChild(row);

      requestAnimationFrame(function () {
        qFill.style.width = Math.min(q.achieved, 110) + '%';
      });
    });

    // Summary
    var totalQTarget = 0, totalQActual = 0;
    quarters.forEach(function (q) { totalQTarget += q.target; totalQActual += q.actual; });
    var summary = document.getElementById('quarterlySummary');
    summary.innerHTML =
      '<div class="q-summary-row">' +
        '<span>Annual Total</span>' +
        '<span>\u20B9' + totalQActual.toFixed(1) + 'L / \u20B9' + totalQTarget + 'L</span>' +
        '<span class="' + (totalQActual >= totalQTarget ? 'positive' : 'negative') + '">' +
          (totalQActual / totalQTarget * 100).toFixed(1) + '%</span>' +
      '</div>';
  })();

  // --------------- Revenue by Source ---------------
  (function () {
    var container = document.getElementById('sourceBars');
    if (!container) return;

    var maxAmt = Math.max.apply(null, sources.map(function (s) { return s.amount; }));
    var colors = ['var(--orange)', 'var(--teal)', 'var(--gold)', 'var(--purple)', '#ef4444'];

    sources.forEach(function (s, i) {
      var row = document.createElement('div');
      row.className = 'source-row';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'source-name';
      nameDiv.textContent = s.source;

      var track = document.createElement('div');
      track.className = 'source-track';

      var fill = document.createElement('div');
      fill.className = 'source-fill';
      fill.style.width = '0%';
      fill.style.background = colors[i % colors.length];

      track.appendChild(fill);

      var valDiv = document.createElement('div');
      valDiv.className = 'source-val';
      valDiv.innerHTML = '\u20B9' + s.amount.toFixed(1) + 'L <span>' + s.pct + '%</span>';

      row.appendChild(nameDiv);
      row.appendChild(track);
      row.appendChild(valDiv);
      container.appendChild(row);

      requestAnimationFrame(function () {
        fill.style.width = (s.amount / maxAmt * 100) + '%';
      });
    });
  })();

  // --------------- Cumulative Revenue Tracker ---------------
  (function () {
    var container = document.getElementById('cumulativeChart');
    if (!container) return;

    var cumTarget = 0, cumActual = 0;
    var cumData = rev.map(function (r) {
      cumTarget += r.target;
      cumActual += r.actual;
      return { month: r.month, cumTarget: cumTarget, cumActual: cumActual };
    });

    var maxCum = Math.max(cumData[cumData.length - 1].cumTarget, cumData[cumData.length - 1].cumActual);

    // Create SVG-like visual with pure DOM bars
    cumData.forEach(function (d) {
      var col = document.createElement('div');
      col.className = 'cum-col';

      var barsWrap = document.createElement('div');
      barsWrap.className = 'cum-bars';

      var targetBar = document.createElement('div');
      targetBar.className = 'cum-bar cum-target';
      targetBar.style.height = '0px';
      targetBar.title = 'Cumulative Target: \u20B9' + d.cumTarget.toFixed(1) + 'L';

      var actualBar = document.createElement('div');
      actualBar.className = 'cum-bar cum-actual';
      actualBar.style.height = '0px';
      actualBar.title = 'Cumulative Actual: \u20B9' + d.cumActual.toFixed(1) + 'L';

      barsWrap.appendChild(targetBar);
      barsWrap.appendChild(actualBar);

      var label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = d.month.replace("'", "\u2019").substring(0, 3);

      col.appendChild(barsWrap);
      col.appendChild(label);
      container.appendChild(col);

      requestAnimationFrame(function () {
        targetBar.style.height = (d.cumTarget / maxCum * 160) + 'px';
        actualBar.style.height = (d.cumActual / maxCum * 160) + 'px';
      });
    });
  })();

  // --------------- Monthly Detail Table ---------------
  (function () {
    var tbody = document.getElementById('revDetailTable');
    var tfoot = document.getElementById('revDetailFoot');
    if (!tbody) return;

    rev.forEach(function (r) {
      var variance = r.actual - r.target;
      var achievement = (r.actual / r.target * 100).toFixed(1);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + r.month + '</td>' +
        '<td>\u20B9' + r.target.toFixed(1) + 'L</td>' +
        '<td>\u20B9' + r.actual.toFixed(1) + 'L</td>' +
        '<td>\u20B9' + r.collected.toFixed(1) + 'L</td>' +
        '<td class="' + (variance >= 0 ? 'positive' : 'negative') + '">' +
          (variance >= 0 ? '+' : '') + variance.toFixed(1) + 'L</td>' +
        '<td><div class="achievement-cell">' +
          '<div class="achievement-bar-track"><div class="achievement-bar-fill' +
          (achievement >= 100 ? ' exceeded' : '') + '" style="width:' +
          Math.min(achievement, 100) + '%"></div></div>' +
          '<span>' + achievement + '%</span></div></td>';
      tbody.appendChild(tr);
    });

    // Footer totals
    var totalVariance = totalActual - totalTarget;
    var footTr = document.createElement('tr');
    footTr.innerHTML =
      '<td><strong>Total</strong></td>' +
      '<td><strong>\u20B9' + totalTarget.toFixed(0) + 'L</strong></td>' +
      '<td><strong>\u20B9' + totalActual.toFixed(1) + 'L</strong></td>' +
      '<td><strong>\u20B9' + totalCollected.toFixed(1) + 'L</strong></td>' +
      '<td class="' + (totalVariance >= 0 ? 'positive' : 'negative') + '"><strong>' +
        (totalVariance >= 0 ? '+' : '') + totalVariance.toFixed(1) + 'L</strong></td>' +
      '<td><strong>' + achievementPct + '%</strong></td>';
    tfoot.appendChild(footTr);
  })();

})();
