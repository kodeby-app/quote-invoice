// Quote & Invoice: everything runs in the browser and is stored in localStorage.

const STORAGE_KEY = 'quote-invoice-v1';

const T = {
  en: {
    appName: 'Quote & Invoice', tagline: 'Free. No sign-up. Nothing leaves your browser.',
    quote: 'Quote', invoice: 'Invoice', new: 'New', saved: 'My documents', toInvoice: 'Turn into invoice',
    download: 'Download PDF', document: 'Document', number: 'Number', status: 'Status',
    st_draft: 'Draft', st_sent: 'Sent', st_accepted: 'Accepted', st_paid: 'Paid',
    issueDate: 'Date', dueDate: 'Due date', validUntil: 'Valid until', currency: 'Currency',
    reference: 'Your reference', referencePh: 'Order number, project …',
    client: 'Client', clientName: 'Name or company', contact: 'Contact person', address: 'Address',
    email: 'Email', orgNo: 'Org. number', phone: 'Phone', website: 'Website',
    items: 'Items', description: 'Description', qty: 'Qty', unit: 'Unit', price: 'Unit price',
    vat: 'VAT %', amount: 'Amount', addItem: '+ Add line', remove: 'Remove line',
    notesTitle: 'Notes and terms', notes: 'Note to the client',
    notesPh: 'Thank you for your business!',
    you: 'Your business', youHint: 'Saved for all your documents', bizName: 'Business name',
    bank: 'Bank account', terms: 'Payment terms (days)', vatReg: 'Registered for VAT',
    logo: 'Logo', removeLogo: 'Remove logo',
    backup: 'Backup',
    backupText: 'Your documents are stored only in this browser. Download a backup now and then, or to move your documents to another device.',
    export: 'Download backup', import: 'Restore backup',
    privacy: 'Everything you type stays in this browser. There is no server, no account and no tracking.',
    madeBy: 'An example app by the Kodeby team.', close: 'Close',
    open: 'Open', duplicate: 'Copy', delete: 'Delete', noDocs: 'No documents yet.',
    confirmDelete: 'Delete this document? This cannot be undone.',
    confirmImport: 'Replace everything in this browser with the backup?',
    importFailed: 'That file is not a valid backup.',
    logoTooBig: 'The logo is too large. Please use an image under 1 MB.',
    storageFull: 'Could not save. The browser storage may be full or blocked.',
    subtotal: 'Subtotal', vatLine: 'VAT {rate} %', total: 'Total', totalDue: 'Amount due',
    to: 'To', from: 'From', attn: 'Attn.', orgNoShort: 'Org. no.', vatSuffix: 'VAT',
    payment: 'Payment details', payTo: 'Account', payRef: 'Please mark the payment with',
    quoteValid: 'This quote is valid until {date}.', untitled: 'Untitled',
    defaultUnit: 'hrs', sample: 'Design work', noVat: 'Not registered for VAT',
  },
  nb: {
    appName: 'Tilbud og faktura', tagline: 'Gratis. Ingen innlogging. Ingenting forlater nettleseren.',
    quote: 'Tilbud', invoice: 'Faktura', new: 'Ny', saved: 'Mine dokumenter', toInvoice: 'Gjør om til faktura',
    download: 'Last ned PDF', document: 'Dokument', number: 'Nummer', status: 'Status',
    st_draft: 'Utkast', st_sent: 'Sendt', st_accepted: 'Akseptert', st_paid: 'Betalt',
    issueDate: 'Dato', dueDate: 'Forfallsdato', validUntil: 'Gyldig til', currency: 'Valuta',
    reference: 'Deres referanse', referencePh: 'Ordrenummer, prosjekt …',
    client: 'Kunde', clientName: 'Navn eller firma', contact: 'Kontaktperson', address: 'Adresse',
    email: 'E-post', orgNo: 'Org.nr.', phone: 'Telefon', website: 'Nettside',
    items: 'Linjer', description: 'Beskrivelse', qty: 'Antall', unit: 'Enhet', price: 'Pris',
    vat: 'MVA %', amount: 'Beløp', addItem: '+ Legg til linje', remove: 'Fjern linje',
    notesTitle: 'Merknader og vilkår', notes: 'Melding til kunden',
    notesPh: 'Takk for oppdraget!',
    you: 'Din bedrift', youHint: 'Lagres for alle dokumentene dine', bizName: 'Bedriftsnavn',
    bank: 'Kontonummer', terms: 'Betalingsfrist (dager)', vatReg: 'Registrert i Merverdiavgiftsregisteret',
    logo: 'Logo', removeLogo: 'Fjern logo',
    backup: 'Sikkerhetskopi',
    backupText: 'Dokumentene dine lagres bare i denne nettleseren. Last ned en sikkerhetskopi innimellom, eller for å flytte dokumentene til en annen enhet.',
    export: 'Last ned sikkerhetskopi', import: 'Gjenopprett',
    privacy: 'Alt du skriver blir i denne nettleseren. Ingen server, ingen konto og ingen sporing.',
    madeBy: 'En eksempel-app laget av Kodeby-teamet.', close: 'Lukk',
    open: 'Åpne', duplicate: 'Kopier', delete: 'Slett', noDocs: 'Ingen dokumenter ennå.',
    confirmDelete: 'Slette dette dokumentet? Det kan ikke angres.',
    confirmImport: 'Erstatte alt i denne nettleseren med sikkerhetskopien?',
    importFailed: 'Filen er ikke en gyldig sikkerhetskopi.',
    logoTooBig: 'Logoen er for stor. Bruk et bilde under 1 MB.',
    storageFull: 'Kunne ikke lagre. Lagringen i nettleseren kan være full eller blokkert.',
    subtotal: 'Sum eks. mva.', vatLine: 'MVA {rate} %', total: 'Totalt', totalDue: 'Å betale',
    to: 'Til', from: 'Fra', attn: 'Att.', orgNoShort: 'Org.nr.', vatSuffix: 'MVA',
    payment: 'Betalingsinformasjon', payTo: 'Konto', payRef: 'Merk betalingen med',
    quoteValid: 'Tilbudet gjelder til {date}.', untitled: 'Uten navn',
    defaultUnit: 'timer', sample: 'Designarbeid', noVat: 'Ikke mva-registrert',
  },
};

