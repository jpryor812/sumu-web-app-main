// pages/signup/page.tsx
'use client';

import SignUpForm from '../../components/auth/SignUpForm';
import React from 'react';

export default function SignUp(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h1 className="text-center text-3xl font-extrabold text-white">
          Join SUMU as a Creator
        </h1>
        <p className="mt-2 text-center text-gray-400">
          Start earning $SUMU tokens for your creative work
        </p>
      </div>
      
      <SignUpForm />
    </div>
  );
}