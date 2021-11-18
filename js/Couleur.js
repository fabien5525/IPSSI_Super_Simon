class Couleur {
    __constructor(id, nom, codeHexa) {
        this.id = id;
        this.nom = nom
        this.codeHexa = codeHexa
    }

    getNom = () => {
        return this.id;
    }

    getNom = () => {
        return this.nom;
    }

    getCodeHexa = () => {
        return this.codeHexa;
    }

    toString = () => {
        return `Id: ${this.id}, Couleur: ${this.rouge}, CodeHexa: ${this.codeHexa}`;
    }
}