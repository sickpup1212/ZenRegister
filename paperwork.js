/**
 * Zen Register – Paperwork Module
 * Saves receipts, purchase invoices, and EOD reports to localStorage,
 * keyed by date so the Calendar can retrieve any past day's records.
 */
(function () {
    'use strict';

    const INDEX_KEY = 'zr_days_index';   // JSON array of "YYYY-MM-DD" strings
    const DAY_PREFIX = 'zr_day_';        // + "YYYY-MM-DD" → day record JSON

    // ── Date helper ────────────────────────────────────────────────────────────
    function todayStr() {
        // Use the app's business date (set by confirmEndDay), not wall-clock date
        const appDate = localStorage.getItem('zenRegister_appDate');
        if (appDate) return appDate;
        const d = new Date();
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    // ── Index management ───────────────────────────────────────────────────────
    function getDaysIndex() {
        try { return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function addToIndex(dateStr) {
        const idx = getDaysIndex();
        if (!idx.includes(dateStr)) {
            idx.unshift(dateStr);          // newest first
            try { localStorage.setItem(INDEX_KEY, JSON.stringify(idx)); } catch (e) {}
        }
    }

    // ── Day record CRUD ────────────────────────────────────────────────────────
    function getDayRecord(dateStr) {
        try { return JSON.parse(localStorage.getItem(DAY_PREFIX + dateStr) || 'null'); }
        catch (e) { return null; }
    }

    function ensureDay(dateStr) {
        return getDayRecord(dateStr) || { date: dateStr, receipts: [], invoices: [], eod: null };
    }

    function persistDay(dateStr, record) {
        addToIndex(dateStr);
        try { localStorage.setItem(DAY_PREFIX + dateStr, JSON.stringify(record)); }
        catch (e) { console.warn('PW: localStorage full?', e); }
    }

    // ── Public save API ────────────────────────────────────────────────────────
    function saveReceipt(html, paymentType, total, timestamp) {
        const dateStr = todayStr();
        const rec = ensureDay(dateStr);
        rec.receipts.push({
            id:   'r_' + Date.now(),
            time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: paymentType.toUpperCase(),
            total: total,
            html: html
        });
        persistDay(dateStr, rec);
    }

    function saveInvoice(html, vendor, itemCount, total, timestamp) {
        const dateStr = todayStr();
        const rec = ensureDay(dateStr);
        rec.invoices.push({
            id:        'inv_' + Date.now(),
            time:      timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            vendor:    vendor,
            itemCount: itemCount,
            total:     total,
            html:      html
        });
        persistDay(dateStr, rec);
    }

    function saveEOD(html, timestamp, summary) {
        const dateStr = todayStr();
        const rec = ensureDay(dateStr);
        rec.eod = {
            time:    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            summary: summary,
            html:    html
        };
        persistDay(dateStr, rec);
    }

    // ── Public read API ────────────────────────────────────────────────────────
    window.PW = { saveReceipt, saveInvoice, saveEOD, getDayRecord, getDaysIndex, todayStr };
})();
