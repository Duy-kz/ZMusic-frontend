import { Toaster, toast } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router"
import { AuthProvider } from "./contexts/AuthContext"
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext"
import AdminGuard from "./components/AdminGuard"
import MusicPlayer from "./components/MusicPlayer"
import HomePage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/LoginPage"
import UploadPage from "./pages/UploadPage"
import './App.css'

function App() {
  return (
    <>
      <Toaster />
      
      <AuthProvider>
        <MusicPlayerProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<HomePage/>}
              />

              <Route
                path="/login"
                element={<LoginPage/>}
              />

              <Route
                path="/upload"
                element={
                  <AdminGuard>
                    <UploadPage/>
                  </AdminGuard>
                }
              />

              <Route
                path="*"
                element={<NotFound/>}
              />
            </Routes>
            
            {/* Music Player - Fixed at bottom */}
            <MusicPlayer />
          </BrowserRouter>
        </MusicPlayerProvider>
      </AuthProvider>
    </>
  )
}

export default App
