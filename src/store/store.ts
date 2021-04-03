import { configureStore } from '@reduxjs/toolkit';
import modal from 'components/Dialogs/modalReducer';
import dashboard from 'components/Layout/Dashboard/dashboardReducer';

const store = configureStore({ reducer: { modal, dashboard } });

export type AppDispatch = typeof store.dispatch

export default store;
