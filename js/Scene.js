class Scene {
    __constructor() {
        divScene = document.createElement('div');
        divScene.className = 'Scene';
        document.body.appendChild(divScene);
        this.divScene = divScene;
        console.log('salut');
        this.init();
    }

    /**
     * Initialise l'acceuil coté HTML
     */
    init() {
        this.divScene.innerHTML = 'salut';
        
    }
}