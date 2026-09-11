import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import '../styles/Register.css'

const Login = () => {
    const navigate = useNavigate()
    const { user, login } = useContext(authContext)
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [navigate, user])

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
        setError('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password.')
            }

            login(data)
            navigate('/')
        } catch (requestError) {
            setError(requestError.message || 'Unable to log in. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="register-page">
            <section className="register-intro" aria-labelledby="login-heading">
                <p className="register-kicker">Welcome back to ShopNest</p>
                <h1 id="login-heading">Your next great find is waiting.</h1>
                <p className="register-copy">
                    Sign in to pick up where you left off and keep your shopping journey moving.
                </p>
                <div className="register-note">
                    <span aria-hidden="true">02</span>
                    <p>Your saved products and order history are ready when you are.</p>
                </div>
            </section>

            <section className="register-panel" aria-label="Log in to your account">
                <div className="register-panel__header">
                    <p className="register-kicker">Returning customer</p>
                    <h2>Log in to ShopNest</h2>
                    <p>Enter your details to continue.</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="login-email">Email address</label>
                    <input id="login-email" name="email" type="email" autoComplete="email" placeholder="alex@example.com" value={form.email} onChange={handleChange} required />

                    <label htmlFor="login-password">Password</label>
                    <div className="password-field">
                        <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                        <button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {error && <p className="register-error" role="alert">{error}</p>}
                    <button className="register-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Log in'}
                    </button>
                </form>

                <p className="register-footer">New to ShopNest? <Link to="/register">Create an account</Link></p>
            </section>
        </div>
    )
}
export default Login