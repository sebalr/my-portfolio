import { createAction, createReducer } from '@reduxjs/toolkit';
import { IModalState } from 'store/types';
import { SHOW_NEW, HIDE_ALL, SHOW_UPDATE, SHOW_NEW_OPERATION, SHOW_LOAD_DB } from './modalActionTypes';

export const showNew = createAction(SHOW_NEW);
export const showUpdate = createAction(SHOW_UPDATE);
export const showNewOperation = createAction(SHOW_NEW_OPERATION);
export const showLoadDb = createAction(SHOW_LOAD_DB);
export const hideAll = createAction(HIDE_ALL);

const initialState: IModalState = {
  showNew: false,
  showUpdate: false,
  showNewOperation: false,
  showLoadDb: false,
};

const reducer = createReducer(initialState,
  builder => {
    builder
      .addCase(showNew, state => {
        state.showNew = true;
      })
      .addCase(showUpdate, state => {
        state.showUpdate = true;
      })
      .addCase(showNewOperation, state => {
        state.showNewOperation = true;
      })
      .addCase(showLoadDb, state => {
        state.showLoadDb = true;
      })
      .addCase(hideAll, () => initialState)
      .addDefaultCase(() => initialState);
  });
export default reducer;
