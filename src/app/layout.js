import './globals.css'; // Import global styles
import Navbar from '../components/navbar'; // Import Navbar
import { AuthProvider } from '@/context/authcontext'; // Import AuthProvider

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Link to Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-gray-900"> {/* Use appropriate background and text colors */}
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <Navbar />
          <main className="flex flex-col min-h-screen"> {/* Ensure main takes full height */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
