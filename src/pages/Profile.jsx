import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import '../styles/Profile.css'

const Profile = () => {
    const { user } = useContext(authContext)
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true })
            return
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.message || 'Unable to load orders.')
                setOrders(data.orders || [])
            } catch (requestError) {
                setError(requestError.message)
            }
        }

        fetchOrders()
    }, [navigate, user])

    if (!user) return null

    return (
        <main className="profile-page">
            <section className="profile-hero">
                <p className="profile-kicker">Your account</p>
                <h1>Welcome, {user.name}.</h1>
                <p>Manage your details and keep track of your ShopNest orders.</p>
            </section>

            <div className="profile-layout">
                <section className="profile-card" aria-labelledby="profile-details-heading">
                    <h2 id="profile-details-heading">Profile details</h2>
                    <dl className="profile-details">
                        <div><dt>Name</dt><dd>{user.name}</dd></div>
                        <div><dt>Email</dt><dd>{user.email}</dd></div>
                        <div><dt>Account type</dt><dd>{user.role || 'user'}</dd></div>
                    </dl>
                    <Link className="profile-link" to="/">Continue shopping</Link>
                </section>

                <section className="profile-card" aria-labelledby="orders-heading">
                    <div className="profile-section-heading">
                        <div>
                            <p className="profile-kicker">Order history</p>
                            <h2 id="orders-heading">Your orders</h2>
                        </div>
                        <span>{orders.length} total</span>
                    </div>
                    {error && <p className="profile-error" role="alert">{error}</p>}
                    {!error && orders.length === 0 && <p className="profile-muted">You have not placed any orders yet.</p>}
                    <div className="profile-orders">
                        {orders.map((order) => (
                            <article className="profile-order" key={order._id}>
                                <div>
                                    <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <strong>${Number(order.totalAmount).toFixed(2)}</strong>
                                    <span className={`profile-status profile-status--${String(order.status).toLowerCase()}`}>{order.status}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Profile
