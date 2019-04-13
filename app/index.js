import {appComponent} from './components/app-component.js';
import {appConfig} from './config.js';

const mainElement = document.querySelector('.app');

export class App {
  constructor() {}

  render(parent, renderedElement) {
    parent.appendChild(renderedElement);
  }
}

document.body.addEventListener('loadend', () => App.render(mainElement, appComponent(appConfig.title)));
