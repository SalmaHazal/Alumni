import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import RequestService from './RequestService';
import PostService from './PostService';

const Services = () => {
  const [view, setView] = useState('request'); // 'request' or 'post'

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <div className='fixed-navbar'>
        <Navbar />
      </div>
      <div className='services-container p-4'>
        <h1 className='text-2xl font-bold mb-4'>Services</h1>

        <div className='flex justify-center mb-6'>
          <button
            className={`px-4 py-2 mr-2 ${view === 'request' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('request')}
          >
            Request a Service
          </button>
          <button
            className={`px-4 py-2 ${view === 'post' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('post')}
          >
            Post a Service
          </button>
        </div>

        {view === 'request' && <RequestService />}
        {view === 'post' && <PostService />}
      </div>
    </div>
  );
};

export default Services;
