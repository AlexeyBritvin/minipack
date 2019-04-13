import {appComponent} from './components/app-component.js';
import {appConfig} from './config.js';

const mainElement = document.querySelector('.app');

export class App {
  constructor() {}

  render(parent, renderedElement) {
    parent.insertAdjacentHTML('beforeend', renderedElement);
  }
}
const app = new App();

app.render(mainElement, appComponent(appConfig.title));
