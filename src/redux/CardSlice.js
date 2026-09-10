import { createSlice } from "@reduxjs/toolkit";

const initailState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initailState,
    reducers: {
        addTOCart: (state, action) => {
            const item = action.payload
            const itemId = item._id || item.productId
            const existItem = state.cartItems.find((x) => (x._id || x.productId) === itemId)
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => {
                    if ((x._id || x.productId) !== itemId) return x
                    return { ...x, ...item, quantity: (x.quantity || x.qty || 0) + (item.quantity || item.qty || 1) }
                })
            } else {
                state.cartItems = [...state.cartItems, { ...item, _id: itemId, quantity: item.quantity || item.qty || 1 }]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        updateCartQuantity: (state, action) => {
            const { itemId, quantity } = action.payload
            state.cartItems = state.cartItems.map((item) => (
                (item._id || item.productId) === itemId ? { ...item, quantity } : item
            ))
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload
            state.cartItems = state.cartItems.filter((x) => (x._id || x.productId) !== itemId)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        clearCart: (state) => {
            state.cartItems = []
            localStorage.removeItem('cartItems')
        }
    },

});

export const { addTOCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer