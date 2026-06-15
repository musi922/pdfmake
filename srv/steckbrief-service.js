const cds = require('@sap/cds');
const { buildBuffer } = require('./lib/pdf-builder');

class SteckbriefService extends cds.ApplicationService {
  async init() {
    const { Foerderprogramme } = this.entities;

    cds.app.get('/pdf/:id', async (req, res) => {
      try {
        const data = await SELECT.one
          .from(Foerderprogramme)
          .where({ ID: req.params.id })
          .columns('*', { ref: ['finanzpositionen'], expand: ['*'] });

        if (!data) return res.status(404).send('Not Found');

        const buffer = await buildBuffer(data);
        const filename = `ZPROG_STECKBRIEF_${data.nummer || data.ID}.pdf`;

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        });

        res.send(buffer);
      } catch (err) {
        res.status(500).send('Internal Server Error');
      }
    });

    return super.init();
  }
}

module.exports = { SteckbriefService };