import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, removeFromCart, updateCartQuantity } from '../redux/CardSlice.js'
import '../styles/Cart.css'

const Cart = () => {
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.cartItems)
    const subtotal = cartItems.reduce((total, item) => total + Number(item.price) * (item.quantity || item.qty || 1), 0)

    if (cartItems.length === 0) {
        return (
            <main className="cart-page cart-page--empty">
                <p className="cart-kicker">Your basket</p>
                <h1>Your cart is waiting for something good.</h1>
                <p>Browse the collection and add products you would like to keep close.</p>
                <Link className="cart-button" to="/">Continue shopping</Link>
            </main>
        )
    }

    return (
        <main className="cart-page">
            <div className="cart-heading">
                <div>
                    <p className="cart-kicker">Your basket</p>
                    <h1>Shopping cart</h1>
                </div>
                <button className="cart-clear" type="button" onClick={() => dispatch(clearCart())}>Clear cart</button>
            </div>

            <div className="cart-layout">
                <section className="cart-items" aria-label="Cart items">
                    {cartItems.map((item) => {
                        const itemId = item._id || item.productId
                        const quantity = item.quantity || item.qty || 1
                        return (
                            <article className="cart-item" key={itemId}>
                                <img src={item.imageURL} alt={item.name} />
                                <div className="cart-item__info">
                                    <Link to={`/product/${itemId}`}><h2>{item.name}</h2></Link>
                                    <p>${Number(item.price).toFixed(2)} each</p>
                                    <label htmlFor={`quantity-${itemId}`}>Quantity</label>
                                    <input id={`quantity-${itemId}`} type="number" min="1" value={quantity} onChange={(event) => dispatch(updateCartQuantity({ itemId, quantity: Math.max(1, Number(event.target.value) || 1) }))} />
                                </div>
                                <div className="cart-item__total">
                                    <strong>${(Number(item.price) * quantity).toFixed(2)}</strong>
                                    <button type="button" onClick={() => dispatch(removeFromCart(itemId))}>Remove</button>
                                </div>
                            </article>
                        )
                    })}
                </section>

                <aside className="cart-summary" aria-label="Cart summary">
                    <h2>Order summary</h2>
                    <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
                    <div><span>Shipping</span><span>Calculated at checkout</span></div>
                    <hr />
                    <div className="cart-summary__total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
                    <Link className="cart-button" to="/checkout">Proceed to checkout</Link>
                </aside>
            </div>
        </main>
    )
}

export default Cart
