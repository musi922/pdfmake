using SteckbriefService as service from '../../srv/steckbrief-service';

// ─── List Report ──────────────────────────────────────────────────────────────

annotate service.Foerderprogramme with @(

  UI.SelectionFields: [ nummer, bezeichnungKurz, ressort, stand ],

  UI.LineItem: [
    { $Type: 'UI.DataField', Value: nummer,          Label: 'Nummer'      },
    { $Type: 'UI.DataField', Value: bezeichnungKurz, Label: 'Bezeichnung' },
    { $Type: 'UI.DataField', Value: ressort,         Label: 'Ressort'     },
    { $Type: 'UI.DataField', Value: stand,           Label: 'Stand'       },
  ],
);

// ─── Object Page ──────────────────────────────────────────────────────────────

annotate service.Foerderprogramme with @(

  UI.HeaderInfo: {
    TypeName:       'Förderprogramm',
    TypeNamePlural: 'Förderprogramme',
    Title:          { Value: bezeichnungLang },
    Description:    { Value: nummer          },
  },

  UI.Identification: [],

  UI.HeaderFacets: [
    { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Header' },
  ],

  UI.FieldGroup#Header: {
    Data: [
      { $Type: 'UI.DataField', Value: nummer          },
      { $Type: 'UI.DataField', Value: bezeichnungKurz },
      { $Type: 'UI.DataField', Value: ressort         },
      { $Type: 'UI.DataField', Value: stand           },
      { $Type: 'UI.DataField', Value: fachbereich     },
    ],
  },

  UI.Facets: [
    { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Handlungsfelder',  Label: 'Handlungsfelder'       },
    { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#WeitereInfos',     Label: 'Weitere Informationen' },
    { $Type: 'UI.ReferenceFacet', Target: 'finanzpositionen/@UI.LineItem',   Label: 'Finanzpositionen'      },
  ],

  UI.FieldGroup#Handlungsfelder: {
    Data: [
      { $Type: 'UI.DataField', Value: inhalt          },
      { $Type: 'UI.DataField', Value: rechtsgrundlage },
      { $Type: 'UI.DataField', Value: adressat        },
      { $Type: 'UI.DataField', Value: zielsetzung     },
    ],
  },

  UI.FieldGroup#WeitereInfos: {
    Data: [
      { $Type: 'UI.DataField', Value: leistungsgrund     },
      { $Type: 'UI.DataField', Value: mittelherkunft     },
      { $Type: 'UI.DataField', Value: bewilligungBeginn  },
      { $Type: 'UI.DataField', Value: bewilligungEnde    },
      { $Type: 'UI.DataField', Value: foerderfrequenz    },
      { $Type: 'UI.DataField', Value: finanzierungsart   },
      { $Type: 'UI.DataField', Value: foerderForm        },
      { $Type: 'UI.DataField', Value: foerderArt         },
      { $Type: 'UI.DataField', Value: evaluationDurchgef },
    ],
  },
);

// ─── Field labels ─────────────────────────────────────────────────────────────

annotate service.Foerderprogramme with {
  nummer             @title: 'Nummer';
  bezeichnungLang    @title: 'Bezeichnung (lang)'        @UI.MultiLineText;
  bezeichnungKurz    @title: 'Bezeichnung (kurz)';
  stand              @title: 'Stand';
  ressort            @title: 'Ressort';
  fachbereich        @title: 'Zugeordnet zum Fachbereich';
  inhalt             @title: 'Inhalt'                    @UI.MultiLineText;
  rechtsgrundlage    @title: 'Rechtsgrundlage'           @UI.MultiLineText;
  adressat           @title: 'Adressat / Kunde';
  zielsetzung        @title: 'Zielsetzung'               @UI.MultiLineText;
  leistungsgrund     @title: 'Leistungsgrund';
  mittelherkunft     @title: 'Mittelherkunft';
  bewilligungBeginn  @title: 'Bewilligungsbeginn';
  bewilligungEnde    @title: 'Bewilligungsende';
  foerderfrequenz    @title: 'Förderfrequenz';
  finanzierungsart   @title: 'Finanzierungsart';
  foerderForm        @title: 'Form der Förderung';
  foerderArt         @title: 'Art der Förderung';
  evaluationDurchgef @title: 'Evaluation durchgeführt';
};

// ─── Finanzpositionen sub-table ───────────────────────────────────────────────

annotate service.Finanzpositionen with @(
  UI.LineItem: [
    { $Type: 'UI.DataField', Value: nummer,      Label: 'Nummer'      },
    { $Type: 'UI.DataField', Value: bezeichnung, Label: 'Bezeichnung' },
  ],
);

annotate service.Finanzpositionen with {
  nummer      @title: 'Nummer';
  bezeichnung @title: 'Bezeichnung';
};
