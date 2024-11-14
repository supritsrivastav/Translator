import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    return (
        <>
            <div className='navbar'>
                <NavLink to='text' className={({ isActive }) => isActive ? 'active' : ''}><div>Text</div></NavLink>
                <NavLink to='/' className={({ isActive }) => isActive ? 'active' : ''}><div>Voice</div></NavLink>
                <NavLink to='image' className={({ isActive }) => isActive ? 'active' : ''}><div>Image</div></NavLink>
            </div>
            <Outlet />
        </>
    )
}
