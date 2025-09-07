git commit -m "Fix logout button on user profile page"import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <Link to="/register" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Register
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-purple max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Flyhigh's services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Use of Service</h2>
            <p className="text-gray-700 mb-4">
              You may use our service for lawful purposes only. You agree not to use the service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute harmful or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Booking and Payments</h2>
            <p className="text-gray-700 mb-4">
              All bookings are subject to availability and confirmation. Prices are subject to change without notice until booking is confirmed.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Cancellation Policy</h2>
            <p className="text-gray-700 mb-4">
              Cancellations must be made at least 24 hours before the scheduled departure time. Refund policies vary by ticket type.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Flyhigh shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: support@flyhigh.com<br />
              Phone: +91 361 258 3000<br />
              Address: Indian Institute of Technology Guwahati<br />
              Amingaon, North Guwahati<br />
              Guwahati, Assam 781039, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 