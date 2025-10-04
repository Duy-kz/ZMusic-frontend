import { Toaster, toast } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router"
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from "./contexts/AuthContext"
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext"
import AdminGuard from "./components/AdminGuard"
import MusicPlayer from "./components/MusicPlayer.mui"
import HomePage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/LoginPage.mui"
import UploadPage from "./pages/UploadPage.mui"
import theme from './theme/theme'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  )
}

export default App
