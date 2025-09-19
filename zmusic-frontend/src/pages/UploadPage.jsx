import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  createSongWithUrl, 
  validateAudioFile, 
  validateImageFile, 
  getAudioDuration 
} from '../services/uploadService';
import { getCurrentUser } from '../services/authService';
import { 
  uploadFiles, 
  saveSongToLocal, 
  validateAudioFileType, 
  validateImageFileType, 
  getFileDuration 
} from '../services/fileUploadService';
import Header from '../components/Header';
import '../assets/css/pages/UploadPage.css';

function UploadPage() {
  const navigate = useNavigate();
  const audioFileRef = useRef(null);
  const coverFileRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    filePath: '',
    coverImagePath: ''
  });
  
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' hoặc 'file'
  const [errors, setErrors] = useState({});

  // Kiểm tra quyền admin
  React.useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Xử lý chọn file âm thanh
  const handleAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type với service mới
      if (!validateAudioFileType(file)) {
        throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận: MP3, WAV, FLAC, M4A, AAC');
      }
      
      // Validate file size (max 50MB - theo backend validation)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File quá lớn. Kích thước tối đa là 50MB');
      }
      
      setAudioFile(file);
      
      // Tạo URL preview
      const audioUrl = URL.createObjectURL(file);
      setAudioPreview(audioUrl);
      
      // Lấy thời lượng với service mới
      try {
        const audioDuration = await getFileDuration(file);
        setDuration(audioDuration);
      } catch (durationError) {
        console.warn('Could not get file duration:', durationError);
        setDuration(0);
      }
      
      // Auto fill title từ tên file nếu chưa có
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension
        setFormData(prev => ({
          ...prev,
          title: fileName
        }));
      }
      
      setErrors(prev => ({ ...prev, audioFile: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, audioFile: error.message }));
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  // Xử lý chọn file ảnh cover
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type với service mới
      if (!validateImageFileType(file)) {
        throw new Error('Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, WEBP');
      }
      
      // Validate file size (max 5MB - theo backend validation)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File ảnh quá lớn. Kích thước tối đa là 5MB');
      }
      
      setCoverFile(file);
      
      // Tạo URL preview
      const imageUrl = URL.createObjectURL(file);
      setCoverPreview(imageUrl);
      
      setErrors(prev => ({ ...prev, coverFile: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, coverFile: error.message }));
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên bài hát là bắt buộc';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Tên nghệ sĩ là bắt buộc';
    }

    if (uploadMethod === 'url') {
      if (!formData.filePath.trim()) {
        newErrors.filePath = 'URL file nhạc là bắt buộc';
      } else if (!isValidUrl(formData.filePath)) {
        newErrors.filePath = 'URL không hợp lệ';
      }
    } else {
      if (!audioFile) {
        newErrors.audioFile = 'Vui lòng chọn file nhạc';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Kiểm tra URL hợp lệ
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (uploadMethod === 'url') {
        await handleUrlUpload();
      } else {
        await handleFileUpload();
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      let errorMessage = 'Lỗi không xác định';
      if (error.response?.status === 401) {
        errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Chỉ Admin mới có thể upload nhạc.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      
      alert('Lỗi khi tải lên: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý upload bằng URL
  const handleUrlUpload = async () => {
    // Debug user info
    const user = getCurrentUser();
    console.log('👤 Current user:', user);
    console.log('🔑 Auth token:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');
    
    const songData = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim(),
      duration: duration || 0,
      filePath: formData.filePath.trim(),
      coverImagePath: formData.coverImagePath.trim() || null
    };

    console.log('📤 About to upload song data:', songData);

    const result = await createSongWithUrl(songData);
    
    console.log('✅ Upload successful:', result);
    
    // Thành công - chuyển về trang chủ
    alert('Tải lên bài hát thành công!');
    navigate('/');
  };

  // Xử lý upload file với .NET backend
  const handleFileUpload = async () => {
    console.log('📁 Starting file upload to .NET backend...');
    
    const songData = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim(),
      duration: duration || 0
    };

    try {
      // Upload lên .NET backend
      console.log('🚀 Uploading to .NET API...');
      const uploadResult = await uploadFiles(audioFile, coverFile, songData);
      
      if (uploadResult.success) {
        console.log('✅ Upload successful:', uploadResult);
        alert('Tải lên file thành công!');
        
        // Redirect về trang chủ để refresh danh sách nhạc
        navigate('/');
        return;
      }
    } catch (serverError) {
      console.error('❌ Server upload failed:', serverError);
      
      // Hiển thị lỗi cụ thể từ backend
      let errorMessage = 'Lỗi không xác định';
      if (serverError.message.includes('401') || serverError.message.includes('Unauthorized')) {
        errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
      } else if (serverError.message.includes('403') || serverError.message.includes('Admin')) {
        errorMessage = 'Chỉ Admin mới có thể upload nhạc.';
      } else {
        errorMessage = serverError.message;
      }
      
      // Thử fallback với localStorage
      if (confirm(`Upload lên server thất bại: ${errorMessage}\n\nBạn có muốn lưu tạm thời vào localStorage không?`)) {
        console.log('💾 Saving to localStorage as fallback...');
        const blobUrl = URL.createObjectURL(audioFile);
        const fallbackSongData = {
          ...songData,
          filePath: blobUrl,
          coverImagePath: coverFile ? URL.createObjectURL(coverFile) : null,
          isLocalFile: true
        };

        await saveSongToLocal(fallbackSongData);
        
        console.log('✅ Saved to localStorage:', fallbackSongData);
        alert('Đã lưu vào localStorage! (Chỉ có thể phát trong session này)');
        navigate('/');
      } else {
        throw serverError; // Re-throw để hiển thị lỗi gốc
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      filePath: '',
      coverImagePath: ''
    });
    setAudioFile(null);
    setCoverFile(null);
    setAudioPreview(null);
    setCoverPreview(null);
    setDuration(0);
    setErrors({});
    
    if (audioFileRef.current) audioFileRef.current.value = '';
    if (coverFileRef.current) coverFileRef.current.value = '';
  };

  return (
    <>
      <Header />
      <div className="upload-page">
        <div className="upload-container">
          <div className="upload-header">
            <h1>🎵 Tải lên bài hát mới</h1>
            <p>Chỉ dành cho Admin - Thêm nhạc vào hệ thống</p>
          </div>

        {/* Chọn phương thức upload */}
        <div className="upload-method-selector">
          <button 
            className={`method-btn ${uploadMethod === 'url' ? 'active' : ''}`}
            onClick={() => setUploadMethod('url')}
          >
            📎 URL Link
          </button>
          <button 
            className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
            onClick={() => setUploadMethod('file')}
          >
            📁 Upload File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3>📝 Thông tin bài hát</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Tên bài hát *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên bài hát..."
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="artist">Nghệ sĩ *</label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  placeholder="Nhập tên nghệ sĩ..."
                  className={errors.artist ? 'error' : ''}
                />
                {errors.artist && <span className="error-text">{errors.artist}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                placeholder="Nhập tên album (tùy chọn)..."
              />
            </div>
          </div>

          {/* URL Method */}
          {uploadMethod === 'url' && (
            <div className="form-section">
              <h3>🔗 Đường dẫn file</h3>
              
              <div className="form-group">
                <label htmlFor="filePath">URL file nhạc *</label>
                <input
                  type="url"
                  id="filePath"
                  name="filePath"
                  value={formData.filePath}
                  onChange={handleInputChange}
                  placeholder="https://example.com/song.mp3"
                  className={errors.filePath ? 'error' : ''}
                />
                {errors.filePath && <span className="error-text">{errors.filePath}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="coverImagePath">URL ảnh cover</label>
                <input
                  type="url"
                  id="coverImagePath"
                  name="coverImagePath"
                  value={formData.coverImagePath}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cover.jpg (tùy chọn)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Thời lượng (giây)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  placeholder="Nhập thời lượng bài hát..."
                  min="0"
                />
                <small>Ví dụ: 180 = 3 phút</small>
              </div>
            </div>
          )}

          {/* File Upload Method */}
          {uploadMethod === 'file' && (
            <div className="form-section">
              <h3>📁 Upload files</h3>
              
              <div className="file-upload-area">
                <div className="form-group">
                  <label htmlFor="audioFile">File nhạc *</label>
                  <input
                    type="file"
                    id="audioFile"
                    ref={audioFileRef}
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className={errors.audioFile ? 'error' : ''}
                  />
                  {errors.audioFile && <span className="error-text">{errors.audioFile}</span>}
                  
                  {audioPreview && (
                    <div className="audio-preview">
                      <audio controls src={audioPreview} />
                      <p>Thời lượng: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="coverFile">Ảnh cover</label>
                  <input
                    type="file"
                    id="coverFile"
                    ref={coverFileRef}
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className={errors.coverFile ? 'error' : ''}
                  />
                  {errors.coverFile && <span className="error-text">{errors.coverFile}</span>}
                  
                  {coverPreview && (
                    <div className="image-preview">
                      <img src={coverPreview} alt="Cover Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {formData.filePath && uploadMethod === 'url' && (
            <div className="form-section">
              <h3>👀 Preview</h3>
              <div className="song-preview">
                <div className="preview-cover">
                  {formData.coverImagePath ? (
                    <img src={formData.coverImagePath} alt="Cover" onError={(e) => {
                      e.target.style.display = 'none';
                    }} />
                  ) : (
                    <div className="default-cover">🎵</div>
                  )}
                </div>
                <div className="preview-info">
                  <h4>{formData.title || 'Chưa có tên'}</h4>
                  <p>Nghệ sĩ: {formData.artist || 'Chưa có tên nghệ sĩ'}</p>
                  <p>Album: {formData.album || 'Single'}</p>
                  <p>Thời lượng: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
              
              {formData.filePath && (
                <div className="audio-test">
                  <audio controls src={formData.filePath} />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn-reset"
              disabled={isLoading}
            >
               Reset
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
              disabled={isLoading}
            >
               Hủy
            </button>
            
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Đang tải lên...' : ' Tải lên'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default UploadPage;