// ===== Chart rendering utilities =====

var Charts = {
  /**
   * Render the monthly GMV vs GP bar chart
   */
  renderBarChart: function(containerId, data) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var maxGmv = Math.max.apply(null, data.map(function(d) { return d.gmv; }));

    data.forEach(function(d) {
      var group = document.createElement('div');
      group.className = 'bar-group';

      var valDiv = document.createElement('div');
      valDiv.className = 'bar-val';
      valDiv.textContent = d.gmv.toFixed(1);

      var pair = document.createElement('div');
      pair.className = 'bar-pair';

      var gmvBar = document.createElement('div');
      gmvBar.className = 'bar gmv';
      gmvBar.style.height = '0px';
      gmvBar.title = 'GMV: \u20B9' + d.gmv.toFixed(1) + ' Cr';

      var gpBar = document.createElement('div');
      gpBar.className = 'bar gp';
      gpBar.style.height = '0px';
      gpBar.title = 'GP: \u20B9' + d.gp.toFixed(2) + ' Cr';

      pair.appendChild(gmvBar);
      pair.appendChild(gpBar);

      var label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = d.month.replace("'", "\u2019");

      group.appendChild(valDiv);
      group.appendChild(pair);
      group.appendChild(label);
      container.appendChild(group);

      // Animate after paint
      requestAnimationFrame(function() {
        var gmvH = (d.gmv / maxGmv) * 200;
        var gpH = (d.gp / maxGmv) * 200;
        gmvBar.style.height = gmvH + 'px';
        gpBar.style.height = Math.max(gpH, 4) + 'px';
      });
    });
  },

  /**
   * Render margin horizontal bars
   */
  renderMarginBars: function(containerId, categories) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var maxMargin = Math.max.apply(null, categories.map(function(c) { return c.margin; }));

    categories.forEach(function(cat) {
      var row = document.createElement('div');
      row.className = 'margin-row';

      var catLabel = document.createElement('div');
      catLabel.className = 'margin-cat';
      catLabel.textContent = cat.name;

      var track = document.createElement('div');
      track.className = 'margin-track';

      var fill = document.createElement('div');
      fill.className = 'margin-fill';
      fill.style.width = '0%';

      track.appendChild(fill);

      var pct = document.createElement('div');
      pct.className = 'margin-pct';
      pct.textContent = cat.margin.toFixed(2) + '%';

      row.appendChild(catLabel);
      row.appendChild(track);
      row.appendChild(pct);
      container.appendChild(row);

      requestAnimationFrame(function() {
        fill.style.width = (cat.margin / maxMargin * 100) + '%';
      });
    });
  },

  /**
   * Render contribution breakdown stacked bars
   */
  renderContribBreakdown: function(containerId, contributions) {
    var container = document.getElementById(containerId);
    if (!container) return;

    contributions.forEach(function(c) {
      var row = document.createElement('div');
      row.className = 'contrib-row';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'contrib-name';
      nameDiv.innerHTML = c.name + ' <span>\u20B9' + c.total.toFixed(1) + 'L</span>';

      var bar = document.createElement('div');
      bar.className = 'contrib-bar';

      var segments = [
        { value: c.sales, color: 'var(--orange)' },
        { value: c.procurement, color: 'var(--teal)' },
        { value: c.others, color: 'var(--gold)' },
        { value: c.salesOps, color: '#8b5cf6' }
      ];

      segments.forEach(function(seg) {
        var s = document.createElement('div');
        s.className = 'contrib-seg';
        s.style.width = (seg.value / c.total * 100) + '%';
        s.style.background = seg.color;
        bar.appendChild(s);
      });

      row.appendChild(nameDiv);
      row.appendChild(bar);
      container.appendChild(row);
    });
  }
};
