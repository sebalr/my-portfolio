import { createAction, createReducer } from '@reduxjs/toolkit';
import { SHOW } from './modalActions';

const showModal = createAction<boolean, string>(SHOW);

const initialState = { show: false };

const reducer = createReducer(initialState,
  builder => builder.addCase(showModal, (state, action) => ({
    ...state,
    show: action.payload,
  })));
export default reducer;
