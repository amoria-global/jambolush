import React from 'react';
import Tourpage from '../../pages/tour-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours - Jambolush',
  description: 'Explore tours offered by Jambolush.',
}

const AppRouterAboutUsPage = () => {
  return <Tourpage />;
};

export default AppRouterAboutUsPage;
