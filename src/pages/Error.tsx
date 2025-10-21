import React from "react";
import { Link, useLocation } from "react-router-dom";

const Error: React.FC<{ message?: string; statusCode?: number }> = ({
    message = "Oops! Something went wrong.",
    statusCode = 500,
}) => {
    const location = useLocation();
    const state = location.state as { message?: string; statusCode?: number } | undefined;
    console.error(`Error Page Rendered: ${statusCode} - ${message}`);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md text-center">
                {/* Optional status code */}
                <h1 className="text-6xl font-extrabold text-red-600 mb-4">
                    {state?.statusCode || statusCode}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{state.message || message}</h2>
                <p className="text-gray-500 mb-6">
                    The page you are looking for might be temporarily unavailable or does not exist.
                </p>

                {/* Illustration */}
                <img
                    src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                    alt="Error illustration"
                    className="w-64 mx-auto mb-6"
                />

                {/* Back to Home button */}
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition-colors"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Error;
