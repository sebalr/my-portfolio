import {
  IModalContext,
  IModalProviderState,
} from 'common/state.interfaces';
import { createContext, useState } from 'react';

const closedDialogs = {
  newDialogOn: false,
  updateDialogOn: false,
  newOperationOn: false,
  loadDbDialogOn: false,
};

export const ModalContext = createContext<IModalContext>({ dialogsState: closedDialogs });

const ModalContextProvider = (props: any) => {
  const { children } = props;
  const [state, setstate] = useState<IModalProviderState>({ dialogsState: closedDialogs });

  const openNewDialog = () => {
    const dialogsState = { ...closedDialogs, newDialogOn: true };
    setstate({ ...state, dialogsState });
  };
  const openUpdaeDialog = () => {
    const dialogsState = { ...closedDialogs, updateDialogOn: true };
    setstate({ ...state, dialogsState });
  };
  const openNewOperationDialog = () => {
    const dialogsState = { ...closedDialogs, newOperationOn: true };
    setstate({ ...state, dialogsState });
  };
  const openLoadDbDialog = () => {
    const dialogsState = { ...closedDialogs, loadDbDialogOn: true };
    setstate({ ...state, dialogsState });
  };
  const closeOpenDialogs = () => {
    setstate({ ...state, dialogsState: closedDialogs });
  };

  return (
    <ModalContext.Provider
      value={{
        dialogsState: state.dialogsState,
        openNewDialog,
        openUpdaeDialog,
        openNewOperationDialog,
        openLoadDbDialog,
        closeOpenDialogs,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
