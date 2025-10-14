import React from 'react';
import DiscussionContent from '../components/Discussion';
import Footer from '../components/Footer';

const Discussion = ({ isLoggedIn }) => {
  return (
    <>
      <DiscussionContent isLoggedIn={isLoggedIn} />
      <Footer />
    </>
  );
};

export default Discussion;
