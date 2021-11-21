import 'bootstrap/dist/css/bootstrap.min.css';
import Couleur from './Couleur.js';
import Scene from './Scene.js';


const couleurTab6 = [
  new Couleur(0, 'Rouge', '#FF0000', 'C4'),
  new Couleur(1, 'Bleu', '#0000FF', 'D4'),
  new Couleur(2, 'Vert', '#00FF00', 'E4'),
  new Couleur(3, 'Jaune', '#FFFF00', 'F4'),
  new Couleur(4, 'Orange', '#FF7F00', 'G4'),
  new Couleur(5, 'Violet', '#7F00FF', 'A5')
];

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