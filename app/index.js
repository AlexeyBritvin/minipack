import {appComponent} from './components/app-component';
import {appConfig} from './config';

const mainElement = document.querySelector('.app');

export class App {
  constructor() {}

  render(parent, renderedElement) {
    parent.appendChild(renderedElement);
  }
}

document.body.addEventListener('loadend', () => App.render(mainElement, appComponent(appConfig.title)));
