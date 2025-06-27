// frontend/src/pages/LegalNotice.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { contactInfo } from '../components/footer/FooterList';
import { ContactLine } from '../components/footer/FooterLine';

export const LegalNotice: React.FC = () => {
  return (
    <Box component="main" sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Mentions légales
        </Typography>

        <Typography variant="h6" mt={4}>
          Éditeur du site
        </Typography>
        <Typography variant="body1">
          Le site <strong>EcoRide</strong> est édité par :
          <br />
          EcoRide SAS
        </Typography>
        {contactInfo.map((item, index) => (
          <ContactLine key={index} icon={item.iconDark} text={item.text} />
        ))}
        <Typography variant="body1">
          RCS Paris 123 456 789
          <br />
        </Typography>

        <Typography variant="h6" mt={4}>
          Directeur de la publication
        </Typography>
        <Typography variant="body1">
          Jean Dupont, Président de EcoRide SAS
        </Typography>

        <Typography variant="h6" mt={4}>
          Hébergeur
        </Typography>
        <Typography variant="body1">
          Le site est hébergé par :
          <br />
          OVHcloud
          <br />
          2 rue Kellermann, 59100 Roubaix, France
          <br />
          Site web : www.ovhcloud.com
          <br />
          Téléphone : 1007
        </Typography>

        <Typography variant="h6" mt={4}>
          Propriété intellectuelle
        </Typography>
        <Typography variant="body1">
          Tous les contenus présents sur le site EcoRide (textes, images, logos,
          etc.) sont la propriété exclusive de EcoRide SAS, sauf mention
          contraire, et sont protégés par le droit d’auteur. Toute reproduction,
          distribution ou exploitation sans autorisation est strictement
          interdite.
        </Typography>

        <Typography variant="h6" mt={4}>
          Données personnelles
        </Typography>
        <Typography variant="body1">
          Conformément à la loi Informatique et Libertés du 6 janvier 1978
          modifiée et au Règlement Général sur la Protection des Données (RGPD),
          vous disposez d’un droit d’accès, de rectification, de suppression et
          d’opposition aux données vous concernant. Pour toute demande, vous
          pouvez écrire à : contact@ecoride.fr
        </Typography>

        <Typography variant="h6" mt={4}>
          Cookies
        </Typography>
        <Typography variant="body1">
          Le site EcoRide peut être amené à utiliser des cookies à des fins de
          fonctionnement, de statistiques ou d’amélioration de l’expérience
          utilisateur. Vous pouvez configurer vos préférences via les paramètres
          de votre navigateur.
        </Typography>

        <Typography variant="h6" mt={4}>
          Loi applicable
        </Typography>
        <Typography variant="body1">
          Le présent site est soumis au droit français. En cas de litige, les
          tribunaux français seront seuls compétents.
        </Typography>
      </Container>
    </Box>
  );
};
