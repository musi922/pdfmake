'use strict';

const path    = require('path');
const cds     = require('@sap/cds');
const pdfmake = require('pdfmake/js/index');

const FONTS_DIR = path.join(require.resolve('pdfmake/js/index'), '..', '..', 'fonts', 'Roboto');
pdfmake.addFonts({
  Roboto: {
    normal:      `${FONTS_DIR}/Roboto-Regular.ttf`,
    bold:        `${FONTS_DIR}/Roboto-Medium.ttf`,
    italics:     `${FONTS_DIR}/Roboto-Italic.ttf`,
    bolditalics: `${FONTS_DIR}/Roboto-MediumItalic.ttf`,
  },
});
pdfmake.setLocalAccessPolicy(() => true);
pdfmake.setUrlAccessPolicy(() => false);

const { buildSteckbriefDoc } = require('./lib/pdf-builder');

class SteckbriefService extends cds.ApplicationService {
  async init() {
    const { Foerderprogramme } = this.entities;

this.on('generatePDF', Foerderprogramme, async (req) => {
  const { ID } = req.params[0];

  const data = await SELECT.one
    .from(Foerderprogramme, ID)
    .columns('*', { ref: ['finanzpositionen'], expand: ['*'] });

  if (!data) return req.error(404, `Förderprogramm ${ID} nicht gefunden`);

  const buffer = await pdfmake.createPdf(buildSteckbriefDoc(data)).getBuffer();

  const res = req.res;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="steckbrief-${data.nummer ?? ID}.pdf"`);
  res.setHeader('Content-Length', buffer.length);
  res.end(buffer);

  // Tell CAP not to process the return value
  req.reply(null);
});

    return super.init();
  }
}

module.exports = { SteckbriefService };