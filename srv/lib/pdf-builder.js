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

const lblVal = (label, value) => [
  { text: label, bold: true, fontSize: 8 },
  { text: value || '', fontSize: 9, margin: [0, 2, 0, 0] }
];

const buildDoc = (data) => ({
  pageSize: 'A4',
  pageMargins: [40, 40, 40, 40],
  defaultStyle: { font: 'Roboto', fontSize: 9, color: '#333' },
  info: {
    title: 'ZPROG_STECKBRIEF',
    author: 'SAP',
  },
  content: [
    { text: 'Steckbrief Förderprogramm', fontSize: 16, bold: true, margin: [0, 0, 0, 15] },

    // Grid 1: Long Name and Stand
    {
      table: {
        widths: ['*', 120],
        body: [
          [
            { stack: lblVal('Bezeichnung Förderprogramm (lang):', data.bezeichnungLang), margin: [2, 2, 2, 2] },
            { stack: lblVal('Stand:', fmt.date(data.stand)), margin: [2, 2, 2, 2] }
          ]
        ]
      },
      margin: [0, 0, 0, 15]
    },

    // Grid 2: Short Name, Nummer, Ressort, Fachbereich
    {
      table: {
        widths: ['*', 120],
        body: [
          [
            { stack: lblVal('Bezeichnung Förderprogramm (kurz):', data.bezeichnungKurz), margin: [2, 2, 2, 2] },
            { stack: lblVal('Nummer:', data.nummer), margin: [2, 2, 2, 2] }
          ],
          [
            { text: 'Ressort:', bold: true, fontSize: 8, margin: [2, 5, 2, 2] },
            { text: data.ressort || '', fontSize: 9, margin: [2, 5, 2, 2] }
          ],
          [
            { text: 'Zugeordnet zum Fachbereich:', bold: true, fontSize: 8, margin: [2, 5, 2, 2] },
            { text: data.fachbereich || '', fontSize: 9, margin: [2, 5, 2, 2] }
          ]
        ]
      },
      margin: [0, 0, 0, 15]
    },

    // Header: Handlungsfelder
    {
      table: {
        widths: ['*'],
        body: [[{ text: 'Handlungsfelder', bold: true, fontSize: 9, margin: [2, 2, 2, 2] }]]
      },
      margin: [0, 0, 0, 10]
    },

    // Text Content Sections
    { text: 'Inhalt:', bold: true, fontSize: 9, margin: [0, 5, 0, 2] },
    { text: data.inhalt || '', margin: [0, 0, 0, 10], leadingIndent: 0 },

    { text: 'Rechtsgrundlage:', bold: true, fontSize: 9, margin: [0, 5, 0, 2] },
    { text: data.rechtsgrundlage || '', margin: [0, 0, 0, 10] },

    { text: 'Adressat / Kunde:', bold: true, fontSize: 9, margin: [0, 5, 0, 2] },
    { text: data.adressat || '', margin: [0, 0, 0, 10] },

    { text: 'Zielsetzung:', bold: true, fontSize: 9, margin: [0, 5, 0, 2] },
    { text: data.zielsetzung || '', margin: [0, 0, 0, 10] },

    // Page 2
    { text: '', pageBreak: 'before' },

    // Grid: Weitere Informationen
    {
      table: {
        widths: ['35%', '*'],
        body: [
          [{ text: 'Weitere Informationen', bold: true, colSpan: 2, fillColor: '#f3f3f3', margin: [2, 2, 2, 2] }, {}],
          [{ text: 'Leistungsgrund:', bold: true, margin: [2, 2, 2, 2] }, { text: data.leistungsgrund || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Mittelherkunft:', bold: true, margin: [2, 2, 2, 2] }, { text: data.mittelherkunft || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Bewilligungsbeginn und -ende:', bold: true, margin: [2, 2, 2, 2] }, { text: `von: ${data.bewilligungBeginn || ''} bis: ${data.bewilligungEnde || ''}`, margin: [2, 2, 2, 2] }],
          [{ text: 'Förderfrequenz:', bold: true, margin: [2, 2, 2, 2] }, { text: data.foerderfrequenz || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Finanzierungsart:', bold: true, margin: [2, 2, 2, 2] }, { text: data.finanzierungsart || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Form der Förderung:', bold: true, margin: [2, 2, 2, 2] }, { text: data.foerderForm || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Art der Förderung:', bold: true, margin: [2, 2, 2, 2] }, { text: data.foerderArt || '', margin: [2, 2, 2, 2] }],
          [{ text: 'Evaluation durchgeführt?:', bold: true, margin: [2, 2, 2, 2] }, { text: fmt.bool(data.evaluationDurchgef), margin: [2, 2, 2, 2] }],
        ]
      },
      margin: [0, 0, 0, 20]
    },

    // Grid: Finanzpositionen
    { text: 'Finanzpositionen:', bold: true, margin: [0, 10, 0, 5] },
    {
      table: {
        widths: [100, '*'],
        headerRows: 1,
        body: [
          [{ text: 'Nummer', bold: true, alignment: 'center', margin: [2, 2, 2, 2] }, { text: 'Bezeichnung', bold: true, alignment: 'center', margin: [2, 2, 2, 2] }],
          ...(data.finanzpositionen || []).map(f => [
            { text: f.nummer || '', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: f.bezeichnung || '', margin: [2, 2, 2, 2] }
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