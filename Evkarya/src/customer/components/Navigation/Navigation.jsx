'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

import React from 'react';
import { navigation } from './navigationData';

export default function Navigation() {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="relative z-[999] bg-white">
      <header className="relative bg-white shadow">
        {/* Top banner */}
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
          Welcome to EVkarya
        </p>

        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              {/* Left Side - Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="text-xl font-bold text-indigo-600">
                    Evkarya
                  </span>
                </Link>
              </div>
              

             
              <PopoverGroup className="hidden lg:flex lg:space-x-8">
                {navigation.map((category) => (
                  <Popover key={category.name} className="relative">
                    <PopoverButton className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                      {category.name}
                    </PopoverButton>

                    <PopoverPanel className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="p-4">
                        <ul className="space-y-2">
                          {category.categories.map((subCategory) => (
                            <li key={subCategory}>
                              <Popover.Button as={Fragment}>
                                {({ close }) => (
                                  <Link
                                    to={`/category/${encodeURIComponent(
                                      subCategory
                                    )}`}
                                    onClick={close}
                                    className="block text-gray-600 hover:text-indigo-600"
                                  >
                                    {subCategory}
                                  </Link>
                                )}
                              </Popover.Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverPanel>
                  </Popover>
                ))}
              </PopoverGroup>

              {/* Right Side - User & Actions */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Home
                </Link>

                {userName ? (
                  <>
                    <span className="text-sm font-medium text-gray-700">Hi, {userName}</span>

                    {/* Vendor Info Button */}
                    {localStorage.getItem("userRole") === "vendor" && (
                      <button
                        onClick={() => {
                          const vendorId = localStorage.getItem("vendorId"); // make sure you store userId also in localStorage at login
                          if (vendorId) {
                            navigate(`/vendor/${vendorId}/posts`);
                          } else {
                            navigate('/');
                          }
                        }}
                        className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                      >
                        Vendor Info
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                      Sign in
                    </Link>
                    <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                      Create account
                    </Link>
                  </>
                )}

                
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
