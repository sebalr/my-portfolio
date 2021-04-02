import { configureStore } from '@reduxjs/toolkit';
import modal from 'store/modal/modalReducer';
import dashboard from 'store/dashboard/dashboardReducer';

const store = configureStore({ reducer: { modal, dashboard } });

export type AppDispatch = typeof store.dispatch

export default store;
