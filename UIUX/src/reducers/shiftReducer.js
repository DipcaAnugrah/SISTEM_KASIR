// ============================================================
// SHIFT REDUCER — Warkop Djoeragan POS
// ============================================================

export const SHIFT_ACTIONS = {
  OPEN_SHIFT   : 'OPEN_SHIFT',
  CLOSE_SHIFT  : 'CLOSE_SHIFT',
  UPDATE_TOTAL : 'UPDATE_TOTAL',   // tambah transaksi ke running total
  RESET        : 'RESET',
};

export const initialShiftState = {
  isOpen      : false,
  shiftId     : null,
  kasir       : null,
  modalAwal   : 0,
  waktuMulai  : null,
  waktuTutup  : null,
  totalCash   : 0,
  totalQRIS   : 0,
  jumlahTrx   : 0,
  riwayat     : [],     // shift yang sudah tutup
};

export function shiftReducer(state, action) {
  switch (action.type) {

    case SHIFT_ACTIONS.OPEN_SHIFT:
      return {
        ...state,
        isOpen    : true,
        shiftId   : `shift-${Date.now()}`,
        kasir     : action.payload.kasir,
        modalAwal : action.payload.modalAwal,
        waktuMulai: new Date().toISOString(),
        waktuTutup: null,
        totalCash : 0,
        totalQRIS : 0,
        jumlahTrx : 0,
      };

    case SHIFT_ACTIONS.CLOSE_SHIFT: {
      const closedShift = {
        shiftId   : state.shiftId,
        kasir     : state.kasir,
        modalAwal : state.modalAwal,
        waktuMulai: state.waktuMulai,
        waktuTutup: new Date().toISOString(),
        totalCash : state.totalCash,
        totalQRIS : state.totalQRIS,
        jumlahTrx : state.jumlahTrx,
        totalBersih: state.totalCash + state.totalQRIS,
      };
      return {
        ...state,
        isOpen    : false,
        waktuTutup: closedShift.waktuTutup,
        riwayat   : [closedShift, ...state.riwayat],
      };
    }

    case SHIFT_ACTIONS.UPDATE_TOTAL:
      return {
        ...state,
        totalCash : action.payload.metode === 'cash'
          ? state.totalCash + action.payload.total
          : state.totalCash,
        totalQRIS : action.payload.metode === 'qris'
          ? state.totalQRIS + action.payload.total
          : state.totalQRIS,
        jumlahTrx : state.jumlahTrx + 1,
      };

    case SHIFT_ACTIONS.RESET:
      return { ...initialShiftState };

    default:
      return state;
  }
}
