'use strict';

const { SECTION1, SECTION2, SECTION3 } = require('./steckbrief-schema');

const labelValue = (label, value) => ({
  text: [{ text: `${label}: `, bold: true }, value || ''],
  margin: [0, 2, 0, 2],
});

const sectionRows = (fields, data) =>
  fields.map(({ label, key, fmt }) =>
    labelValue(label, fmt ? fmt(data[key], data) : (data[key] || ''))
  );

const buildSteckbriefDoc = (data) => ({
  pageSize: 'A4',
  pageMargins: [40, 40, 40, 40],
  content: [
    { text: 'Steckbrief Förderprogramm', style: 'title' },
    ...sectionRows(SECTION1, data),
    { text: '\nHandlungsfelder', style: 'sectionHeader' },
    ...sectionRows(SECTION2, data),
    { text: '\nWeitere Informationen', style: 'sectionHeader' },
    ...sectionRows(SECTION3, data),
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
  styles: {
    title: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
    sectionHeader: { fontSize: 11, bold: true, margin: [0, 6, 0, 4] },
  },
  defaultStyle: { font: 'Roboto', fontSize: 9 },
});

module.exports = { buildSteckbriefDoc };