/**
 * Zen Register – Calendar & Paperwork Viewer
 * Month-grid calendar for browsing historical day records.
 * Document viewer with print support.
 */
(function () {
    'use strict';

    const MONTHS = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];

    // ── App-date helper (business date stored by app.js) ──────────────────────
    function getAppDate() {
        const stored = localStorage.getItem('zenRegister_appDate');
        if (stored) {
            const p = stored.split('-');
            return new Date(+p[0], +p[1] - 1, +p[2]);
        }
        return new Date();
    }
    function getAppDateIso() {
        const d = getAppDate();
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    // ── Module state ───────────────────────────────────────────────────────────
    const cs = {               // calendar state
        year:  new Date().getFullYear(),
        month: new Date().getMonth(),   // 0-based
        selectedDate: null
    };

    let _docs = [];            // temp store for current day-panel documents

    // ── DOM element cache ──────────────────────────────────────────────────────
    const el = {};

    // ── Open / close calendar ──────────────────────────────────────────────────
    function openCalendarModal() {
        const appNow = getAppDate();
        cs.year  = appNow.getFullYear();
        cs.month = appNow.getMonth();
        cs.selectedDate = null;
        renderCalendar();
        el.dayPanel.innerHTML = '<div class="cal-no-day">\u2190 Select a day to view its records</div>';
        el.calModal.classList.add('active');
    }

    function closeCalendarModal() {
        el.calModal.classList.remove('active');
    }

    // ── Month navigation ───────────────────────────────────────────────────────
    function prevMonth() {
        if (cs.month === 0) { cs.month = 11; cs.year--; }
        else cs.month--;
        renderCalendar();
    }

    function nextMonth() {
        const now = getAppDate();
        if (cs.year === now.getFullYear() && cs.month === now.getMonth()) return;
        if (cs.month === 11) { cs.month = 0; cs.year++; }
        else cs.month++;
        renderCalendar();
    }

    // ── Calendar grid ──────────────────────────────────────────────────────────
    function renderCalendar() {
        el.monthLabel.textContent = MONTHS[cs.month] + ' ' + cs.year;

        const now = getAppDate();
        const isCurrent = cs.year === now.getFullYear() && cs.month === now.getMonth();
        el.calNext.disabled = isCurrent;

        const firstDow    = new Date(cs.year, cs.month, 1).getDay();
        const daysInMonth = new Date(cs.year, cs.month + 1, 0).getDate();
        const todayIso    = getAppDateIso();

        // Pre-load activity data for this month
        const monthPrefix = cs.year + '-' + String(cs.month + 1).padStart(2, '0');
        const active = {};
        PW.getDaysIndex().forEach(d => {
            if (d.startsWith(monthPrefix)) active[d] = PW.getDayRecord(d);
        });

        let html = '';
        for (let i = 0; i < firstDow; i++) html += '<div class="cal-day cal-empty"></div>';

        for (let d = 1; d <= daysInMonth; d++) {
            const iso = cs.year + '-' +
                        String(cs.month + 1).padStart(2, '0') + '-' +
                        String(d).padStart(2, '0');
            const rec      = active[iso] || null;
            const isToday  = iso === todayIso;
            const isSel    = iso === cs.selectedDate;
            const isFuture = iso > todayIso;

            let dots = '';
            if (rec) {
                if (rec.receipts && rec.receipts.length)
                    dots += '<span class="cal-dot dot-receipt" title="Receipts"></span>';
                if (rec.invoices && rec.invoices.length)
                    dots += '<span class="cal-dot dot-invoice" title="Invoices"></span>';
                if (rec.eod)
                    dots += '<span class="cal-dot dot-eod" title="EOD Report"></span>';
            }

            const cls = [
                'cal-day',
                isToday  ? 'cal-today'    : '',
                isSel    ? 'cal-selected' : '',
                isFuture ? 'cal-future'   : '',
                rec && !isFuture ? 'cal-has-data' : ''
            ].filter(Boolean).join(' ');

            const click = isFuture ? '' : 'data-date="' + iso + '"';
            html += '<div class="' + cls + '" ' + click + '>' +
                    d +
                    (dots ? '<div class="cal-dots">' + dots + '</div>' : '') +
                    '</div>';
        }

        el.calGrid.innerHTML = html;
    }

    // ── Day-panel render ───────────────────────────────────────────────────────
    function selectDay(iso) {
        cs.selectedDate = iso;
        renderCalendar();
        renderDayPanel(iso);
    }

    function renderDayPanel(iso) {
        _docs = [];

        if (!iso) {
            el.dayPanel.innerHTML = '<div class="cal-no-day">\u2190 Select a day to view its records</div>';
            return;
        }

        // Build a local-timezone date display
        const parts = iso.split('-');
        const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        const label = d.toLocaleDateString([], { weekday:'long', year:'numeric', month:'long', day:'numeric' });

        const rec = PW.getDayRecord(iso);
        const hasReceipts = rec && rec.receipts && rec.receipts.length;
        const hasInvoices = rec && rec.invoices && rec.invoices.length;
        const hasEod      = rec && rec.eod;

        if (!hasReceipts && !hasInvoices && !hasEod) {
            el.dayPanel.innerHTML =
                '<div class="cal-day-title">' + label + '</div>' +
                '<div class="cal-no-records">No records for this day.</div>';
            return;
        }

        let html = '<div class="cal-day-title">' + label + '</div>';

        // ── Receipts ──
        if (hasReceipts) {
            const total = rec.receipts.reduce(function(s, r) { return s + r.total; }, 0);
            html += '<div class="cal-section">' +
                    '<div class="cal-section-hdr">' +
                    '<span class="cal-sect-icon dot-receipt-icon">\u25cf</span>' +
                    'Receipts <span class="cal-sect-count">(' + rec.receipts.length + ')</span>' +
                    '<span class="cal-sect-total">$' + total.toFixed(2) + '</span>' +
                    '</div><div class="cal-doc-list">';
            rec.receipts.forEach(function(r) {
                var idx = _docs.length;
                _docs.push({ html: r.html, title: 'Receipt \u2014 ' + r.time + ' ' + r.type });
                html += '<div class="cal-doc-row" data-doc="' + idx + '">' +
                        '<span class="cal-doc-time">' + r.time + '</span>' +
                        '<span class="cal-doc-tag tag-' + r.type.toLowerCase() + '">' + r.type + '</span>' +
                        '<span class="cal-doc-amt">$' + r.total.toFixed(2) + '</span>' +
                        '<button class="cal-view-btn">View</button>' +
                        '</div>';
            });
            html += '</div></div>';
        }

        // ── Invoices ──
        if (hasInvoices) {
            const total = rec.invoices.reduce(function(s, inv) { return s + inv.total; }, 0);
            html += '<div class="cal-section">' +
                    '<div class="cal-section-hdr">' +
                    '<span class="cal-sect-icon dot-invoice-icon">\u25cf</span>' +
                    'Purchase Invoices <span class="cal-sect-count">(' + rec.invoices.length + ')</span>' +
                    '<span class="cal-sect-total">$' + total.toFixed(2) + '</span>' +
                    '</div><div class="cal-doc-list">';
            rec.invoices.forEach(function(inv) {
                var idx = _docs.length;
                _docs.push({ html: inv.html, title: 'Invoice \u2014 ' + inv.vendor + ' ' + inv.time });
                html += '<div class="cal-doc-row" data-doc="' + idx + '">' +
                        '<span class="cal-doc-time">' + inv.time + '</span>' +
                        '<span class="cal-doc-vendor">' + inv.vendor + '</span>' +
                        '<span class="cal-doc-amt">$' + inv.total.toFixed(2) + '</span>' +
                        '<button class="cal-view-btn">View</button>' +
                        '</div>';
            });
            html += '</div></div>';
        }

        // ── EOD ──
        if (hasEod) {
            var idx = _docs.length;
            _docs.push({ html: rec.eod.html, title: 'End of Day \u2014 ' + iso });
            html += '<div class="cal-section">' +
                    '<div class="cal-section-hdr">' +
                    '<span class="cal-sect-icon dot-eod-icon">\u25cf</span>' +
                    'End of Day Report' +
                    '<span class="cal-doc-time" style="margin-left:auto">' + rec.eod.time + '</span>' +
                    '</div><div class="cal-doc-list">' +
                    '<div class="cal-doc-row" data-doc="' + idx + '">' +
                    '<span class="cal-doc-vendor">Daily Summary</span>' +
                    '<button class="cal-view-btn">View</button>' +
                    '</div></div></div>';
        }

        el.dayPanel.innerHTML = html;
    }

    // ── Document viewer ────────────────────────────────────────────────────────
    function openDocViewer(docObj) {
        el.docTitle.textContent  = docObj.title;
        el.docBody.innerHTML     = docObj.html;
        el.docViewer.classList.add('active');
    }

    function closeDocViewer() {
        el.docViewer.classList.remove('active');
    }

    function printDocument() {
        var content = el.docBody.innerHTML;
        var win = window.open('', '_blank');
        win.document.write(
            '<!DOCTYPE html><html><head><title>Zen Register</title>' +
            '<style>' +
            'body{font-family:monospace;padding:24px;max-width:680px;margin:0 auto;color:#111}' +
            'h2,h3{margin:0 0 8px}' +
            '.pw-doc-header{text-align:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #333}' +
            '.pw-doc-title{font-size:1.3em;font-weight:bold;letter-spacing:.1em}' +
            '.pw-doc-meta{font-size:.85em;color:#555;margin-top:4px}' +
            '.pw-section{margin:14px 0}' +
            '.pw-section h3{font-size:.95em;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #ccc;padding-bottom:4px}' +
            'table{width:100%;border-collapse:collapse;font-size:.9em}' +
            'th,td{padding:4px 8px;text-align:left;border-bottom:1px solid #eee}' +
            'th{background:#f5f5f5;font-weight:600}' +
            '.pw-total-row td{font-weight:bold;border-top:2px solid #333}' +
            '.pw-right{text-align:right}' +
            '.pw-doc-footer{text-align:center;margin-top:20px;font-size:.8em;color:#888;border-top:1px solid #ddd;padding-top:8px}' +
            '.pw-eod-section{margin:12px 0}' +
            '</style></head><body>' + content + '</body></html>'
        );
        win.document.close();
        win.print();
    }

    // ── Initialise DOM wiring ──────────────────────────────────────────────────
    function init() {
        el.btnCalendar = document.getElementById('btnCalendar');
        el.calModal    = document.getElementById('calendarModal');
        el.calClose    = document.getElementById('calendarClose');
        el.calPrev     = document.getElementById('calPrev');
        el.calNext     = document.getElementById('calNext');
        el.monthLabel  = document.getElementById('calMonthLabel');
        el.calGrid     = document.getElementById('calGrid');
        el.dayPanel    = document.getElementById('calDayPanel');
        el.docViewer   = document.getElementById('docViewer');
        el.docTitle    = document.getElementById('docViewerTitle');
        el.docBody     = document.getElementById('docViewerBody');
        el.docClose    = document.getElementById('docViewerClose');
        el.docPrint    = document.getElementById('docPrintBtn');

        el.btnCalendar.addEventListener('click', openCalendarModal);
        el.calClose.addEventListener('click', closeCalendarModal);
        el.calModal.addEventListener('click', function(e) {
            if (e.target === el.calModal) closeCalendarModal();
        });
        el.calPrev.addEventListener('click', prevMonth);
        el.calNext.addEventListener('click', nextMonth);

        // Day grid – delegated click on cal-day cells
        el.calGrid.addEventListener('click', function(e) {
            var cell = e.target.closest('[data-date]');
            if (cell) selectDay(cell.dataset.date);
        });

        // Day panel – delegated click on doc rows
        el.dayPanel.addEventListener('click', function(e) {
            var row = e.target.closest('[data-doc]');
            if (row !== null) openDocViewer(_docs[parseInt(row.dataset.doc, 10)]);
        });

        el.docClose.addEventListener('click', closeDocViewer);
        el.docViewer.addEventListener('click', function(e) {
            if (e.target === el.docViewer) closeDocViewer();
        });
        el.docPrint.addEventListener('click', printDocument);
    }

    init();

})();
