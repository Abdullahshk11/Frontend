import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authContext } from '../context/AuthContext.jsx'
import { clearCart } from '../redux/CardSlice.js'
import '../styles/Checkout.css'

const initialForm = { fullName: '', phoneNumber: '', street: '', city: '', postalCode: '' }

const CheckOut = () => {
  const { user } = useContext(authContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const subtotal = cartItems.reduce((total, item) => total + Number(item.price) * (item.quantity || item.qty || 1), 0)

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [navigate, user])

  if (!user) return null

  if (placedOrder) return <main className="checkout-page checkout-success"><p className="checkout-kicker">Order confirmed</p><h1>Thank you for your order.</h1><p>Your order has been placed successfully.</p><strong>Order #{placedOrder._id?.slice(-8).toUpperCase()}</strong><div className="checkout-success__actions"><Link className="checkout-button" to="/profile">View my orders</Link><Link className="checkout-secondary" to="/">Continue shopping</Link></div></main>

  if (cartItems.length === 0) return <main className="checkout-page checkout-empty"><p className="checkout-kicker">Checkout</p><h1>Your cart is empty.</h1><p>Add something to your cart before checking out.</p><Link className="checkout-button" to="/">Browse products</Link></main>

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ items: cartItems.map((item) => ({ productId: item._id || item.productId, quantity: item.quantity || item.qty || 1 })), totalAmount: subtotal, address: form }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to place your order.')
      dispatch(clearCart())
      setPlacedOrder(data.order)
    } catch (requestError) {
      setError(requestError.message || 'Unable to place your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="checkout-page">
      <section className="checkout-heading"><p className="checkout-kicker">Secure checkout</p><h1>Where should we send it?</h1><p>Enter your delivery details to place your order.</p></section>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <div className="checkout-section-heading"><span>01</span><div><h2>Delivery details</h2><p>We will use these details for your order.</p></div></div>
          <label htmlFor="checkout-full-name">Full name<input id="checkout-full-name" name="fullName" type="text" autoComplete="name" value={form.fullName} onChange={handleChange} required /></label>
          <label htmlFor="checkout-phone-number">Phone number<input id="checkout-phone-number" name="phoneNumber" type="tel" autoComplete="tel" value={form.phoneNumber} onChange={handleChange} required /></label>
          <label htmlFor="checkout-street">Street address<input id="checkout-street" name="street" type="text" autoComplete="street-address" value={form.street} onChange={handleChange} required /></label>
          <div className="checkout-form-row"><label htmlFor="checkout-city">City<input id="checkout-city" name="city" type="text" autoComplete="address-level2" value={form.city} onChange={handleChange} required /></label><label htmlFor="checkout-postal-code">Postal code<input id="checkout-postal-code" name="postalCode" type="text" autoComplete="postal-code" value={form.postalCode} onChange={handleChange} required /></label></div>
          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button className="checkout-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Placing order...' : 'Place order'}</button>
        </form>
        <aside className="checkout-summary"><div className="checkout-section-heading"><span>02</span><div><h2>Your order</h2><p>{cartItems.length} item{cartItems.length === 1 ? '' : 's'}</p></div></div><div className="checkout-items">{cartItems.map((item) => { const quantity = item.quantity || item.qty || 1; return <div className="checkout-item" key={item._id || item.productId}><span>{item.name} x {quantity}</span><strong>${(Number(item.price) * quantity).toFixed(2)}</strong></div> })}</div><div className="checkout-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div></aside>
      </div>
    </main>
  )
}

export default CheckOut
