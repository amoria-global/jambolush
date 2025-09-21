import React from 'react';
import BrowseToursPage from '../../pages/tour-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours - Jambolush',
  description: 'Explore tours offered by Jambolush.',
}

const AppRouterAboutUsPage = () => {
  return <BrowseToursPage />;
};

export default AppRouterAboutUsPage;
