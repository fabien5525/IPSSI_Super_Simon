export default class Couleur {
  constructor(id, nom, codeHexa, note) {
    this.id = id;
    this.nom = nom;
    this.codeHexa = codeHexa;
    this.note = note;
  }

  getId = () => {
    return this.id;
  }

  getNom = () => {
    return this.nom;
  }

  getCodeHexa = () => {
    return this.codeHexa;
  }

  getNote = () => {
    return this.note;
  }


  toString = () => {
    return `Id: ${this.id}, Couleur: ${this.nom}, CodeHexa: ${this.codeHexa}`;
  }
}