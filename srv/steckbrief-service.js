'use strict';

const cds = require('@sap/cds');
const { buildBuffer } = require('./lib/pdf-builder');

class SteckbriefService extends cds.ApplicationService {
  async init() {
    const { Foerderprogramme } = this.entities;

    cds.app.get('/pdf/:id', async (req, res) => {
      const data = await SELECT.one
        .from(Foerderprogramme)
        .where({ ID: req.params.id })
        .columns('*', { ref: ['finanzpositionen'], expand: ['*'] });

      if (!data) return res.status(404).send('Not found');

      const buffer = await buildBuffer(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="steckbrief-${data.nummer ?? req.params.id}.pdf"`);
      res.send(buffer);
    });

    return super.init();
  }
}

module.exports = { SteckbriefService };