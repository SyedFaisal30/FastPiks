"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ForbiddenPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Optionally, you can redirect the user to the home page after a certain time
    // or provide a button to redirect them manually
  }, []);

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-bold mt-10">Forbidden Access</h1>
      <p className="text-center text-lg mt-4">
        You do not have permission to access this page.
      </p>
      <div className="text-center mt-6">
        <p className="text-lg">
          Please log in with your <span className="font-bold">Admin</span> credentials to access this page.
        </p>
        <button
          onClick={() => router.push('/sign-in')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
