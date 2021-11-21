import 'bootstrap/dist/css/bootstrap.min.css';
import Couleur from './Couleur.js';
import Scene from './Scene.js';


const couleurTab6 = [
  new Couleur(0, 'Rouge', '#FF0000'),
  new Couleur(1, 'Bleu', '#0000FF'),
  new Couleur(2, 'Vert', '#00FF00'),
  new Couleur(3, 'Jaune', '#FFFF00'),
  new Couleur(4, 'Orange', '#FF7F00'),
  new Couleur(5, 'Violet', '#7F00FF')
];

/**
 * Renvoie une couleur aléatoire en fonction du nombre de couleur disponible 
 * @param {Number} nb Nombre de couleur du jeu
 * @returns {Couleur}
 */
let couleurAleatoire = (nb) => {
  if ((nb < 0 && nb > 6) || nb === undefined) return -1;

  const id = Math.ceil(Math.random() * nb) - 1;
  return couleurTab6[id];
}

let changeSize = () => {
  document.body.style.width = `${window.innerWidth}px`;
  document.body.style.height = `${window.innerHeight}px`;
}

//Attendre que la page est fini de charger
document.addEventListener("DOMContentLoaded", () => {

  window.addEventListener('resize', () => {
    changeSize();
  })
  changeSize();
  let scene = new Scene(1, couleurTab6);
});