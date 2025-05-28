// frontend/src/App/tsx
import type { JSX } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './router/AppRouter';

const App = (): JSX.Element => (
  <Provider store={store}>
    <AppRouter />
    <ToastContainer position="top-right" autoClose={3000} />
  </Provider>
);

export default App;
