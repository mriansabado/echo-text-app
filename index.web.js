import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: rootElement,
});
