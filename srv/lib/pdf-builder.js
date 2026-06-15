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

const cell = (content, opts = {}) => ({
  stack: Array.isArray(content) ? content : [content],
  margin: [4, 4, 4, 4],
  ...opts
});

const field = (label, value) => [
  { text: label, bold: true, fontSize: 9 },
  { text: value || '', fontSize: 10.5, margin: [0, 2, 0, 0] }
];

const buildDoc = (data) => ({
  pageSize: 'A4',
  pageMargins: [40, 45, 40, 45],
  defaultStyle: { font: 'Roboto', fontSize: 10.5, color: '#333' },
  info: { title: 'ZPROG_STECKBRIEF_KLEIN', author: 'SAP' },
  content: [
    { text: 'Steckbrief Förderprogramm', fontSize: 18, bold: true, margin: [0, 0, 0, 20] },
    {
      table: {
        widths: ['*', 130],
        body: [[
          cell(field('Bezeichnung Förderprogramm (lang):', data.bezeichnungLang)),
          cell(field('Stand:', fmt.date(data.stand)))
        ]]
      },
      margin: [0, 0, 0, 20]
    },
    {
      table: {
        widths: ['*', 130],
        body: [
          [
            cell(field('Bezeichnung Förderprogramm (kurz):', data.bezeichnungKurz)),
            cell(field('Nummer:', data.nummer))
          ],
          [
            { text: 'Ressort:', bold: true, fontSize: 9, margin: [4, 6, 4, 4] },
            { text: data.ressort || '', fontSize: 10.5, margin: [4, 6, 4, 4] }
          ],
          [
            { text: 'Zugeordnet zum Fachbereich:', bold: true, fontSize: 9, margin: [4, 6, 4, 4] },
            { text: data.fachbereich || '', fontSize: 10.5, margin: [4, 6, 4, 4] }
          ]
        ]
      },
      margin: [0, 0, 0, 20]
    },
    {
      table: {
        widths: ['*'],
        body: [[{ text: 'Handlungsfelder', bold: true, fontSize: 10, margin: [4, 4, 4, 4] }]]
      },
      margin: [0, 0, 0, 15]
    },
    ...[
      { label: 'Inhalt:', key: 'inhalt' },
      { label: 'Rechtsgrundlage:', key: 'rechtsgrundlage' },
      { label: 'Adressat / Kunde:', key: 'adressat' },
      { label: 'Zielsetzung:', key: 'zielsetzung' }
    ].flatMap(s => [
      { text: s.label, bold: true, fontSize: 10, margin: [0, 8, 0, 4] },
      { text: data[s.key] || '', margin: [0, 0, 0, 12], lineHeight: 1.2 }
    ]),
    { text: '', pageBreak: 'before' },
    {
      table: {
        widths: ['35%', '*'],
        body: [
          [{ text: 'Weitere Informationen', bold: true, colSpan: 2, fillColor: '#f3f3f3', margin: [4, 4, 4, 4] }, {}],
          ...[
            ['Leistungsgrund:', data.leistungsgrund],
            ['Mittelherkunft:', data.mittelherkunft],
            ['Bewilligungsbeginn und -ende:', `von: ${data.bewilligungBeginn || ''} bis: ${data.bewilligungEnde || ''}`],
            ['Förderfrequenz:', data.foerderfrequenz],
            ['Finanzierungsart:', data.finanzierungsart],
            ['Form der Förderung:', data.foerderForm],
            ['Art der Förderung:', data.foerderArt],
            ['Evaluation durchgeführt?:', fmt.bool(data.evaluationDurchgef)],
          ].map(([l, v]) => [{ text: l, bold: true, margin: [4, 4, 4, 4] }, { text: v || '', margin: [4, 4, 4, 4] }])
        ]
      },
      margin: [0, 0, 0, 25]
    },
    { text: 'Finanzpositionen:', bold: true, margin: [0, 15, 0, 8], fontSize: 10.5 },
    {
      table: {
        widths: [120, '*'],
        headerRows: 1,
        body: [
          [{ text: 'Nummer', bold: true, alignment: 'center', margin: [4, 4, 4, 4] }, { text: 'Bezeichnung', bold: true, alignment: 'center', margin: [4, 4, 4, 4] }],
          ...(data.finanzpositionen || []).map(f => [
            { text: f.nummer || '', alignment: 'center', margin: [4, 4, 4, 4] },
            { text: f.bezeichnung || '', margin: [4, 4, 4, 4] }
          ])
        ]
      }
    }
  ]
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