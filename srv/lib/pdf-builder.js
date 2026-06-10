'use strict';

const PdfPrinter = require('pdfmake/src/printer');
const vfs = require('pdfmake/build/vfs_fonts');

const printer = new PdfPrinter({
  Roboto: {
    normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
    bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
    italics: Buffer.from(vfs['Roboto-Italic.ttf'], 'base64'),
    bolditalics: Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64'),
  },
});

const fmt = {
  date: (v) => v ? new Date(v).toLocaleDateString('de-DE') : '',
  bool: (v) => v ? 'J' : 'N',
};

const FIELDS = {
  base: [
    { label: 'Bezeichnung Förderprogramm (lang)', key: 'bezeichnungLang' },
    { label: 'Stand', key: 'stand', fmt: fmt.date },
    { label: 'Bezeichnung Förderprogramm (kurz)', key: 'bezeichnungKurz' },
    { label: 'Nummer', key: 'nummer' },
    { label: 'Ressort', key: 'ressort' },
    { label: 'Zugeordnet zum Fachbereich', key: 'fachbereich' },
  ],
  handlungsfelder: [
    { label: 'Inhalt', key: 'inhalt' },
    { label: 'Rechtsgrundlage', key: 'rechtsgrundlage' },
    { label: 'Adressat / Kunde', key: 'adressat' },
    { label: 'Zielsetzung', key: 'zielsetzung' },
  ],
  weitereInfos: [
    { label: 'Leistungsgrund', key: 'leistungsgrund' },
    { label: 'Mittelherkunft', key: 'mittelherkunft' },
    {
      label: 'Bewilligungsbeginn und -ende', key: '_bewilligung',
      fmt: (_, d) => `von: ${d.bewilligungBeginn ?? ''} bis: ${d.bewilligungEnde ?? ''}`
    },
    { label: 'Förderfrequenz', key: 'foerderfrequenz' },
    { label: 'Finanzierungsart', key: 'finanzierungsart' },
    { label: 'Form der Förderung', key: 'foerderForm' },
    { label: 'Art der Förderung', key: 'foerderArt' },
    { label: 'Evaluation durchgeführt?', key: 'evaluationDurchgef', fmt: fmt.bool },
  ],
};

const row = (label, value) => ({
  text: [{ text: `${label}: `, bold: true }, value || ''],
  margin: [0, 2, 0, 2],
});

const section = (fields, data) =>
  fields.map(({ label, key, fmt: f }) => row(label, f ? f(data[key], data) : (data[key] || '')));

const buildDoc = (data) => ({
  pageSize: 'A4',
  pageMargins: [40, 40, 40, 40],
  defaultStyle: { font: 'Roboto', fontSize: 9 },
  styles: {
    title: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
    heading: { fontSize: 11, bold: true, margin: [0, 6, 0, 4] },
  },
  content: [
    { text: 'Steckbrief Förderprogramm', style: 'title' },
    ...section(FIELDS.base, data),
    { text: '\nHandlungsfelder', style: 'heading' },
    ...section(FIELDS.handlungsfelder, data),
    { text: '\nWeitere Informationen', style: 'heading' },
    ...section(FIELDS.weitereInfos, data),
    { text: '\nFinanzpositionen:', bold: true, margin: [0, 4, 0, 4] },
    {
      table: {
        widths: ['25%', '*'],
        headerRows: 1,
        body: [
          [{ text: 'Nummer', bold: true }, { text: 'Bezeichnung', bold: true }],
          ...(data.finanzpositionen ?? []).map(({ nummer, bezeichnung }) => [nummer ?? '', bezeichnung ?? '']),
        ],
      },
      layout: 'lightHorizontalLines',
    },
  ],
});

const buildBuffer = (data) => new Promise((resolve, reject) => {
  const doc = printer.createPdfKitDocument(buildDoc(data));
  const chunks = [];
  doc.on('data', c => chunks.push(c));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);
  doc.end();
});

module.exports = { buildBuffer };