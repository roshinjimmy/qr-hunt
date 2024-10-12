import Navbar from '../components/navbar';

export const metadata = {
  title: "QR Treasure Hunt",
  description: "Join the QR Treasure Hunt and solve puzzles!",
};

const RootLayout = ({ children }) => {
  return (
      <html lang="en">
          <head>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>{metadata.title}</title>
              <meta name="description" content={metadata.description} />
              {/* Add any additional head elements here, like links to stylesheets */}
          </head>
          <body>
          <Navbar />
          <main>{children}</main>
          </body>
      </html>
  );
};

export default RootLayout;
