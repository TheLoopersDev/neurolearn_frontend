import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
    courses: any[];
}

const initialState: OrderState = {
    courses: []
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        orderCreatePaymentIntent: (state, action: PayloadAction<{ course?: any, cartItems?: any[] }>) => {
            if (action.payload.course) {
                state.courses = [action.payload.course];
            } else if (action.payload.cartItems) {
                state.courses = action.payload.cartItems;
            } else {
                state.courses = [];
            }
        }
    }
});

export const { orderCreatePaymentIntent } = orderSlice.actions;

export default orderSlice.reducer;