import dynamic from 'next/dynamic';

const N4DLogo = dynamic(
  () => import('./N4DLogo'), // Path to your original N4DLogo.tsx
  { 
    ssr: false, 
    // loading: () => <p>Loading logo...</p>, 
  }
);

export default N4DLogo;