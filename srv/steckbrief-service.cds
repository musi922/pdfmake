using {de.foerderung as my} from '../db/schema';

service SteckbriefService @(path: '/steckbrief') {

  @odata.draft.enabled
  entity Foerderprogramme as projection on my.Foerderprogramm;

  entity Finanzpositionen as projection on my.Finanzposition;
}
