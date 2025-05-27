// Ce fichier applique un style global CSS à l'application
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f5f5f5;
  }

  input, button {
    margin: 0.5rem;
    padding: 0.5rem;
  }
`;

export default GlobalStyle;
