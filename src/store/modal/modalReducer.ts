import { createAction, createReducer } from '@reduxjs/toolkit';
import { SHOW } from './modalActionTypes';

const showModal = createAction<boolean>(SHOW);

const initialState = { show: false };

const reducer = createReducer(initialState,
  builder => builder.addCase(showModal, (state, action) => {
    state.show = action.payload;
  }));
export default reducer;
