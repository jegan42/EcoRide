// Ce composant affiche un en-tête simple avec le nom de l'application
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  padding: 1rem;
  background: #282c34;
  color: white;
  text-align: center;
`;

const Header = () => {
  return <HeaderWrapper>Mon App Frontend</HeaderWrapper>;
};

export default Header;
