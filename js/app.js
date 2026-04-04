// ===== App initialization =====

(function() {
  // 1. Bar chart – Monthly GMV vs GP
  Charts.renderBarChart('barChart', DATA.monthly);

  // 2. Team contribution ranking
  var teamList = document.getElementById('teamList');
  DATA.team.forEach(function(member, i) {
    var row = document.createElement('div');
    row.className = 'team-row';

    var rank = document.createElement('div');
    rank.className = 'team-rank' + (i < 3 ? ' gold' : '');
    rank.textContent = (i + 1);

    var name = document.createElement('div');
    name.className = 'team-name';
    name.textContent = member.name;

    var gp = document.createElement('div');
    gp.className = 'team-gp';
    gp.textContent = '\u20B9' + member.gp.toFixed(1) + 'L';

    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(gp);
    teamList.appendChild(row);
  });

  // 3. Category performance table
  var catTable = document.getElementById('catTable');
  DATA.categories.forEach(function(cat) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + cat.name + '</td>' +
      '<td>\u20B9' + cat.gmv.toFixed(1) + ' Cr</td>' +
      '<td>' + cat.margin.toFixed(2) + '%</td>';
    catTable.appendChild(tr);
  });

  // 4. GP Margin bars
  Charts.renderMarginBars('marginBars', DATA.categories);

  // 5. Contribution breakdown
  Charts.renderContribBreakdown('contribBreakdown', DATA.contributions);
})();
