/* ==========================================================================
   Headsup B2B — Employee Ticketing / Help Desk
   Self-contained client-side app. Persists to localStorage.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Config
   * ------------------------------------------------------------------ */
  var STORAGE_KEY = 'hb2b_tickets_v1';

  var STATUSES = ['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'];

  var STATUS_META = {
    'Open':        { cls: 'st-open',        swatch: 'var(--blue)' },
    'In Progress': { cls: 'st-in-progress', swatch: 'var(--orange)' },
    'On Hold':     { cls: 'st-on-hold',     swatch: 'var(--text-dim)' },
    'Resolved':    { cls: 'st-resolved',    swatch: 'var(--teal)' },
    'Closed':      { cls: 'st-closed',      swatch: 'var(--green)' }
  };

  var PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

  // SLA target (hours from creation) by priority
  var SLA_HOURS = { 'Low': 168, 'Medium': 72, 'High': 24, 'Urgent': 4 };

  var CATEGORIES = [
    'IT Support', 'HR', 'Payroll', 'Facilities', 'Finance',
    'Sales Ops', 'Procurement', 'Admin', 'Access Request', 'Other'
  ];

  // Employees who can raise tickets (from the org roster)
  var EMPLOYEES = [
    { name: 'Sumit',  dept: 'Sales' },
    { name: 'Ravi',   dept: 'Sales' },
    { name: 'Priya',  dept: 'Procurement' },
    { name: 'Ankit',  dept: 'Procurement' },
    { name: 'Neha',   dept: 'Sales Ops' },
    { name: 'Vikram', dept: 'Finance' },
    { name: 'Deepak', dept: 'Logistics' },
    { name: 'Meera',  dept: 'HR' },
    { name: 'Arjun',  dept: 'Sales' },
    { name: 'Kavita', dept: 'Admin' },
    { name: 'Rohit',  dept: 'Sales Ops' },
    { name: 'Sonal',  dept: 'Marketing' }
  ];

  // Support agents tickets can be assigned to (with their desk)
  var AGENTS = [
    { name: 'Meera',  desk: 'HR / Payroll' },
    { name: 'Kavita', desk: 'Admin / Facilities' },
    { name: 'Vikram', desk: 'Finance' },
    { name: 'Rohit',  desk: 'Sales Ops' },
    { name: 'Deepak', desk: 'IT Support' },
    { name: 'Priya',  desk: 'Procurement' }
  ];

  var AVATAR_COLORS = ['#f97316', '#14b8a6', '#eab308', '#8b5cf6', '#3b82f6', '#22c55e', '#ec4899', '#f43f5e'];

  var HOUR = 3600 * 1000;
  var DAY = 24 * HOUR;

  /* ------------------------------------------------------------------ *
   *  State
   * ------------------------------------------------------------------ */
  var tickets = [];
  var view = 'board';           // 'board' | 'list'
  var editingId = null;         // ticket id being edited in modal, else null
  var openDetailId = null;      // ticket id shown in drawer, else null
  var filters = { q: '', status: '', priority: '', category: '', assignee: '' };

  /* ------------------------------------------------------------------ *
   *  DOM helpers
   * ------------------------------------------------------------------ */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------------ *
   *  Formatting helpers
   * ------------------------------------------------------------------ */
  function initials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function avatarColor(name) {
    var sum = 0;
    for (var i = 0; i < (name || '').length; i++) sum += name.charCodeAt(i);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }
  function avatarHTML(name, extraCls) {
    if (!name) {
      return '<span class="avatar unassigned' + (extraCls ? ' ' + extraCls : '') + '">–</span>';
    }
    return '<span class="avatar' + (extraCls ? ' ' + extraCls : '') +
      '" style="background:' + avatarColor(name) + '">' + esc(initials(name)) + '</span>';
  }
  function priCls(p) { return 'pri-' + p.toLowerCase(); }
  function statusCls(s) { return STATUS_META[s] ? STATUS_META[s].cls : ''; }

  function fmtDate(ts) {
    var d = new Date(ts);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ", '" + String(d.getFullYear()).slice(2);
  }
  function fmtDateTime(ts) {
    var d = new Date(ts);
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12; if (h === 0) h = 12;
    return fmtDate(ts) + ' · ' + h + ':' + (m < 10 ? '0' + m : m) + ampm;
  }
  function relTime(ts) {
    var diff = Date.now() - ts;
    if (diff < 60 * 1000) return 'just now';
    var mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.floor(hrs / 24);
    if (days < 30) return days + 'd ago';
    return fmtDate(ts);
  }
  function dueInfo(t) {
    // returns { label, cls } describing time-to-due (or resolved state)
    if (t.status === 'Resolved' || t.status === 'Closed') {
      return { label: t.status, cls: '' };
    }
    var diff = t.dueAt - Date.now();
    if (diff < 0) {
      var overdueH = Math.round(-diff / HOUR);
      var lbl = overdueH >= 24 ? Math.round(overdueH / 24) + 'd' : overdueH + 'h';
      return { label: 'Overdue ' + lbl, cls: 'overdue' };
    }
    var hrs = diff / HOUR;
    var label = hrs < 24 ? Math.max(1, Math.round(hrs)) + 'h left' : Math.round(hrs / 24) + 'd left';
    return { label: label, cls: hrs < 12 ? 'soon' : '' };
  }

  /* ------------------------------------------------------------------ *
   *  Persistence
   * ------------------------------------------------------------------ */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) { /* storage may be unavailable */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { tickets = JSON.parse(raw); return true; }
    } catch (e) { /* ignore */ }
    return false;
  }

  var counterSeed = 1000;
  function nextId() {
    var max = counterSeed;
    tickets.forEach(function (t) {
      var n = parseInt(String(t.id).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return 'TKT-' + (max + 1);
  }

  /* ------------------------------------------------------------------ *
   *  Seed data (relative to "now" so due/overdue states are realistic)
   * ------------------------------------------------------------------ */
  function seed() {
    var now = Date.now();
    var defs = [
      {
        subject: 'Laptop not connecting to office VPN',
        description: 'Since the update this morning I cannot connect to the VPN from my laptop. Getting error "authentication failed" repeatedly. This is blocking me from accessing the CRM.',
        category: 'IT Support', priority: 'Urgent', status: 'In Progress',
        requester: 'Sumit', assignee: 'Deepak', createdAgo: 5 * HOUR,
        comments: [
          { author: 'Deepak', body: 'Looking into it — can you confirm your VPN client version?', ago: 3 * HOUR, internal: false },
          { author: 'Sumit', body: 'Version 4.2.1. Restarted twice, no luck.', ago: 2 * HOUR, internal: false }
        ]
      },
      {
        subject: 'Reimbursement for Q1 client travel pending',
        description: 'Submitted travel bills for the Pune client visit three weeks ago. Amount is ₹18,400. Still not credited. Can Finance check the status?',
        category: 'Finance', priority: 'High', status: 'Open',
        requester: 'Ravi', assignee: 'Vikram', createdAgo: 30 * HOUR,
        comments: []
      },
      {
        subject: 'Request access to Procurement dashboard',
        description: 'I need read access to the procurement analytics dashboard to prepare the category margin report.',
        category: 'Access Request', priority: 'Medium', status: 'Open',
        requester: 'Neha', assignee: null, createdAgo: 20 * HOUR,
        comments: []
      },
      {
        subject: 'Air conditioning not working — 3rd floor',
        description: 'The AC on the 3rd floor sales bay has been down since yesterday. It is getting difficult to work in the afternoon heat.',
        category: 'Facilities', priority: 'High', status: 'In Progress',
        requester: 'Arjun', assignee: 'Kavita', createdAgo: 26 * HOUR,
        comments: [
          { author: 'Kavita', body: 'Raised with the building maintenance vendor, technician visiting today 4pm.', ago: 6 * HOUR, internal: false }
        ]
      },
      {
        subject: 'Payslip for June shows wrong LTA',
        description: 'My June payslip has the LTA component listed incorrectly. It should be ₹5,000 but shows ₹500.',
        category: 'Payroll', priority: 'Medium', status: 'On Hold',
        requester: 'Priya', assignee: 'Meera', createdAgo: 3 * DAY,
        comments: [
          { author: 'Meera', body: 'Confirmed the discrepancy. Waiting on the payroll vendor to reprocess — expected next cycle.', ago: 1 * DAY, internal: true }
        ]
      },
      {
        subject: 'New joiner onboarding — laptop & email setup',
        description: 'New sales analyst joining Monday. Please arrange a laptop, email account, and CRM login before their start date.',
        category: 'HR', priority: 'Medium', status: 'Open',
        requester: 'Meera', assignee: 'Deepak', createdAgo: 12 * HOUR,
        comments: []
      },
      {
        subject: 'Duplicate invoice raised for vendor Biomass Corp',
        description: 'An invoice appears to have been raised twice for the same PO (BM-2291). Need Finance to void one before payment run.',
        category: 'Finance', priority: 'Urgent', status: 'Open',
        requester: 'Ankit', assignee: null, createdAgo: 2 * HOUR,
        comments: []
      },
      {
        subject: 'Salesforce report export throwing timeout',
        description: 'The monthly GMV export from the CRM times out after ~30 seconds. Was working fine last week.',
        category: 'Sales Ops', priority: 'Medium', status: 'Resolved',
        requester: 'Rohit', assignee: 'Rohit', createdAgo: 4 * DAY,
        comments: [
          { author: 'Rohit', body: 'Optimised the report filters to a single quarter at a time — export now completes in 8s.', ago: 3 * DAY, internal: false }
        ]
      },
      {
        subject: 'Office stationery & printer toner running low',
        description: 'Admin store is out of A4 paper and the 2nd floor printer toner needs replacing.',
        category: 'Facilities', priority: 'Low', status: 'Open',
        requester: 'Sonal', assignee: 'Kavita', createdAgo: 2 * DAY,
        comments: []
      },
      {
        subject: 'Cannot access shared drive folder "Contracts"',
        description: 'Permission denied when opening the Contracts folder on the shared drive. I need it for the vendor agreement renewals.',
        category: 'Access Request', priority: 'High', status: 'In Progress',
        requester: 'Vikram', assignee: 'Deepak', createdAgo: 8 * HOUR,
        comments: []
      },
      {
        subject: 'Update emergency contact details in HR portal',
        description: 'I changed my phone number. Please help update my emergency contact in the HR system.',
        category: 'HR', priority: 'Low', status: 'Closed',
        requester: 'Deepak', assignee: 'Meera', createdAgo: 6 * DAY,
        comments: [
          { author: 'Meera', body: 'Updated in the portal. Please verify on your profile page.', ago: 5 * DAY, internal: false }
        ]
      },
      {
        subject: 'Procurement PO approval workflow stuck',
        description: 'PO #4471 has been sitting in "pending approval" for 4 days. The approver is on leave — can we reroute?',
        category: 'Procurement', priority: 'High', status: 'On Hold',
        requester: 'Ankit', assignee: 'Priya', createdAgo: 4 * DAY,
        comments: []
      }
    ];

    tickets = defs.map(function (d, i) {
      var createdAt = now - d.createdAgo;
      var comments = (d.comments || []).map(function (c, ci) {
        return {
          id: 'c' + i + '_' + ci,
          author: c.author,
          body: c.body,
          at: now - c.ago,
          internal: !!c.internal
        };
      });
      var t = {
        id: 'TKT-' + (1001 + i),
        subject: d.subject,
        description: d.description,
        category: d.category,
        priority: d.priority,
        status: d.status,
        requester: d.requester,
        department: (findEmployee(d.requester) || {}).dept || '',
        assignee: d.assignee,
        createdAt: createdAt,
        updatedAt: comments.length ? comments[comments.length - 1].at : createdAt,
        dueAt: createdAt + SLA_HOURS[d.priority] * HOUR,
        comments: comments,
        activity: [{ at: createdAt, text: 'Ticket created by ' + d.requester }]
      };
      // synthesize a couple of activity entries
      if (d.assignee) t.activity.push({ at: createdAt + 20 * 60000, text: 'Assigned to ' + d.assignee });
      if (d.status !== 'Open') t.activity.push({ at: t.updatedAt, text: 'Status set to ' + d.status });
      return t;
    });
    save();
  }

  function findEmployee(name) {
    for (var i = 0; i < EMPLOYEES.length; i++) if (EMPLOYEES[i].name === name) return EMPLOYEES[i];
    return null;
  }

  /* ------------------------------------------------------------------ *
   *  Filtering
   * ------------------------------------------------------------------ */
  function applyFilters() {
    var q = filters.q.trim().toLowerCase();
    return tickets.filter(function (t) {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.assignee === '__unassigned__') { if (t.assignee) return false; }
      else if (filters.assignee && t.assignee !== filters.assignee) return false;
      if (q) {
        var hay = (t.id + ' ' + t.subject + ' ' + t.description + ' ' +
          t.requester + ' ' + (t.assignee || '') + ' ' + t.category).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  /* ------------------------------------------------------------------ *
   *  Stats
   * ------------------------------------------------------------------ */
  function renderStats() {
    var open = 0, inProgress = 0, unassigned = 0, overdue = 0, resolved7 = 0, resolvedTimes = [];
    var weekAgo = Date.now() - 7 * DAY;
    tickets.forEach(function (t) {
      var active = t.status !== 'Resolved' && t.status !== 'Closed';
      if (active) {
        if (t.status === 'Open') open++;
        if (t.status === 'In Progress') inProgress++;
        if (!t.assignee) unassigned++;
        if (t.dueAt < Date.now()) overdue++;
      }
      if ((t.status === 'Resolved' || t.status === 'Closed') && t.updatedAt >= weekAgo) {
        resolved7++;
        resolvedTimes.push(t.updatedAt - t.createdAt);
      }
    });

    var avgH = resolvedTimes.length
      ? Math.round(resolvedTimes.reduce(function (a, b) { return a + b; }, 0) / resolvedTimes.length / HOUR)
      : 0;
    var avgLabel = avgH >= 24 ? (avgH / 24).toFixed(1) + 'd' : avgH + 'h';

    var activeTotal = open + inProgress + tickets.filter(function (t) { return t.status === 'On Hold'; }).length;

    var cards = [
      { label: 'Active Tickets', value: activeTotal, sub: tickets.length + ' total', cls: 'orange', accent: true },
      { label: 'Open', value: open, sub: 'awaiting triage', cls: '' },
      { label: 'In Progress', value: inProgress, sub: 'being worked', cls: '' },
      { label: 'Unassigned', value: unassigned, sub: 'need an owner', cls: unassigned ? 'red' : '' },
      { label: 'Overdue (SLA)', value: overdue, sub: 'past due target', cls: overdue ? 'red' : 'green' },
      { label: 'Resolved / 7d', value: resolved7, sub: 'avg ' + avgLabel + ' to close', cls: 'teal' }
    ];

    var grid = $('#statGrid');
    grid.innerHTML = '';
    cards.forEach(function (c) {
      var card = el('div', 'stat-card' + (c.accent ? ' accent' : ''));
      card.innerHTML =
        '<div class="stat-label">' + c.label + '</div>' +
        '<div class="stat-value ' + c.cls + '">' + c.value + '</div>' +
        '<div class="stat-sub">' + c.sub + '</div>';
      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   *  Ticket card (board)
   * ------------------------------------------------------------------ */
  function ticketCard(t) {
    var card = el('div', 'ticket-card pri-l-' + t.priority.toLowerCase());
    card.setAttribute('draggable', 'true');
    card.dataset.id = t.id;

    var due = dueInfo(t);
    var showDue = t.status !== 'Resolved' && t.status !== 'Closed';

    card.innerHTML =
      '<div class="tc-top">' +
        '<span class="tc-id">' + esc(t.id) + '</span>' +
        '<span class="badge ' + priCls(t.priority) + '"><span class="dot"></span>' + esc(t.priority) + '</span>' +
      '</div>' +
      '<div class="tc-subject">' + esc(t.subject) + '</div>' +
      '<div class="tc-meta">' +
        '<span class="tc-assignee">' + avatarHTML(t.assignee) +
          '<span>' + esc(t.assignee || 'Unassigned') + '</span></span>' +
        (showDue
          ? '<span class="tc-due ' + due.cls + '">' + esc(due.label) + '</span>'
          : '<span class="cat-chip">' + esc(t.category) + '</span>') +
      '</div>';

    card.addEventListener('click', function () { openDetail(t.id); });
    attachDrag(card);
    return card;
  }

  /* ------------------------------------------------------------------ *
   *  Board render
   * ------------------------------------------------------------------ */
  function renderBoard() {
    var board = $('#boardView');
    board.innerHTML = '';
    var visible = applyFilters();
    var byStatus = {};
    STATUSES.forEach(function (s) { byStatus[s] = []; });
    visible.forEach(function (t) { if (byStatus[t.status]) byStatus[t.status].push(t); });

    STATUSES.forEach(function (status) {
      var meta = STATUS_META[status];
      var col = el('div', 'board-col');
      col.dataset.status = status;

      var head = el('div', 'board-col-head');
      head.innerHTML =
        '<div class="board-col-title"><span class="swatch" style="background:' + meta.swatch + '"></span>' +
          esc(status) + '</div>' +
        '<span class="board-col-count">' + byStatus[status].length + '</span>';
      col.appendChild(head);

      var body = el('div', 'board-col-body');
      if (byStatus[status].length === 0) {
        body.appendChild(el('div', 'col-empty', 'No tickets'));
      } else {
        // most recently updated first
        byStatus[status]
          .sort(function (a, b) { return b.updatedAt - a.updatedAt; })
          .forEach(function (t) { body.appendChild(ticketCard(t)); });
      }
      col.appendChild(body);
      attachDropZone(col, body);
      board.appendChild(col);
    });
  }

  /* ------------------------------------------------------------------ *
   *  List render
   * ------------------------------------------------------------------ */
  function renderList() {
    var body = $('#listBody');
    body.innerHTML = '';
    var visible = applyFilters().sort(function (a, b) { return b.updatedAt - a.updatedAt; });

    if (visible.length === 0) {
      var tr = el('tr');
      var td = el('td');
      td.setAttribute('colspan', '7');
      td.appendChild(el('div', 'empty-state',
        '<div class="es-title">No tickets match</div>' +
        '<div class="es-sub">Try clearing filters or create a new ticket</div>'));
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    visible.forEach(function (t) {
      var due = dueInfo(t);
      var showDue = t.status !== 'Resolved' && t.status !== 'Closed';
      var tr = el('tr');
      tr.innerHTML =
        '<td class="mono">' + esc(t.id) + '</td>' +
        '<td class="td-subject">' + esc(t.subject) +
          '<div class="sub-cat">' + esc(t.category) + '</div></td>' +
        '<td class="hide-sm">' + esc(t.requester) +
          '<div class="sub-cat" style="font-family:var(--font-mono);font-size:0.66rem;color:var(--text-muted)">' +
          esc(t.department) + '</div></td>' +
        '<td><span class="badge ' + priCls(t.priority) + '"><span class="dot"></span>' + esc(t.priority) + '</span></td>' +
        '<td><span class="badge ' + statusCls(t.status) + '">' + esc(t.status) + '</span></td>' +
        '<td class="hide-sm"><span class="tc-assignee">' + avatarHTML(t.assignee) +
          '<span>' + esc(t.assignee || 'Unassigned') + '</span></span></td>' +
        '<td class="hide-sm mono ' + (showDue && due.cls === 'overdue' ? '' : '') + '">' +
          (showDue ? '<span class="tc-due ' + due.cls + '">' + esc(due.label) + '</span>' : esc(t.status)) + '</td>';
      tr.addEventListener('click', function () { openDetail(t.id); });
      body.appendChild(tr);
    });
  }

  function render() {
    renderStats();
    if (view === 'board') { renderBoard(); } else { renderList(); }
    if (openDetailId) renderDrawer();
  }

  /* ------------------------------------------------------------------ *
   *  Drag & drop (board -> change status)
   * ------------------------------------------------------------------ */
  var dragId = null;
  function attachDrag(card) {
    card.addEventListener('dragstart', function (e) {
      dragId = card.dataset.id;
      card.classList.add('dragging');
      if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); }
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('dragging');
      dragId = null;
    });
  }
  function attachDropZone(col, body) {
    col.addEventListener('dragover', function (e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', function (e) {
      if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', function (e) {
      e.preventDefault();
      col.classList.remove('drag-over');
      var id = dragId || (e.dataTransfer && e.dataTransfer.getData('text/plain'));
      var newStatus = col.dataset.status;
      if (id) changeStatus(id, newStatus);
    });
  }

  /* ------------------------------------------------------------------ *
   *  Mutations
   * ------------------------------------------------------------------ */
  function getTicket(id) {
    for (var i = 0; i < tickets.length; i++) if (tickets[i].id === id) return tickets[i];
    return null;
  }

  function changeStatus(id, newStatus, silent) {
    var t = getTicket(id);
    if (!t || t.status === newStatus) return;
    t.status = newStatus;
    t.updatedAt = Date.now();
    t.activity.push({ at: Date.now(), text: 'Status changed to ' + newStatus });
    save();
    render();
    if (!silent) toast(t.id + ' → ' + newStatus);
  }

  function changePriority(id, newPriority) {
    var t = getTicket(id);
    if (!t || t.priority === newPriority) return;
    t.priority = newPriority;
    // recompute due target from creation
    t.dueAt = t.createdAt + SLA_HOURS[newPriority] * HOUR;
    t.updatedAt = Date.now();
    t.activity.push({ at: Date.now(), text: 'Priority set to ' + newPriority });
    save();
    render();
  }

  function changeAssignee(id, newAssignee) {
    var t = getTicket(id);
    if (!t) return;
    var val = newAssignee || null;
    if (t.assignee === val) return;
    t.assignee = val;
    t.updatedAt = Date.now();
    t.activity.push({ at: Date.now(), text: val ? 'Assigned to ' + val : 'Unassigned' });
    save();
    render();
  }

  function addComment(id, body, internal) {
    var t = getTicket(id);
    if (!t || !body.trim()) return;
    var c = {
      id: 'c' + Date.now(),
      author: t.assignee || 'Support Desk',
      body: body.trim(),
      at: Date.now(),
      internal: !!internal
    };
    t.comments.push(c);
    t.updatedAt = Date.now();
    t.activity.push({ at: Date.now(), text: (internal ? 'Internal note' : 'Reply') + ' added' });
    save();
    render();
  }

  function createTicket(data) {
    var now = Date.now();
    var t = {
      id: nextId(),
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      requester: data.requester,
      department: (findEmployee(data.requester) || {}).dept || '',
      assignee: data.assignee || null,
      createdAt: now,
      updatedAt: now,
      dueAt: now + SLA_HOURS[data.priority] * HOUR,
      comments: [],
      activity: [{ at: now, text: 'Ticket created by ' + data.requester }]
    };
    if (t.assignee) t.activity.push({ at: now, text: 'Assigned to ' + t.assignee });
    tickets.push(t);
    save();
    render();
    toast('Created ' + t.id);
    return t;
  }

  function updateTicket(id, data) {
    var t = getTicket(id);
    if (!t) return;
    t.subject = data.subject;
    t.description = data.description;
    t.category = data.category;
    t.priority = data.priority;
    t.requester = data.requester;
    t.department = (findEmployee(data.requester) || {}).dept || '';
    t.assignee = data.assignee || null;
    t.dueAt = t.createdAt + SLA_HOURS[data.priority] * HOUR;
    t.updatedAt = Date.now();
    t.activity.push({ at: Date.now(), text: 'Ticket details updated' });
    save();
    render();
    toast('Updated ' + t.id);
  }

  function deleteTicket(id) {
    tickets = tickets.filter(function (t) { return t.id !== id; });
    save();
    closeDetail();
    render();
    toast('Deleted ' + id);
  }

  /* ------------------------------------------------------------------ *
   *  Modal (new / edit)
   * ------------------------------------------------------------------ */
  function fillSelect(sel, items, valueKey, labelFn, includeBlank) {
    sel.innerHTML = '';
    if (includeBlank) {
      var opt = el('option');
      opt.value = '';
      opt.textContent = includeBlank;
      sel.appendChild(opt);
    }
    items.forEach(function (it) {
      var o = el('option');
      o.value = valueKey ? it[valueKey] : it;
      o.textContent = labelFn ? labelFn(it) : (valueKey ? it[valueKey] : it);
      sel.appendChild(o);
    });
  }

  function openModal(id) {
    editingId = id || null;
    $('#formErr').textContent = '';
    var isEdit = !!id;
    $('#modalTitle').textContent = isEdit ? 'Edit Ticket' : 'New Ticket';
    $('#modalSubmit').textContent = isEdit ? 'Save Changes' : 'Create Ticket';

    if (isEdit) {
      var t = getTicket(id);
      $('#fSubject').value = t.subject;
      $('#fDescription').value = t.description;
      $('#fRequester').value = t.requester;
      $('#fCategory').value = t.category;
      $('#fPriority').value = t.priority;
      $('#fAssignee').value = t.assignee || '';
    } else {
      $('#fSubject').value = '';
      $('#fDescription').value = '';
      $('#fRequester').value = EMPLOYEES[0].name;
      $('#fCategory').value = CATEGORIES[0];
      $('#fPriority').value = 'Medium';
      $('#fAssignee').value = '';
    }
    $('#modalOverlay').classList.add('visible');
    $('#ticketModal').classList.add('visible');
    setTimeout(function () { $('#fSubject').focus(); }, 100);
  }

  function closeModal() {
    editingId = null;
    $('#modalOverlay').classList.remove('visible');
    $('#ticketModal').classList.remove('visible');
  }

  function submitModal(e) {
    e.preventDefault();
    var data = {
      subject: $('#fSubject').value.trim(),
      description: $('#fDescription').value.trim(),
      requester: $('#fRequester').value,
      category: $('#fCategory').value,
      priority: $('#fPriority').value,
      assignee: $('#fAssignee').value
    };
    if (!data.subject) { $('#formErr').textContent = 'Subject is required.'; return; }
    if (!data.description) { $('#formErr').textContent = 'Please add a description.'; return; }

    if (editingId) { updateTicket(editingId, data); }
    else { createTicket(data); }
    closeModal();
  }

  /* ------------------------------------------------------------------ *
   *  Detail drawer
   * ------------------------------------------------------------------ */
  function openDetail(id) {
    openDetailId = id;
    renderDrawer();
    $('#modalOverlay').classList.add('visible');
    $('#detailDrawer').classList.add('visible');
  }
  function closeDetail() {
    openDetailId = null;
    $('#detailDrawer').classList.remove('visible');
    if (!$('#ticketModal').classList.contains('visible')) {
      $('#modalOverlay').classList.remove('visible');
    }
  }

  function renderDrawer() {
    var t = getTicket(openDetailId);
    var drawer = $('#detailDrawer');
    if (!t) { closeDetail(); return; }

    var statusOpts = STATUSES.map(function (s) {
      return '<option value="' + s + '"' + (s === t.status ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
    var priOpts = PRIORITIES.map(function (p) {
      return '<option value="' + p + '"' + (p === t.priority ? ' selected' : '') + '>' + p + '</option>';
    }).join('');
    var assigneeOpts = '<option value="">Unassigned</option>' + AGENTS.map(function (a) {
      return '<option value="' + a.name + '"' + (a.name === t.assignee ? ' selected' : '') +
        '>' + a.name + ' — ' + a.desk + '</option>';
    }).join('');

    // comments
    var commentsHTML = t.comments.length
      ? t.comments.map(function (c) {
          return '<div class="comment' + (c.internal ? ' internal' : '') + '">' +
            avatarHTML(c.author) +
            '<div class="comment-body">' +
              '<div class="comment-head">' +
                '<span class="comment-author">' + esc(c.author) + '</span>' +
                (c.internal ? '<span class="internal-tag">Internal</span>' : '') +
                '<span class="comment-time">' + esc(relTime(c.at)) + '</span>' +
              '</div>' +
              '<div class="comment-text">' + esc(c.body) + '</div>' +
            '</div>' +
          '</div>';
        }).join('')
      : '<div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">No replies yet.</div>';

    // activity
    var activityHTML = t.activity.slice().sort(function (a, b) { return a.at - b.at; }).map(function (a) {
      return '<div class="activity-item">' + esc(a.text) +
        '<span class="activity-time">' + esc(relTime(a.at)) + '</span></div>';
    }).join('');

    var due = dueInfo(t);
    var showDue = t.status !== 'Resolved' && t.status !== 'Closed';

    drawer.innerHTML =
      '<div class="drawer-head">' +
        '<div class="drawer-head-top">' +
          '<span class="drawer-id">' + esc(t.id) + '</span>' +
          '<button class="modal-close" id="drawerClose">&times;</button>' +
        '</div>' +
        '<div class="drawer-subject">' + esc(t.subject) + '</div>' +
        '<div class="drawer-badges">' +
          '<span class="badge ' + statusCls(t.status) + '">' + esc(t.status) + '</span>' +
          '<span class="badge ' + priCls(t.priority) + '"><span class="dot"></span>' + esc(t.priority) + '</span>' +
          '<span class="cat-chip">' + esc(t.category) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-body">' +

        '<div class="drawer-actions">' +
          '<button class="btn btn-sm" id="drawerEdit">Edit</button>' +
          (t.status !== 'Resolved' && t.status !== 'Closed'
            ? '<button class="btn btn-sm" id="drawerResolve">Mark Resolved</button>'
            : '<button class="btn btn-sm" id="drawerReopen">Reopen</button>') +
          '<button class="btn btn-sm btn-ghost" id="drawerDelete" style="margin-left:auto;color:var(--red)">Delete</button>' +
        '</div>' +

        '<div class="detail-block" style="margin-top:22px">' +
          '<div class="detail-block-label">Description</div>' +
          '<div class="detail-desc">' + esc(t.description) + '</div>' +
        '</div>' +

        '<div class="detail-block">' +
          '<div class="detail-block-label">Details</div>' +
          '<div class="meta-grid">' +
            '<div class="meta-item"><div class="mi-label">Requester</div>' +
              '<div class="mi-value">' + avatarHTML(t.requester) + esc(t.requester) +
              ' <span style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.68rem">· ' + esc(t.department) + '</span></div></div>' +
            '<div class="meta-item"><div class="mi-label">Assignee</div>' +
              '<select class="inline-select" id="selAssignee">' + assigneeOpts + '</select></div>' +
            '<div class="meta-item"><div class="mi-label">Status</div>' +
              '<select class="inline-select" id="selStatus">' + statusOpts + '</select></div>' +
            '<div class="meta-item"><div class="mi-label">Priority</div>' +
              '<select class="inline-select" id="selPriority">' + priOpts + '</select></div>' +
            '<div class="meta-item"><div class="mi-label">Created</div>' +
              '<div class="mi-value" style="font-family:var(--font-mono);font-size:0.76rem;color:var(--text-dim)">' + esc(fmtDateTime(t.createdAt)) + '</div></div>' +
            '<div class="meta-item"><div class="mi-label">SLA Due</div>' +
              '<div class="mi-value" style="font-family:var(--font-mono);font-size:0.76rem">' +
              (showDue ? '<span class="tc-due ' + due.cls + '">' + esc(fmtDateTime(t.dueAt)) + ' · ' + esc(due.label) + '</span>'
                       : '<span style="color:var(--text-dim)">' + esc(t.status) + '</span>') + '</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-block">' +
          '<div class="detail-block-label">Conversation</div>' +
          '<div class="thread">' + commentsHTML + '</div>' +
          '<div class="composer">' +
            '<textarea id="commentInput" placeholder="Write a reply or internal note…"></textarea>' +
            '<div class="composer-actions">' +
              '<label class="checkbox-row"><input type="checkbox" id="commentInternal" /> Internal note</label>' +
              '<button class="btn btn-primary btn-sm" id="btnComment">Add</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-block">' +
          '<div class="detail-block-label">Activity</div>' +
          '<div class="activity-log">' + activityHTML + '</div>' +
        '</div>' +

      '</div>';

    // wire drawer controls
    $('#drawerClose').addEventListener('click', closeDetail);
    $('#drawerEdit').addEventListener('click', function () { openModal(t.id); });
    $('#drawerDelete').addEventListener('click', function () {
      if (confirm('Delete ' + t.id + '? This cannot be undone.')) deleteTicket(t.id);
    });
    var resolveBtn = $('#drawerResolve');
    if (resolveBtn) resolveBtn.addEventListener('click', function () { changeStatus(t.id, 'Resolved'); });
    var reopenBtn = $('#drawerReopen');
    if (reopenBtn) reopenBtn.addEventListener('click', function () { changeStatus(t.id, 'Open'); });

    $('#selStatus').addEventListener('change', function () { changeStatus(t.id, this.value); });
    $('#selPriority').addEventListener('change', function () { changePriority(t.id, this.value); });
    $('#selAssignee').addEventListener('change', function () { changeAssignee(t.id, this.value); });

    $('#btnComment').addEventListener('click', function () {
      var input = $('#commentInput');
      var internal = $('#commentInternal').checked;
      if (input.value.trim()) { addComment(t.id, input.value, internal); }
    });
    $('#commentInput').addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        addComment(t.id, this.value, $('#commentInternal').checked);
      }
    });
  }

  /* ------------------------------------------------------------------ *
   *  Toast
   * ------------------------------------------------------------------ */
  var toastTimer;
  function toast(msg, isError) {
    var el = $('#toast');
    el.textContent = msg;
    el.className = 'toast visible' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = 'toast'; }, 2600);
  }

  /* ------------------------------------------------------------------ *
   *  Wiring
   * ------------------------------------------------------------------ */
  function wire() {
    // populate filter + form selects
    fillSelect($('#fRequester'), EMPLOYEES, 'name', function (e) { return e.name + ' (' + e.dept + ')'; });
    fillSelect($('#fCategory'), CATEGORIES);
    var assigneeSel = $('#fAssignee');
    assigneeSel.innerHTML = '<option value="">Unassigned</option>';
    AGENTS.forEach(function (a) {
      var o = el('option'); o.value = a.name; o.textContent = a.name + ' — ' + a.desk;
      assigneeSel.appendChild(o);
    });

    var catFilter = $('#filterCategory');
    CATEGORIES.forEach(function (c) {
      var o = el('option'); o.value = c; o.textContent = c; catFilter.appendChild(o);
    });
    var asgFilter = $('#filterAssignee');
    AGENTS.forEach(function (a) {
      var o = el('option'); o.value = a.name; o.textContent = a.name; asgFilter.appendChild(o);
    });

    // filter events
    $('#searchInput').addEventListener('input', function () { filters.q = this.value; render(); });
    $('#filterStatus').addEventListener('change', function () { filters.status = this.value; render(); });
    $('#filterPriority').addEventListener('change', function () { filters.priority = this.value; render(); });
    $('#filterCategory').addEventListener('change', function () { filters.category = this.value; render(); });
    $('#filterAssignee').addEventListener('change', function () { filters.assignee = this.value; render(); });

    // view toggle
    $('#viewBoard').addEventListener('click', function () { setView('board'); });
    $('#viewList').addEventListener('click', function () { setView('list'); });

    // new ticket + reset
    $('#btnNew').addEventListener('click', function () { openModal(); });
    $('#btnReset').addEventListener('click', function () {
      if (confirm('Reset all tickets to the demo data? Your changes will be lost.')) {
        seed(); render(); toast('Reset to demo data');
      }
    });

    // modal controls
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalCancel').addEventListener('click', closeModal);
    $('#ticketForm').addEventListener('submit', submitModal);

    // overlay closes whichever is open
    $('#modalOverlay').addEventListener('click', function () {
      if ($('#ticketModal').classList.contains('visible')) closeModal();
      if ($('#detailDrawer').classList.contains('visible')) closeDetail();
    });

    // escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if ($('#ticketModal').classList.contains('visible')) closeModal();
        else if ($('#detailDrawer').classList.contains('visible')) closeDetail();
      }
    });
  }

  function setView(v) {
    view = v;
    $('#viewBoard').classList.toggle('active', v === 'board');
    $('#viewList').classList.toggle('active', v === 'list');
    $('#boardView').style.display = v === 'board' ? '' : 'none';
    $('#listView').style.display = v === 'list' ? '' : 'none';
    render();
  }

  /* ------------------------------------------------------------------ *
   *  Init
   * ------------------------------------------------------------------ */
  function init() {
    if (!load() || !Array.isArray(tickets) || tickets.length === 0) {
      seed();
    }
    wire();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
