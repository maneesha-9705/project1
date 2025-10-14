import React from 'react';
import DashboardContent from '../components/Dashboard';
import Footer from '../components/Footer';

const Updates = ({ isLoggedIn }) => {
  return (
    <>
      <DashboardContent isLoggedIn={isLoggedIn} view="updates" />
      <Footer />
    </>
  );
};

export default Updates;