const LOCALES = { en: 'en-GB', nb: 'nb-NO' };

// ---------- state ----------

let state = load() || freshState();
let current = state.docs.find(d => d.id === state.currentId) || state.docs[0];
if (!current) current = newDoc('invoice');

function freshState() {
  const lang = (navigator.language || '').toLowerCase().match(/^(nb|nn|no)/) ? 'nb' : 'en';
  return {
    version: 1,
    lang,
    profile: {
      name: '', orgNo: '', address: '', email: '', phone: '', website: '',
      bankAccount: '', iban: '', bic: '', paymentDays: 14, vatRegistered: true, logo: '',
    },
    counters: { quote: 0, invoice: 0 },
    docs: [],
    currentId: null,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isValidState(data) ? data : null;
  } catch {
    return null;
  }
}

function isValidState(data) {
  return data && typeof data === 'object' && Array.isArray(data.docs) &&
    data.profile && typeof data.profile === 'object' && data.counters;
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    state.currentId = current.id;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      alert(t('storageFull'));
    }
  }, 250);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function today() {
  const d = new Date();
  return toISODate(d);
}

function toISODate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(iso, days) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + Number(days || 0));
  return toISODate(d);
}

function nextNumber(type) {
  state.counters[type] = (state.counters[type] || 0) + 1;
  const prefix = type === 'quote' ? 'Q' : 'INV';
  return `${prefix}-${new Date().getFullYear()}-${String(state.counters[type]).padStart(3, '0')}`;
}

function blankItem() {
  return { id: uid(), description: '', qty: 1, unit: '', price: 0, vat: state.profile.vatRegistered ? 25 : 0 };
}

function newDoc(type, from) {
  const issueDate = today();
  const doc = {
    id: uid(),
    type,
    number: nextNumber(type),
    status: 'draft',
    issueDate,
    dueDate: addDays(issueDate, type === 'quote' ? 30 : state.profile.paymentDays),
    currency: from?.currency || state.docs[0]?.currency || (state.lang === 'nb' ? 'NOK' : 'EUR'),
    reference: from?.reference || '',
    client: from ? { ...from.client } : { name: '', contact: '', address: '', email: '', orgNo: '' },
    items: from ? from.items.map(i => ({ ...i, id: uid() })) : [blankItem()],
    notes: from?.notes || '',
    createdAt: new Date().toISOString(),
  };
  state.docs.unshift(doc);
  return doc;
}

// ---------- helpers ----------

