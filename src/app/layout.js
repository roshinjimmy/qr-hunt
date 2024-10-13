import './globals.css';
import Navbar from '../components/navbar';
import { AuthProvider } from '@/context/authcontext'; // Import AuthProvider

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Head content goes here */}
      </head>
      <body className="bg-gray-900 text-white">
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
