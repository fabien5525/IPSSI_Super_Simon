import 'animate.css/animate.min.css';
import MicroModal from 'micromodal';
import * as Tone from 'tone';

const debug = true;

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

/**
 * Renvoie une couleur aléatoire en fonction du nombre de couleur disponible 
 * @param {Number} nb Nombre de couleur du jeu
 * @returns {Couleur}
 */
let couleurAleatoire = (nb, couleurTab6) => {
  if ((nb < 0 && nb > 6) || nb === undefined) return -1;

  const id = Math.ceil(Math.random() * nb) - 1;
  return couleurTab6[id];
}

export default class Scene {
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
    //if(debug) console.log(this.theme);
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

    //Ajout du Titre
    let divTitre = document.createElement('p');
    divTitre.innerHTML = "Super Simon";
    divTitre.className = 'display-1 position-absolute top-0 start-50 translate-middle-x mt-5';

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

    this.divScene.appendChild(divTitre);
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
   * Lance le jeu coté logique (algo)
   * @param {Number} reponse Reponse sous forme d'id
   */
  game = (reponse) => {
    //if(debug) console.log('reponse :', reponse);
    if (this.status === 'sonEnCours') return;
    if (debug) console.log("Début jouer couleur");
    this.status = 'sonEnCours';
    if (reponse === undefined) {
      //if(debug) console.log('game : pas de reponse');
      this.memoire = [];
      this.tour = 1;
      this.numRep = 0;
    } else {
      //On joue en fonction de la réponse
      if (reponse !== this.memoire[this.numRep].getId()) {
        //FIN
        if (debug) console.log('GAME OVER');
        this.initFin();
        return;
      }
      this.numRep++;
    }
    if (debug) console.log('state:', this.numRep, this.memoire.length)
    if (this.numRep === this.memoire.length) {
      this.tour++;
      let nouvCouleur = couleurAleatoire(this.nbCouleur, this.couleurTab6);
      this.memoire.push(nouvCouleur);
      setTimeout(this.jouerCouleurs(0));
      this.numRep = 0;
    } else {
      this.status = '';
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
    //if(debug) console.log(this.nbCouleur, this.couleurTab6)
    for (let i = 0; i < this.nbCouleur; i++) {
      let couleur = this.couleurTab6[i];
      let divPartieDeRoue = document.createElement('div');
      divPartieDeRoue.className = `col pid-${i}`;
      divPartieDeRoue.style.minWidth = `15vh`;
      divPartieDeRoue.style.backgroundColor = couleur.getCodeHexa();

      divPartieDeRoue.addEventListener('click', () => {
        if (this.status !== '') return;
        this.jouerSonEtAnimation(divPartieDeRoue, couleur)
        this.game(i);
      });
      divRoue.appendChild(divPartieDeRoue);
    }

    this.divScene.appendChild(bandeau);
    this.divScene.appendChild(divRoue);
    if (debug) console.log('Game ...');
    setTimeout(() => {
      if (debug) console.log('... Starting !');
      console.log(this)
      this.game();
    }, 2000);
  }



  /**
   * Joue les couleurs de la mémoire
   */
  jouerCouleurs = (i) => {
    if (this.memoire.length < 1) return;
    //if(debug) console.log('test', i, i < this.memoire.length)
    if (!(i < this.memoire.length)) {
      if (debug) console.log('Fin jouer couleurs');
      this.status = "";
      return;
    }

    //calcul temps pour l'intervalle
    this.tempsInterval = this.tour < 9 ? (2000 / this.tour) : 250;
    this.tempsInterval += 250;

    //on rejoue les anciennes couleur + la nouvelle
    if (debug) console.log("Memoire joue :", i, this.memoire[i].getNom());

    //son & animation

    let divTemp = this.divScene.querySelector(`.pid-${i}`);
    this.jouerSonEtAnimation(divTemp, this.memoire[i], this.tempsInterval);

    i++;
    if (debug) console.log('attendre: ', this.tempsInterval);
    setTimeout(this.jouerCouleurs(i), this.tempsInterval);
  }



  /**
   * Initilaise la fin de la partie 
   * ainsi que la popup pour rejouer et le score
   */
  initFin = () => {
    this.divScene.innerHTML =
      ``;
    this.status = '';
    //add modal rejouer + montrer le score

    //span score
    let spanScore = document.createElement('span');
    spanScore.innerHTML = '';

    //btn Menu + Rejouer
    let btnMenu = document.createElement('button');
    btnMenu.innerHTML = 'Menu';
    btnMenu.addEventListener('click', () => {
      this.initAll();
    });

    let btnRejouer = document.createElement('button');
    btnRejouer.innerHTML = 'Rejouer';
    btnRejouer.addEventListener('click', () => {
      this.initGame();
    });
  }

  /**
   * Joue le son de la couleur ainsi le flash lumineux corespondant
   * @param {HTMLElement} div div de la couleur de la scène
   * @param {Couleur} couleur couleur qu'il faut jouer
   * @param {Number} this.tempsInterval optionnel (float)
   */
  jouerSonEtAnimation = (div, couleur) => {
    if (!div || !couleur) return;

    // PARTIE SON
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    // Déclenche la note
    synth.triggerAttack(couleur.getNote(), now);
    // Attend avant de l'arreter
    let att = this.tempsInterval ? 0.2 + ((this.tempsInterval - 1000) / 1000) : 0.4;
    if (debug) console.log(att);
    synth.triggerRelease(now + att);

    // PARTIE ANIMATION
    /*
    div.style.opacity = 0;
    div.classList.add('fadeCustom');
    */
  }

}