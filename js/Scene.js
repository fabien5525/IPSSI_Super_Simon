class Scene {
    /**
     * @param {Number} nbCouleur Nombre de couleur du jeu (1 à 6)
     */
    constructor(nbCouleur, couleurTab6) {
        this.divScene = document.createElement('div');
        this.divScene.className = 'Scene';
        document.body.appendChild(this.divScene);
        console.log('salut');
        this.nbCouleur = nbCouleur;
        this.couleurTab6 = couleurTab6;
        initAcceuil();
    }

    /**
     * Initialise la partie coté HTML
     * @param {Number} nbCouleur Nombre de couleur du jeu (1 à 6)
     */
    initGame = (nb) => {
        let divRoue = document.createElement('div');
        for (let i = 0; i < nb; i++) {
            let divPartieDeRoue = document.createElement('div');
            divPartieDeRoue.innerHTML = couleurTab6[nb].getHTML();
            divRoue.appendChild(divPartieDeRoue);
        }
        document.body.innerHTML = "";
        document.body.appendChild(divRoue);
    }

    /**
     * Initialise l'Acceuil coté HTML
     */
    initAcceuil = () => {
        document.body.innerHTML = "Salut";
        //add button play NORMAL / DIFFICILE
    }


}