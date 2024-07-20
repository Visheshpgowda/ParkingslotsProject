import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import { About, Contact, CustomerForm, Dashboard, LogIn, ParkingView, VehicleForm } from './index.js'
import { Provider } from "react-redux"
import store from "./store/store.js"
import "./index.css"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path='login' element={<LogIn />} />
      <Route path='contact' element={<Contact />} />
      <Route path='signup' element={<CustomerForm />} />
      <Route path='about' element={<About />} />
      <Route path='vehicleRegistration' element={<VehicleForm />} />
      <Route path='parkingSpots' element={<ParkingView />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
