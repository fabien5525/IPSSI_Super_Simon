/**
 * Outils gestion des cookies (setter)
 * @param {*} name Nom de la propriété du cookie
 * @param {*} value Valeur de la propriété du cookie
 */

function setCookie(name, value, days) {
  var expires = "";
  var date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}
/**
 * Outils gestion des cookies (getter)
 * @param {string} name Nom de la propriété du cookie
 * @returns Valeur de la propriété du cookie
 */
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

class Scene {
  /**
   * @param {Array<Couleur>} couleurTab6 Contante des couleurs du jeu
   */
  constructor(id, couleurTab6) {
    this.id = id;
    this.divScene = document.createElement('div');
    this.divScene.className = `scene-${id} w-100 h-100`;
    document.body.appendChild(this.divScene);
    this.couleurTab6 = couleurTab6;
    let th = getCookie('theme');
    this.theme = th ? th : 'default';
    this.initAll();
  }

  initAll = () => {
    //console.log(this.theme);
    setCookie('theme', this.theme);
    this.initAcceuil();
    this.initStyle();
  }

  /**
   * Initialise l'Acceuil coté HTML
   */
  initAcceuil = () => {
    this.divScene.innerHTML = "";
    let divBoutons = document.createElement('div');
    divBoutons.className = 'position-absolute top-50 start-50 translate-middle row';

    //Ajouton boutton NORMAL / DIFFICILE
    let btnNormal = document.createElement('button');
    let btnDifficle = document.createElement('button');
    let btnParametre = document.createElement('button');

    btnNormal.className = this.theme !== 'dark' ? "btn btn-outline-dark" : 'btn btn-outline-light';
    btnNormal.className += ' mb-3';
    btnNormal.innerHTML = "Normal";

    btnDifficle.className = this.theme !== 'dark' ? "btn btn-outline-dark" : 'btn btn-outline-light';
    btnDifficle.innerHTML = "Difficile";

    btnParametre.className = this.theme !== 'dark' ? "btn btn-outline-dark" : 'btn btn-outline-light';
    btnParametre.className += " position-absolute top-0 end-0 m-2";
    btnParametre.innerHTML = `Mode`;

    btnNormal.addEventListener('click', () => {
      this.nbCouleur = 4;
      this.initGame();
    });

    btnDifficle.addEventListener('click', () => {
      this.nbCouleur = 6;
      this.initGame();
    });

    btnParametre.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'default' : 'dark';
      this.initAll();
    });

    divBoutons.appendChild(btnNormal);
    divBoutons.appendChild(btnDifficle);

    this.divScene.appendChild(btnParametre);
    this.divScene.appendChild(divBoutons);
  }

  initStyle = () => {
    if (this.theme === "dark") {
      this.divScene.style.backgroundColor = '#36393f'
      this.divScene.style.color = '#ffffff'
    } else {
      this.divScene.style.backgroundColor = '#f2f3f5'
      this.divScene.style.color = '#000000'
    }

  }

  
  /**
   * Initialise la partie coté HTML
   */
   initGame = () => {
    this.divScene.innerHTML = "";
    let bandeau = document.createElement('div');
    bandeau.className = 'row w-100 h-25 m-0 p-0';
    let divRoue = document.createElement('div');
    divRoue.className = 'row w-100 h-75 m-0 p-0';
    //console.log(this.nbCouleur, this.couleurTab6)
    for (let i = 0; i < this.nbCouleur; i++) {
      let couleur = this.couleurTab6[i];
      let divPartieDeRoue = document.createElement('div');
      divPartieDeRoue.className = `col pid-${i}`;
      divPartieDeRoue.style.minWidth = `15vh`;
      divPartieDeRoue.style.backgroundColor = couleur.getCodeHexa();
      divPartieDeRoue.addEventListener('click',() => {
        let a = divPartieDeRoue.classList.add('animClick')
      });
      divRoue.appendChild(divPartieDeRoue);
    }

    this.divScene.appendChild(bandeau);
    this.divScene.appendChild(divRoue);
  }

}