// ===== Upload Sheet Logic =====

(function () {
  // --------------- Helpers ---------------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function showStatus(msg, isError) {
    var bar = $('#statusBar');
    bar.textContent = msg;
    bar.className = 'status-bar visible' + (isError ? ' error' : '');
    clearTimeout(bar._timer);
    bar._timer = setTimeout(function () { bar.className = 'status-bar'; }, 3000);
  }

  // --------------- Tab switching ---------------
  $$('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.classList.remove('active'); });
      $$('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      $('#panel-' + btn.dataset.tab).classList.add('active');
    });
  });

  // --------------- Table renderers ---------------

  function makeInput(type, value, placeholder) {
    var inp = document.createElement('input');
    inp.type = type;
    inp.value = value !== undefined && value !== null ? value : '';
    if (placeholder) inp.placeholder = placeholder;
    if (type === 'number') inp.step = 'any';
    return inp;
  }

  function makeDeleteBtn(tr) {
    var btn = document.createElement('button');
    btn.className = 'btn-delete';
    btn.innerHTML = '&times;';
    btn.title = 'Remove row';
    btn.addEventListener('click', function () { tr.remove(); });
    return btn;
  }

  function addMonthlyRow(d) {
    var tbody = $('#tblMonthly tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.month : '', ph: "e.g. Apr'25" },
      { type: 'number', val: d ? d.gmv : '', ph: '0.00' },
      { type: 'number', val: d ? d.gp : '', ph: '0.00' },
      { type: 'number', val: d ? d.txns : '', ph: '0' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  function addTeamRow(d) {
    var tbody = $('#tblTeam tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.name : '', ph: 'Name' },
      { type: 'number', val: d ? d.gp : '', ph: '0.0' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  function addCategoryRow(d) {
    var tbody = $('#tblCategories tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.name : '', ph: 'Category' },
      { type: 'number', val: d ? d.gmv : '', ph: '0.0' },
      { type: 'number', val: d ? d.gp : '', ph: '0.00' },
      { type: 'number', val: d ? d.margin : '', ph: '0.00' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  function addContribRow(d) {
    var tbody = $('#tblContributions tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.name : '', ph: 'Name' },
      { type: 'number', val: d ? d.total : '', ph: '0.0' },
      { type: 'number', val: d ? d.sales : '', ph: '0.0' },
      { type: 'number', val: d ? d.procurement : '', ph: '0.0' },
      { type: 'number', val: d ? d.others : '', ph: '0.0' },
      { type: 'number', val: d ? d.salesOps : '', ph: '0.0' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  function addRevenueRow(d) {
    var tbody = $('#tblRevenue tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.month : '', ph: "e.g. Apr'25" },
      { type: 'number', val: d ? d.target : '', ph: '0.0' },
      { type: 'number', val: d ? d.actual : '', ph: '0.0' },
      { type: 'number', val: d ? d.collected : '', ph: '0.0' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  function addSourceRow(d) {
    var tbody = $('#tblSources tbody');
    var tr = document.createElement('tr');
    var cells = [
      { type: 'text', val: d ? d.source : '', ph: 'Source name' },
      { type: 'number', val: d ? d.amount : '', ph: '0.0' },
      { type: 'number', val: d ? d.pct : '', ph: '0.0' }
    ];
    cells.forEach(function (c) {
      var td = document.createElement('td');
      td.appendChild(makeInput(c.type, c.val, c.ph));
      tr.appendChild(td);
    });
    var tdDel = document.createElement('td');
    tdDel.appendChild(makeDeleteBtn(tr));
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  }

  // --------------- Load existing data ---------------
  if (typeof DATA !== 'undefined') {
    DATA.monthly.forEach(function (d) { addMonthlyRow(d); });
    DATA.team.forEach(function (d) { addTeamRow(d); });
    DATA.categories.forEach(function (d) { addCategoryRow(d); });
    DATA.contributions.forEach(function (d) { addContribRow(d); });
    if (DATA.revenue) DATA.revenue.forEach(function (d) { addRevenueRow(d); });
    if (DATA.revenueSources) DATA.revenueSources.forEach(function (d) { addSourceRow(d); });
  }

  // --------------- Add-row buttons ---------------
  $('#addMonthRow').addEventListener('click', function () { addMonthlyRow(); });
  $('#addTeamRow').addEventListener('click', function () { addTeamRow(); });
  $('#addCatRow').addEventListener('click', function () { addCategoryRow(); });
  $('#addContribRow').addEventListener('click', function () { addContribRow(); });
  $('#addRevenueRow').addEventListener('click', function () { addRevenueRow(); });
  $('#addSourceRow').addEventListener('click', function () { addSourceRow(); });

  // --------------- Read table data ---------------

  function readTable(tableId) {
    var rows = [];
    $$('#' + tableId + ' tbody tr').forEach(function (tr) {
      var inputs = tr.querySelectorAll('input');
      var vals = [];
      inputs.forEach(function (inp) {
        vals.push(inp.type === 'number' ? parseFloat(inp.value) || 0 : inp.value.trim());
      });
      rows.push(vals);
    });
    return rows;
  }

  function collectAllData() {
    var monthly = readTable('tblMonthly').map(function (r) {
      return { month: r[0], gmv: r[1], gp: r[2], txns: r[3] };
    }).filter(function (d) { return d.month; });

    var team = readTable('tblTeam').map(function (r) {
      return { name: r[0], gp: r[1] };
    }).filter(function (d) { return d.name; });

    var categories = readTable('tblCategories').map(function (r) {
      return { name: r[0], gmv: r[1], gp: r[2], margin: r[3] };
    }).filter(function (d) { return d.name; });

    var contributions = readTable('tblContributions').map(function (r) {
      return { name: r[0], total: r[1], sales: r[2], procurement: r[3], others: r[4], salesOps: r[5] };
    }).filter(function (d) { return d.name; });

    var revenue = readTable('tblRevenue').map(function (r) {
      return { month: r[0], target: r[1], actual: r[2], collected: r[3] };
    }).filter(function (d) { return d.month; });

    var revenueSources = readTable('tblSources').map(function (r) {
      return { source: r[0], amount: r[1], pct: r[2] };
    }).filter(function (d) { return d.source; });

    return { monthly: monthly, team: team, categories: categories, contributions: contributions, revenue: revenue, revenueSources: revenueSources };
  }

  // --------------- Export / Save ---------------

  function generateJS(data) {
    var lines = ['// ===== Headsup B2B \u2013 Sales Scorecard FY25-26 Data =====', '', 'var DATA = {'];

    // monthly
    lines.push('  monthly: [');
    data.monthly.forEach(function (d, i) {
      var comma = i < data.monthly.length - 1 ? ',' : '';
      lines.push('    { month: "' + d.month + '", gmv: ' + d.gmv + ', gp: ' + d.gp + ', txns: ' + d.txns + ' }' + comma);
    });
    lines.push('  ],', '');

    // team
    lines.push('  team: [');
    data.team.forEach(function (d, i) {
      var comma = i < data.team.length - 1 ? ',' : '';
      lines.push('    { name: "' + d.name + '", gp: ' + d.gp + ' }' + comma);
    });
    lines.push('  ],', '');

    // categories
    lines.push('  categories: [');
    data.categories.forEach(function (d, i) {
      var comma = i < data.categories.length - 1 ? ',' : '';
      lines.push('    { name: "' + d.name + '", gmv: ' + d.gmv + ', gp: ' + d.gp + ', margin: ' + d.margin + ' }' + comma);
    });
    lines.push('  ],', '');

    // contributions
    lines.push('  // Top 5 contributors breakdown (in Lakhs)');
    lines.push('  contributions: [');
    data.contributions.forEach(function (d, i) {
      var comma = i < data.contributions.length - 1 ? ',' : '';
      lines.push('    { name: "' + d.name + '", total: ' + d.total + ', sales: ' + d.sales +
        ', procurement: ' + d.procurement + ', others: ' + d.others + ', salesOps: ' + d.salesOps + ' }' + comma);
    });
    lines.push('  ],', '');

    // revenue
    lines.push('  // Monthly revenue tracking (in Lakhs)');
    lines.push('  revenue: [');
    data.revenue.forEach(function (d, i) {
      var comma = i < data.revenue.length - 1 ? ',' : '';
      lines.push('    { month: "' + d.month + '", target: ' + d.target + ', actual: ' + d.actual + ', collected: ' + d.collected + ' }' + comma);
    });
    lines.push('  ],', '');

    // revenueSources
    lines.push('  // Revenue by source/channel (in Lakhs)');
    lines.push('  revenueSources: [');
    data.revenueSources.forEach(function (d, i) {
      var comma = i < data.revenueSources.length - 1 ? ',' : '';
      lines.push('    { source: "' + d.source + '", amount: ' + d.amount + ', pct: ' + d.pct + ' }' + comma);
    });
    lines.push('  ]');

    lines.push('};', '');
    return lines.join('\n');
  }

  $('#btnExport').addEventListener('click', function () {
    var data = collectAllData();
    var js = generateJS(data);
    var blob = new Blob([js], { type: 'application/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'scorecard.js';
    a.click();
    URL.revokeObjectURL(a.href);
    showStatus('Exported scorecard.js — place it in data/ folder to update the dashboard');
  });

  // --------------- CSV Download ---------------

  function downloadCSV(filename, headers, rows) {
    var csv = headers.join(',') + '\n';
    rows.forEach(function (r) {
      csv += r.map(function (v) {
        return typeof v === 'string' && v.indexOf(',') > -1 ? '"' + v + '"' : v;
      }).join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showStatus('Downloaded ' + filename);
  }

  $('#dlMonthly').addEventListener('click', function () {
    downloadCSV('monthly.csv', ['Month', 'GMV_Cr', 'GP_Cr', 'Transactions'], readTable('tblMonthly'));
  });
  $('#dlTeam').addEventListener('click', function () {
    downloadCSV('team.csv', ['Name', 'GP_Lakhs'], readTable('tblTeam'));
  });
  $('#dlCategories').addEventListener('click', function () {
    downloadCSV('categories.csv', ['Category', 'GMV_Cr', 'GP_Cr', 'Margin_Pct'], readTable('tblCategories'));
  });
  $('#dlContributions').addEventListener('click', function () {
    downloadCSV('contributions.csv', ['Name', 'Total', 'Sales', 'Procurement', 'Others', 'SalesOps'], readTable('tblContributions'));
  });
  $('#dlRevenue').addEventListener('click', function () {
    downloadCSV('revenue.csv', ['Month', 'Target_Lakhs', 'Actual_Lakhs', 'Collected_Lakhs'], readTable('tblRevenue'));
  });
  $('#dlSources').addEventListener('click', function () {
    downloadCSV('revenue_sources.csv', ['Source', 'Amount_Lakhs', 'Percentage'], readTable('tblSources'));
  });

  // --------------- CSV Upload / Parse ---------------

  function parseCSV(text) {
    var lines = text.trim().split(/\r?\n/);
    var headers = lines[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      var vals = lines[i].split(',').map(function (v) { return v.trim().replace(/^"|"$/g, ''); });
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = vals[idx] || ''; });
      rows.push(obj);
    }
    return { headers: headers, rows: rows };
  }

  function detectAndLoad(csv) {
    var h = csv.headers.join(',');

    if (h.indexOf('gmv') > -1 && h.indexOf('month') > -1) {
      // Monthly
      $('#tblMonthly tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addMonthlyRow({
          month: r.month || r['month'],
          gmv: parseFloat(r.gmv_cr || r.gmv || 0),
          gp: parseFloat(r.gp_cr || r.gp || 0),
          txns: parseInt(r.transactions || r.txns || 0, 10)
        });
      });
      $$('.tab')[0].click();
      showStatus('Loaded ' + csv.rows.length + ' monthly rows');
    } else if (h.indexOf('gp_lakhs') > -1 || (h.indexOf('name') > -1 && h.indexOf('gp') > -1 && h.indexOf('gmv') === -1 && h.indexOf('total') === -1)) {
      // Team
      $('#tblTeam tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addTeamRow({ name: r.name, gp: parseFloat(r.gp_lakhs || r.gp || 0) });
      });
      $$('.tab')[1].click();
      showStatus('Loaded ' + csv.rows.length + ' team rows');
    } else if (h.indexOf('category') > -1 || (h.indexOf('margin') > -1)) {
      // Categories
      $('#tblCategories tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addCategoryRow({
          name: r.category || r.name,
          gmv: parseFloat(r.gmv_cr || r.gmv || 0),
          gp: parseFloat(r.gp_cr || r.gp || 0),
          margin: parseFloat(r.margin_pct || r.margin || 0)
        });
      });
      $$('.tab')[2].click();
      showStatus('Loaded ' + csv.rows.length + ' category rows');
    } else if (h.indexOf('procurement') > -1 || h.indexOf('salesops') > -1 || h.indexOf('total') > -1) {
      // Contributions
      $('#tblContributions tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addContribRow({
          name: r.name,
          total: parseFloat(r.total || 0),
          sales: parseFloat(r.sales || 0),
          procurement: parseFloat(r.procurement || 0),
          others: parseFloat(r.others || 0),
          salesOps: parseFloat(r.salesops || r.sales_ops || 0)
        });
      });
      $$('.tab')[3].click();
      showStatus('Loaded ' + csv.rows.length + ' contribution rows');
    } else if (h.indexOf('target') > -1 && h.indexOf('actual') > -1 && h.indexOf('collected') > -1) {
      // Revenue monthly
      $('#tblRevenue tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addRevenueRow({
          month: r.month || r['month'],
          target: parseFloat(r.target_lakhs || r.target || 0),
          actual: parseFloat(r.actual_lakhs || r.actual || 0),
          collected: parseFloat(r.collected_lakhs || r.collected || 0)
        });
      });
      $$('.tab')[4].click();
      showStatus('Loaded ' + csv.rows.length + ' revenue rows');
    } else if (h.indexOf('source') > -1 && h.indexOf('amount') > -1) {
      // Revenue sources
      $('#tblSources tbody').innerHTML = '';
      csv.rows.forEach(function (r) {
        addSourceRow({
          source: r.source,
          amount: parseFloat(r.amount_lakhs || r.amount || 0),
          pct: parseFloat(r.percentage || r.pct || 0)
        });
      });
      $$('.tab')[5].click();
      showStatus('Loaded ' + csv.rows.length + ' revenue source rows');
    } else {
      showStatus('Could not detect CSV format. Check column headers.', true);
    }
  }

  function handleFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      showStatus('Please upload a .csv file', true);
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var csv = parseCSV(e.target.result);
        detectAndLoad(csv);
      } catch (err) {
        showStatus('Error parsing CSV: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  }

  // File input
  var fileInput = $('#fileInput');
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  // Drag & drop
  var zone = $('#uploadZone');
  zone.addEventListener('click', function () { fileInput.click(); });
  zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function (e) {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

})();
