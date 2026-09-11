import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import '../styles/Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useContext(authContext)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create your account.')
      }

      login(data)
      navigate('/')
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <section className="register-intro" aria-labelledby="register-heading">
        <p className="register-kicker">Welcome to ShopNest</p>
        <h1 id="register-heading">Make room for the good stuff.</h1>
        <p className="register-copy">
          Create an account to keep your favorite finds close and make every next order effortless.
        </p>
        <div className="register-note">
          <span aria-hidden="true">01</span>
          <p>One account for your orders, saved products, and a smoother shopping day.</p>
        </div>
      </section>

      <section className="register-panel" aria-label="Create your account">
        <div className="register-panel__header">
          <p className="register-kicker">New customer</p>
          <h2>Create your account</h2>
          <p>It only takes a minute to get started.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Alex Morgan" value={form.name} onChange={handleChange} required />

          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="alex@example.com" value={form.email} onChange={handleChange} required />

          <div className="register-form__row">
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" minLength="6" value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat password" minLength="6" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          {error && <p className="register-error" role="alert">{error}</p>}

          <button className="register-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="register-footer">Already have an account? <Link to="/">Continue shopping</Link></p>
      </section>
    </div>
  )
}

export default Register
