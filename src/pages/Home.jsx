import React, { useEffect, useState } from 'react'
import ProductCard from '../compounds/ProductCard'


const Home = () => {
  const [Product, setProduct] = useState([])
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/products')
        const data = await res.json()
        console.log(data)
        setProduct(data)
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    };
    fetchProducts()
  }, [])
  return (
    <div className='home-page flex flex-col'>
      <h1 className='font-bold text-4xl text-center mx-auto'>Welcome to shopNest</h1>
      <p>Discover the products in unbeat able price</p>
      <h2>Featured Products</h2>
      {Loading ? (
        <div></div>
      ) : (
        <div className="product-grid">
          {Product.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