function t(key, vars) {
  let s = (T[state.lang] && T[state.lang][key]) ?? T.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function num(v) {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function money(n, currency) {
  try {
    return new Intl.NumberFormat(LOCALES[state.lang], { style: 'currency', currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

function plainNumber(n) {
  return new Intl.NumberFormat(LOCALES[state.lang], { maximumFractionDigits: 2 }).format(n);
}

function date(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALES[state.lang], { dateStyle: 'medium' }).format(d);
}

function totals(doc) {
  let subtotal = 0;
  const vatByRate = new Map();
  for (const item of doc.items) {
    const line = round2(num(item.qty) * num(item.price));
    subtotal += line;
    const rate = state.profile.vatRegistered ? num(item.vat) : 0;
    if (rate) vatByRate.set(rate, (vatByRate.get(rate) || 0) + line * rate / 100);
  }
  const vat = [...vatByRate.entries()].sort((a, b) => b[0] - a[0]).map(([rate, amount]) => ({ rate, amount: round2(amount) }));
  const vatSum = vat.reduce((s, v) => s + v.amount, 0);
  return { subtotal: round2(subtotal), vat, total: round2(subtotal + vatSum) };
}

function getPath(path) {
  const [root, ...rest] = path.split('.');
  let obj = root === 'doc' ? current : state.profile;
  for (const key of rest.slice(0, -1)) obj = obj[key];
  return [obj, rest[rest.length - 1]];
}

// ---------- rendering ----------

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

function applyLanguage() {
  document.documentElement.lang = state.lang === 'nb' ? 'nb' : 'en';
  document.title = t('appName');
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#lang').value = state.lang;
}

function fillForm() {
  $$('[data-bind]').forEach(el => {
    const [obj, key] = getPath(el.dataset.bind);
    if (el.type === 'checkbox') el.checked = !!obj[key];
    else el.value = obj[key] ?? '';
  });
  $$('.segmented button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === current.type)));
  $('[data-label="dueDate"]').textContent = current.type === 'quote' ? t('validUntil') : t('dueDate');
  $('#btn-convert').hidden = current.type !== 'quote';
  $('#btn-logo-remove').hidden = !state.profile.logo;
  renderItems();
}

function renderItems() {
  const wrap = $('#items');
  wrap.innerHTML = current.items.map(item => `
    <div class="item" data-id="${esc(item.id)}">
      <input data-field="description" value="${esc(item.description)}" placeholder="${esc(t('sample'))}" aria-label="${esc(t('description'))}">
      <input data-field="qty" inputmode="decimal" value="${esc(item.qty)}" aria-label="${esc(t('qty'))}">
      <input data-field="unit" value="${esc(item.unit)}" placeholder="${esc(t('defaultUnit'))}" aria-label="${esc(t('unit'))}">
      <input data-field="price" inputmode="decimal" value="${esc(item.price)}" aria-label="${esc(t('price'))}">
      <input data-field="vat" inputmode="decimal" list="vat-rates" value="${esc(item.vat)}" aria-label="${esc(t('vat'))}" ${state.profile.vatRegistered ? '' : 'disabled'}>
      <output class="right">${esc(money(round2(num(item.qty) * num(item.price)), current.currency))}</output>
      <button type="button" class="icon" data-remove title="${esc(t('remove'))}" aria-label="${esc(t('remove'))}">×</button>
    </div>`).join('');
}

function updateItemTotals() {
  $$('#items .item').forEach(row => {
    const item = current.items.find(i => i.id === row.dataset.id);
    if (item) row.querySelector('output').textContent = money(round2(num(item.qty) * num(item.price)), current.currency);
  });
}

function lines(text) {
  return esc(text).replace(/\n/g, '<br>');
}

function renderPaper() {
  const doc = current;
  const p = state.profile;
  const tot = totals(doc);
  const isQuote = doc.type === 'quote';
  const title = isQuote ? t('quote') : t('invoice');

  const fromBlock = [
    p.name && `<strong>${esc(p.name)}</strong>`,
    p.address && lines(p.address),
    p.orgNo && `${esc(t('orgNoShort'))} ${esc(p.orgNo)}${p.vatRegistered ? ' ' + esc(t('vatSuffix')) : ''}`,
    p.email && esc(p.email),
    p.phone && esc(p.phone),
    p.website && esc(p.website),
  ].filter(Boolean).join('<br>');

  const c = doc.client;
  const toBlock = [
    c.name && `<strong>${esc(c.name)}</strong>`,
    c.contact && `${esc(t('attn'))} ${esc(c.contact)}`,
    c.address && lines(c.address),
    c.orgNo && `${esc(t('orgNoShort'))} ${esc(c.orgNo)}`,
    c.email && esc(c.email),
  ].filter(Boolean).join('<br>');

  const meta = [
    [t('number'), doc.number],
    [t('issueDate'), date(doc.issueDate)],
    [isQuote ? t('validUntil') : t('dueDate'), date(doc.dueDate)],
    [t('reference'), doc.reference],
  ].filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');

  const rows = doc.items
    .filter(i => i.description || num(i.price) || num(i.qty) !== 1)
    .map(i => `
      <tr>
        <td>${lines(i.description)}</td>
        <td class="num">${esc(plainNumber(num(i.qty)))} ${esc(i.unit)}</td>
        <td class="num">${esc(money(num(i.price), doc.currency))}</td>
        ${p.vatRegistered ? `<td class="num">${esc(plainNumber(num(i.vat)))} %</td>` : ''}
        <td class="num">${esc(money(round2(num(i.qty) * num(i.price)), doc.currency))}</td>
      </tr>`).join('');

  const vatRows = tot.vat.map(v => `<tr><th>${esc(t('vatLine', { rate: plainNumber(v.rate) }))}</th><td>${esc(money(v.amount, doc.currency))}</td></tr>`).join('');

  const pay = !isQuote && (p.bankAccount || p.iban) ? `
    <section class="pay">
      <h3>${esc(t('payment'))}</h3>
      <dl>
        ${p.bankAccount ? `<dt>${esc(t('payTo'))}</dt><dd>${esc(p.bankAccount)}</dd>` : ''}
        ${p.iban ? `<dt>IBAN</dt><dd>${esc(p.iban)}</dd>` : ''}
        ${p.bic ? `<dt>BIC</dt><dd>${esc(p.bic)}</dd>` : ''}
        <dt>${esc(t('dueDate'))}</dt><dd>${esc(date(doc.dueDate))}</dd>
        <dt>${esc(t('totalDue'))}</dt><dd><strong>${esc(money(tot.total, doc.currency))}</strong></dd>
      </dl>
      <p>${esc(t('payRef'))} <strong>${esc(doc.number)}</strong>.</p>
    </section>` : '';

  $('#paper').innerHTML = `
    <header class="paper-head">
      <div>
        ${p.logo ? `<img class="logo" src="${esc(p.logo)}" alt="">` : ''}
        <h1>${esc(title)}</h1>
      </div>
      <dl class="meta">${meta}</dl>
    </header>
    <div class="parties">
      <section><h3>${esc(t('from'))}</h3><p>${fromBlock || '<span class="ph">' + esc(t('you')) + '</span>'}</p></section>
      <section><h3>${esc(t('to'))}</h3><p>${toBlock || '<span class="ph">' + esc(t('client')) + '</span>'}</p></section>
    </div>
    <table class="lines">
      <thead><tr>
        <th>${esc(t('description'))}</th>
        <th class="num">${esc(t('qty'))}</th>
        <th class="num">${esc(t('price'))}</th>
        ${p.vatRegistered ? `<th class="num">${esc(t('vat'))}</th>` : ''}
        <th class="num">${esc(t('amount'))}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table class="totals">
      ${p.vatRegistered ? `<tr><th>${esc(t('subtotal'))}</th><td>${esc(money(tot.subtotal, doc.currency))}</td></tr>${vatRows}` : ''}
      <tr class="grand"><th>${esc(isQuote ? t('total') : t('totalDue'))}</th><td>${esc(money(tot.total, doc.currency))}</td></tr>
    </table>
    ${!p.vatRegistered ? `<p class="small">${esc(t('noVat'))}</p>` : ''}
    ${isQuote && doc.dueDate ? `<p>${esc(t('quoteValid', { date: date(doc.dueDate) }))}</p>` : ''}
    ${doc.notes ? `<p class="notes">${lines(doc.notes)}</p>` : ''}
    ${pay}
  `;
}

function renderAll() {
  applyLanguage();
  fillForm();
  renderPaper();
}

function renderSaved() {
  const list = $('#saved-list');
  if (!state.docs.length) {
    list.innerHTML = `<p>${esc(t('noDocs'))}</p>`;
    return;
  }
  list.innerHTML = `<table class="saved">
    <tbody>${state.docs.map(d => `
      <tr data-id="${esc(d.id)}" ${d.id === current.id ? 'class="active"' : ''}>
        <td><span class="badge ${esc(d.type)}">${esc(t(d.type))}</span></td>
        <td><strong>${esc(d.number)}</strong><br><small>${esc(date(d.issueDate))}</small></td>
        <td>${esc(d.client.name || t('untitled'))}</td>
        <td class="num">${esc(money(totals(d).total, d.currency))}</td>
        <td>${esc(t('st_' + d.status))}</td>
        <td class="row-actions"><div>
          <button type="button" data-act="open">${esc(t('open'))}</button>
          <button type="button" data-act="copy" class="ghost">${esc(t('duplicate'))}</button>
          <button type="button" data-act="delete" class="ghost danger">${esc(t('delete'))}</button>
        </div></td>
      </tr>`).join('')}
    </tbody></table>`;
}

// ---------- events ----------

$('#editor').addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.bind) {
    const [obj, key] = getPath(el.dataset.bind);
    obj[key] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? num(el.value) : el.value;
    if (el.dataset.bind === 'profile.vatRegistered' || el.dataset.bind === 'doc.currency') renderItems();
  } else if (el.dataset.field) {
    const row = el.closest('.item');
    const item = current.items.find(i => i.id === row.dataset.id);
    if (item) {
      item[el.dataset.field] = el.value;
      updateItemTotals();
    }
  }
  renderPaper();
  save();
});

$('#items').addEventListener('click', e => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const id = btn.closest('.item').dataset.id;
  current.items = current.items.filter(i => i.id !== id);
  if (!current.items.length) current.items.push(blankItem());
  renderItems();
  renderPaper();
  save();
});

$('#btn-add-item').addEventListener('click', () => {
  current.items.push(blankItem());
  renderItems();
  renderPaper();
  save();
  $$('#items .item').at(-1)?.querySelector('input')?.focus();
});

$$('.segmented button').forEach(btn => btn.addEventListener('click', () => {
  const type = btn.dataset.type;
  if (type === current.type) return;
  // Switching type on an empty draft just changes it; otherwise start a new document of that type.
  const isEmpty = !current.client.name && current.items.every(i => !i.description && !num(i.price));
  if (isEmpty) {
    state.docs = state.docs.filter(d => d.id !== current.id);
    current = newDoc(type);
  } else {
    current = newDoc(type);
  }
  renderAll();
  save();
}));

$('#btn-new').addEventListener('click', () => {
  current = newDoc(current.type);
  renderAll();
  save();
});

$('#btn-convert').addEventListener('click', () => {
  if (current.type !== 'quote') return;
  if (current.status === 'draft' || current.status === 'sent') current.status = 'accepted';
  current = newDoc('invoice', current);
  renderAll();
  save();
});

$('#btn-print').addEventListener('click', () => {
  const prev = document.title;
  const name = [current.number, current.client.name].filter(Boolean).join(' ');
  document.title = name || prev;
  window.print();
  document.title = prev;
});

$('#lang').addEventListener('change', e => {
  state.lang = e.target.value;
  renderAll();
  save();
});

$('#logo-file').addEventListener('change', e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  if (file.size > 1024 * 1024) {
    alert(t('logoTooBig'));
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.profile.logo = reader.result;
    renderAll();
    save();
  };
  reader.readAsDataURL(file);
});

$('#btn-logo-remove').addEventListener('click', () => {
  state.profile.logo = '';
  renderAll();
  save();
});

const dialog = $('#saved-dialog');
$('#btn-saved').addEventListener('click', () => {
  renderSaved();
  dialog.showModal();
});
dialog.addEventListener('click', e => {
  if (e.target.matches('[data-close]') || e.target === dialog) {
    dialog.close();
    return;
  }
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;
  const doc = state.docs.find(d => d.id === id);
  if (!doc) return;
  if (btn.dataset.act === 'open') {
    current = doc;
    dialog.close();
  } else if (btn.dataset.act === 'copy') {
    current = newDoc(doc.type, doc);
    dialog.close();
  } else if (btn.dataset.act === 'delete') {
    if (!confirm(t('confirmDelete'))) return;
    state.docs = state.docs.filter(d => d.id !== id);
    if (current.id === id) current = state.docs[0] || newDoc('invoice');
    renderSaved();
  }
  renderAll();
  save();
});

$('#btn-export').addEventListener('click', () => {
  state.currentId = current.id;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `quote-invoice-backup-${today()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$('#import-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!isValidState(data)) throw new Error('invalid');
    if (!confirm(t('confirmImport'))) return;
    state = { ...freshState(), ...data, profile: { ...freshState().profile, ...data.profile } };
    current = state.docs.find(d => d.id === state.currentId) || state.docs[0] || newDoc('invoice');
    renderAll();
    save();
  } catch {
    alert(t('importFailed'));
  }
});

renderAll();
save();
