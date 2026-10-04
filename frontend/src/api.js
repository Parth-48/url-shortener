import axios from 'axios'

// All API calls go to our FastAPI backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,  // 10 seconds timeout
})

// API functions — one function per endpoint
export const shortenURL = (originalUrl) =>
  API.post('/shorten', { original_url: originalUrl })

export const getAnalytics = (shortCode) =>
  API.get(`/analytics/${shortCode}`)

export const getAllURLs = (skip = 0, limit = 10) =>
  API.get(`/analytics/?skip=${skip}&limit=${limit}`)

export default API