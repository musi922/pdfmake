'use strict';

const fmt = {
  date: (v) => v ? new Date(v).toLocaleDateString('de-DE') : '',
  bool: (v) => v ? 'J' : 'N',
  str:  (v) => v || '',
};

const SECTION1 = [
  { label: 'Bezeichnung Förderprogramm (lang)', key: 'bezeichnungLang' },
  { label: 'Stand',                             key: 'stand', fmt: fmt.date },
  { label: 'Bezeichnung Förderprogramm (kurz)', key: 'bezeichnungKurz' },
  { label: 'Nummer',                            key: 'nummer' },
  { label: 'Ressort',                           key: 'ressort' },
  { label: 'Zugeordnet zum Fachbereich',        key: 'fachbereich' },
];

const SECTION2 = [
  { label: 'Inhalt',          key: 'inhalt' },
  { label: 'Rechtsgrundlage', key: 'rechtsgrundlage' },
  { label: 'Adressat / Kunde',key: 'adressat' },
  { label: 'Zielsetzung',     key: 'zielsetzung' },
];

const SECTION3 = [
  { label: 'Leistungsgrund',       key: 'leistungsgrund' },
  { label: 'Mittelherkunft',       key: 'mittelherkunft' },
  { label: 'Bewilligungsbeginn und -ende', key: '_bewilligung',
    fmt: (_, d) => `von: ${d.bewilligungBeginn ?? ''} bis: ${d.bewilligungEnde ?? ''}` },
  { label: 'Förderfrequenz',       key: 'foerderfrequenz' },
  { label: 'Finanzierungsart',     key: 'finanzierungsart' },
  { label: 'Form der Förderung',   key: 'foerderForm' },
  { label: 'Art der Förderung',    key: 'foerderArt' },
  { label: 'Evaluation durchgeführt?', key: 'evaluationDurchgef', fmt: fmt.bool },
];

module.exports = { SECTION1, SECTION2, SECTION3, fmt };