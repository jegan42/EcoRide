import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // Ajouter ici tes reducers (par ex : userReducer, authReducer, etc.)
  },
});

export default store;
