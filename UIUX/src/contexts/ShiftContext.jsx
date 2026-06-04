import { createContext, useReducer, useCallback } from 'react';
import { shiftReducer, initialShiftState, SHIFT_ACTIONS } from '../reducers/shiftReducer';

export const ShiftContext = createContext(null);

export function ShiftProvider({ children }) {
  const [state, dispatch] = useReducer(shiftReducer, initialShiftState);

  const openShift = useCallback((kasir, modalAwal) => {
    dispatch({ type: SHIFT_ACTIONS.OPEN_SHIFT, payload: { kasir, modalAwal: Number(modalAwal) } });
  }, []);

  const closeShift = useCallback(() => {
    dispatch({ type: SHIFT_ACTIONS.CLOSE_SHIFT });
  }, []);

  const addTransaction = useCallback((metode, total) => {
    dispatch({ type: SHIFT_ACTIONS.UPDATE_TOTAL, payload: { metode, total } });
  }, []);

  const value = {
    ...state,
    totalBersih: state.totalCash + state.totalQRIS,
    openShift,
    closeShift,
    addTransaction,
  };

  return (
    <ShiftContext.Provider value={value}>
      {children}
    </ShiftContext.Provider>
  );
}
