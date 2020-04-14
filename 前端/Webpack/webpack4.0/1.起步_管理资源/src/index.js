import './style.css'
import Icon from './icon.png'

let myIcon = new Image();
myIcon.src = Icon;
myIcon.style.width = '100%';
myIcon.style.height = '100%';
let two = document.getElementsByClassName('two')[0];
two.appendChild(myIcon);