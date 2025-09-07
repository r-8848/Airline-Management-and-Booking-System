import React from 'react';
import AdminNav from '../components/AdminNav';

const AccessDenied = () => {
  return (
    <>
      <AdminNav />
      <div style={{ textAlign: 'center', marginTop: '20vh'}}>
        <h1>403 - Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </>
  );
};

export default AccessDenied;
