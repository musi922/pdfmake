namespace de.foerderung;

using { cuid, managed } from '@sap/cds/common';

entity Foerderprogramm : managed {
  key ID              : UUID;
  nummer               : String(20);
  bezeichnungLang      : String(200);
  bezeichnungKurz      : String(100);
  stand                : Date;
  ressort              : String(50);
  fachbereich          : String(100);
  inhalt               : LargeString;
  rechtsgrundlage      : LargeString;
  adressat             : String(300);
  zielsetzung          : LargeString;
  leistungsgrund       : String(100);
  mittelherkunft       : String(100);
  bewilligungBeginn    : Integer;
  bewilligungEnde      : String(20);
  foerderfrequenz      : String(50);
  finanzierungsart     : String(100);
  foerderForm          : String(50);
  foerderArt           : String(50);
  evaluationDurchgef   : Boolean default false;
  finanzpositionen     : Composition of many Finanzposition on finanzpositionen.foerderprogramm = $self;
}

entity Finanzposition {
key ID              : UUID;
  foerderprogramm : Association to Foerderprogramm;
  nummer          : String(30);
  bezeichnung     : String(300);
}