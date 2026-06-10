'use strict';

const cds        = require('@sap/cds');
const PdfPrinter = require('pdfmake/src/printer');
const vfs        = require('pdfmake/build/vfs_fonts');

const { buildSteckbriefDoc } = require('./lib/pdf-builder');

const printer = new PdfPrinter({
  Roboto: {
    normal:      Buffer.from(vfs['Roboto-Regular.ttf'],      'base64'),
    bold:        Buffer.from(vfs['Roboto-Medium.ttf'],       'base64'),
    italics:     Buffer.from(vfs['Roboto-Italic.ttf'],       'base64'),
    bolditalics: Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64'),
  },
});

const buildBuffer = (data) => new Promise((resolve, reject) => {
  const doc    = printer.createPdfKitDocument(buildSteckbriefDoc(data));
  const chunks = [];
  doc.on('data',  c => chunks.push(c));
  doc.on('end',   () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);
  doc.end();
});

class SteckbriefService extends cds.ApplicationService {
  async init() {
    const { Foerderprogramme } = this.entities;

    this.on('generatePDF', Foerderprogramme, async (req) => {
      const { ID } = req.params[0];
      const exists = await SELECT.one.from(Foerderprogramme, ID).columns('ID');
      if (!exists) return req.error(404, `Förderprogramm ${ID} nicht gefunden`);
      return `/pdf/${ID}`;
    });

    cds.app.get('/pdf/:id', async (req, res) => {
      const data = await SELECT.one
        .from(Foerderprogramme)
        .where({ ID: req.params.id })
        .columns('*', { ref: ['finanzpositionen'], expand: ['*'] });

      if (!data) return res.status(404).send('Not found');

      const buffer = await buildBuffer(data);
      res.setHeader('Content-Type',        'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="steckbrief-${data.nummer ?? req.params.id}.pdf"`);
      res.send(buffer);
    });

    return super.init();
  }
}

module.exports = { SteckbriefService };