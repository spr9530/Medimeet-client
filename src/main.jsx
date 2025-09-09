import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "sonner";

import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import Header from './components/header.jsx';
import { UserProvider } from './userContext/userContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}
        appearance={{
          theme: dark, // 👈 or "light"
          variables: {
            colorPrimary: "#10b981", // emerald green
            fontSize: "16px",
            fontFamily: "Inter, sans-serif",
          }
        }} >
        <UserProvider>
          <Header />
          <main className="pt-20 min-h-screen"> {/* adjust pt-20 according to header height */}
            <App />
          </main>
          <Toaster richColors />
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>Made with 💗 by SparshManhas</p>
            </div>
          </footer>
        </UserProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
