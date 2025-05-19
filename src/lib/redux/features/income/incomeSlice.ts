import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    request: null
};

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        incomeCreatePaymentIntent: (state, action) => {
            state.request = action.payload.request;
        },
        incomeRemovePaymentIntent: (state) => {
            state.request = null;
        }
    }
});

export const { incomeCreatePaymentIntent, incomeRemovePaymentIntent } = incomeSlice.actions;

export default incomeSlice.reducer;
