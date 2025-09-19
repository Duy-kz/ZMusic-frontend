import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import MusicSection from '../components/MusicSection';
import Footer from '../components/Footer';

import UserDebugInfo from '../components/UserDebugInfo';
import AdminTestButton from '../components/AdminTestButton';
import QuickAuthTest from '../components/QuickAuthTest';
import MusicPlayerDebug from '../components/MusicPlayerDebug';
import { getAllSongs } from '../services/songService';
import { getLocalSongs } from '../services/fileUploadService';
import '../assets/css/pages/HomePage.css';

function HomePage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  console.log('HomePage rendering, loading:', loading, 'error:', error, 'songs:', songs.length); // Debug log

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        
        // Lấy local songs trước (fallback data)
        const localSongs = getLocalSongs();
        console.log('📱 Local songs found:', localSongs.length);
        
        // Lấy từ backend .NET API chính
        try {
          const backendSongs = await getAllSongs();
          console.log('🌐 Backend songs found:', backendSongs?.length || 0);
          
          // Kết hợp backend songs và local songs
          const allSongs = [
            ...(backendSongs || []),
            ...localSongs
          ];
          
          if (allSongs.length > 0) {
            setSongs(allSongs);
            setError(null);
          } else {
            // Nếu không có data nào, dùng test data
            setSongs(testSongs);
            setError(null);
          }
        } catch (backendError) {
          console.warn('Backend not available, using local and test data:', backendError);
          // Fallback: local songs + test data nếu không có gì
          const fallbackSongs = localSongs.length > 0 ? localSongs : testSongs;
          setSongs(fallbackSongs);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading songs:', err);
        // Even if there's an error, still show test data
        setSongs(testSongs);
        setError('Đang sử dụng dữ liệu test. Backend có thể chưa khởi động.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Helper function to get songs by category or limit - sử dụng useMemo để tránh re-render
  const getAllSongs12 = useMemo(() => {
    return songs.slice(0, 12);
  }, [songs]);

  const getAllSongs20 = useMemo(() => {
    return songs.slice(12, 20);
  }, [songs]);

  const getTopHits = useMemo(() => {
    // Sort by plays or views if available, otherwise return first 8ds 
    return songs
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 8);
  }, [songs]);

  const getNewReleases = useMemo(() => {
    // Sort by release date if available, otherwise return songs
    return songs
      .sort((a, b) => new Date(b.releaseDate || b.createdAt || 0) - new Date(a.releaseDate || a.createdAt || 0))
      .slice(0, 8);
  }, [songs]);

  if (loading) {
    return (
      <div className="home-page">
        <Header />
        <main className="main-content">
          <div className="content-sections">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải nhạc...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <Header />
        <main className="main-content">
          <div className="content-sections">
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Thử lại
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header />
      
      <main className="main-content">
        {/* Animated Banner Section */}
        <div className="animated-banner">
          <div className="banner-background">
            <div className="floating-particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`particle particle-${i + 1}`}></div>
              ))}
            </div>
            <div className="gradient-overlay"></div>
          </div>
          
          <div className="banner-content">
            <div className="banner-text">
              <h3 className="banner-title">
          
                <span className="title-brand">ZMusic</span>
              </h3>
              <p className="banner-description">
                Khám phá kho nhạc đa dạng với hàng triệu bài hát từ khắp nơi trên thế giới. 
                Nghe nhạc chất lượng cao, tạo playlist yêu thích!.
              </p>
              {songs.length > 0 && (
                <div className="stats-container">
                  <div className="stat-card">
                    <div className="stat-number">{songs.length}</div>
                    <div className="stat-label">Bài hát</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-card">
                    <div className="stat-number">∞</div>
                    <div className="stat-label">Miễn phí</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="banner-actions">
              <button className="cta-button primary">
                <span>Khám phá ngay</span>
                <div className="button-shine"></div>
              </button>
              <button className="cta-button secondary">
                <span>Tạo playlist</span>
              </button>
            </div>
          </div>
          
          <div className="music-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>
        
        <div className="content-sections">
          <MusicSection 
            title="BXH Nhạc Mới" 
            subtitle="Top những bài hát được nghe nhiều nhất"
            items={getTopHits}
            type="song"
          />
          
          <MusicSection 
            title="Mới Phát Hành" 
            subtitle="Những bài hát mới nhất từ các nghệ sĩ"
            items={getNewReleases}
            type="song"
          />
          
          <MusicSection 
            title="Tất Cả Bài Hát" 
            subtitle="Khám phá kho nhạc đa dạng"
            items={getAllSongs12}
            type="song"
          />
          
          {songs.length > 12 && (
            <MusicSection 
              title="Thêm Nhạc Hay" 
              subtitle="Nhiều bài hát tuyệt vời khác"
              items={getAllSongs20}
              type="song"
            />
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Debug components */}
      <MusicPlayerDebug />
      
      <UserDebugInfo />
      <AdminTestButton />
      <QuickAuthTest />
     
    </div>
  );
}

export default HomePage;