import * as Tone from 'tone';

const debug = false;

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
    this.nbDeClick = 0;
    this.initAll();
  }

  /**
   * Renvoie a l'acceuil
   */
  initAll = () => {
    if (debug) console.log(this.theme);
    setCookie('theme', this.theme);
    this.initAcceuil();
    this.initStyle();
  }

  /**
   * Actualise le score coté HTML
   */
  updateScore = () => {
    this.spanScoreNbTour.innerHTML = `Tour : ${this.tour ? this.tour : 1}`;
    this.spanScoreNbClick.innerHTML = `Nombre de clicks : ${this.nbDeClick}`;
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
      this.divScene.style.backgroundColor = '#36393f';
      this.divScene.style.color = '#ffffff';
    } else {
      this.divScene.style.backgroundColor = '#f2f3f5';
      this.divScene.style.color = '#000000';
    }

  }

  /**
   * Lance le jeu coté logique (algo)
   * @param {Number} reponse Reponse sous forme d'id
   */
  game = (reponse) => {
    if (debug) console.log('reponse :', reponse);
    if (this.status === 'sonEnCours') return;
    if (debug) console.log("Début jouer couleur");
    this.spanStatus.innerHTML = 'Veuillez écouter';
    this.status = 'sonEnCours';
    if (reponse === undefined) {
      if (debug) console.log('game : pas de reponse');
      this.memoire = [];
      this.tour = 1;
      this.nbDeClick = 0;
      this.updateScore();
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
      setTimeout(() => { this.jouerCouleurs(0); }, 1500);
      this.numRep = 0;
    } else {
      this.status = '';
      this.spanStatus.innerHTML = `C'est à vous`;
    }
  }


  /**
   * Initialise la partie coté HTML
   */
  initGame = () => {
    this.divScene.innerHTML = "";
    //bandeau de score
    let bandeau = document.createElement('div');
    bandeau.className = 'row w-100 h-25 m-0 pt-3';

    //span score
    this.spanScoreNbTour = document.createElement('span');
    this.spanScoreNbClick = document.createElement('span');
    this.spanScoreNbTour.className = 'col h1 text-center';
    this.spanScoreNbClick.className = 'col h1 text-center';

    this.spanStatus = document.createElement('span');
    this.spanStatus.className = 'col h1 text-center';
    this.updateScore();

    bandeau.appendChild(this.spanScoreNbTour);
    bandeau.appendChild(this.spanStatus);
    bandeau.appendChild(this.spanScoreNbClick);


    //roue des couleurs
    let divRoue = document.createElement('div');
    divRoue.className = 'row w-100 h-75 m-0 p-0';
    if (debug) console.log(this.nbCouleur, this.couleurTab6)
    let sty = document.createElement('style');
    sty.innerHTML = '';
    divRoue.appendChild(sty);
    for (let i = 0; i < this.nbCouleur; i++) {
      let couleur = this.couleurTab6[i];
      let divPartieDeRoue = document.createElement('div');
      divPartieDeRoue.className = `col pid-${i}`;
      divPartieDeRoue.style.minWidth = `15vh`;
      divPartieDeRoue.style.backgroundColor = couleur.getCodeHexa();

      sty.innerHTML +=
        `@keyframes tr-${i} {from {background-color: ${couleur.getCodeHexa()};} to {background-color: white;}}
      `;

      divPartieDeRoue.addEventListener('click', () => {
        if (this.status !== '') return;
        this.nbDeClick++;
        this.updateScore();
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
      this.game();
    }, 2000);
  }



  /**
   * Joue les couleurs de la mémoire
   */
  jouerCouleurs = (i) => {
    if (this.memoire.length < 1) return;
    if (debug) console.log('test', i, i < this.memoire.length)
    if (!(i < this.memoire.length)) {
      if (debug) console.log('Fin jouer couleurs');
      this.spanStatus.innerHTML = `C'est à vous`;
      this.status = "";
      return;
    }

    //calcul temps pour l'intervalle
    this.tempsInterval = this.tour < 9 ? (2750 - this.tour * 250) : 750;
    this.tempsInterval += 250;

    //on rejoue les anciennes couleur + la nouvelle
    if (debug) console.log("Memoire joue :", i, this.memoire[i].getNom());

    //son & animation
    let divTemp = this.divScene.querySelector(`.pid-${this.memoire[i].getId()}`);
    this.jouerSonEtAnimation(divTemp, this.memoire[i]);

    i++;
    if (debug) console.log('attendre: ', this.tempsInterval);
    //console.warn('MAIS POURQUOI SA ATTEND PAS 2.75s ????????????????'); // c'est bon.
    setTimeout(() => { this.jouerCouleurs(i); }, this.tempsInterval);
  }



  /**
   * Initilaise la fin de la partie 
   * ainsi que la popup pour rejouer et le score
   */
  initFin = () => {
    this.status = '';
    //ajout modal rejouer + montrer le score
    this.divScene.innerHTML =
      `
      <div id="myModal" class="modal">
      <!-- Modal content -->
        <div class="modal-content">
          <span class="close text-dark justify-content-end">&times;</span>
          <div class="row">
            <div class="col">
              <span class="text-center text-dark h1">Score</span>
            </div>
          </div>
          <div class="row">
            <div class="col"><span class="text-center h2 text-dark">Tour : ${this.tour}</span></div>
            <div class="col"><span class="text-center h2 text-dark">Nombre de click : ${this.nbDeClick}</span></div>
          </div>
          <div class="row">
            <div class="col divMenu"></div>
            <div class="col divRejouer"></div>
          </div>
        </div>
      </div>`;
    //style modal
    let sty = document.createElement("style");
    sty.innerHTML = `
    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
    
    /* Modal Content/Box */
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 80%; /* Could be more or less, depending on screen size */
    }
    
    /* The Close Button */
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }`;


    //btn Menu + Rejouer
    let btnMenu = document.createElement('button');
    btnMenu.innerHTML = 'Menu';
    btnMenu.className = 'btn btn-dark d-flex justify-content-center';
    btnMenu.addEventListener('click', () => {
      this.initAll();
    });

    let btnRejouer = document.createElement('button');
    btnRejouer.innerHTML = 'Rejouer';
    btnRejouer.className = 'btn btn-dark d-flex justify-content-center';
    btnRejouer.addEventListener('click', () => {
      this.initGame();
    });

    this.divScene.querySelector(".divMenu").appendChild(btnMenu);
    this.divScene.querySelector(".divRejouer").appendChild(btnRejouer);

    this.divScene.querySelector('#myModal').style.display = 'block';
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
    synth.triggerRelease(now + 1);

    // PARTIE ANIMATION
    if (debug) console.log('animation :', couleur.getId(), div);
    div.style.animation = `tr-${couleur.getId()} 1s`;
    setTimeout(() => { div.style.animation = ''; }, 1000);
  }
}

/*
  Commentaire :

  Je suis désolé pour se code qui est assez dur à comprendre,
  J'aurais du m'orienter vers du ReactJs mais je pensais que se serais plus
  rapide / simple en javascript natif (ce qui est surement pas le cas :/).
*/