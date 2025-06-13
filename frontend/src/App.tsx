// frontend/src/App/tsx
import type { JSX } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './router/AppRouter';

const App = (): JSX.Element => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default App;
