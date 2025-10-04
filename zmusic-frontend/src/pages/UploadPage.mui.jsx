import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Chip,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  MusicNote as MusicIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  FileUpload as FileUploadIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import Header from '../components/Header.mui';
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

function UploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Check admin permission
  React.useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!validateAudioFileType(file)) {
        throw new Error('Định dạng file không hỗ trợ. Chấp nhận: MP3, WAV, FLAC, M4A, AAC');
      }
      
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File audio quá lớn (max 50MB)');
      }
      
      const duration = await getFileDuration(file);
      
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setDuration(duration);
      
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, title: fileName }));
      }
      
      setErrors(prev => ({ ...prev, audioFile: '' }));
    } catch (error) {
      console.error('Audio file error:', error);
      setErrors(prev => ({ ...prev, audioFile: error.message }));
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!validateImageFileType(file)) {
        throw new Error('Định dạng ảnh không hỗ trợ. Chấp nhận: JPG, PNG, WEBP');
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File ảnh quá lớn (max 5MB)');
      }
      
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, coverFile: '' }));
    } catch (error) {
      console.error('Cover file error:', error);
      setErrors(prev => ({ ...prev, coverFile: error.message }));
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setDuration(0);
    if (audioFileRef.current) audioFileRef.current.value = '';
  };

  const removeCoverFile = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverFileRef.current) coverFileRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Tên bài hát là bắt buộc';
    if (!formData.artist.trim()) newErrors.artist = 'Tên nghệ sĩ là bắt buộc';
    
    if (uploadMethod === 'url') {
      if (!formData.filePath.trim()) newErrors.filePath = 'URL audio là bắt buộc';
    } else {
      if (!audioFile) newErrors.audioFile = 'Vui lòng chọn file audio';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);
      
      let response;
      
      if (uploadMethod === 'url') {
        response = await createSongWithUrl({
          title: formData.title,
          artist: formData.artist,
          album: formData.album || null,
          filePath: formData.filePath,
          coverImagePath: formData.coverImagePath || null,
          duration: duration
        });
      } else {
        if (audioFile) {
          const uploadResult = await uploadFiles(audioFile, coverFile);
          setUploadProgress(50);
          
          response = await saveSongToLocal({
            title: formData.title,
            artist: formData.artist,
            album: formData.album || null,
            filePath: uploadResult.audioPath,
            coverImagePath: uploadResult.coverPath,
            duration: duration
          });
        }
      }
      
      setUploadProgress(100);
      setSuccess('Upload bài hát thành công!');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ submit: error.message || 'Upload thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      filePath: '',
      coverImagePath: ''
    });
    removeAudioFile();
    removeCoverFile();
    setErrors({});
    setSuccess('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Header />
      
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Card 
          elevation={4}
          sx={{ 
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.9),
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Upload Bài Hát
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thêm bài hát mới vào thư viện ZMusic
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Alerts */}
            {errors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.submit}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Upload Method Toggle */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Phương thức upload
              </Typography>
              <ToggleButtonGroup
                value={uploadMethod}
                exclusive
                onChange={(e, value) => value && setUploadMethod(value)}
                fullWidth
              >
                <ToggleButton value="url">
                  <LinkIcon sx={{ mr: 1 }} />
                  URL
                </ToggleButton>
                <ToggleButton value="file">
                  <FileUploadIcon sx={{ mr: 1 }} />
                  Upload File
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Basic Info */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Tên bài hát"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      disabled={isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Nghệ sĩ"
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      error={!!errors.artist}
                      helperText={errors.artist}
                      disabled={isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Album"
                      name="album"
                      value={formData.album}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </Grid>
                </Grid>

                {/* URL Method */}
                {uploadMethod === 'url' && (
                  <>
                    <TextField
                      fullWidth
                      required
                      label="URL Audio"
                      name="filePath"
                      value={formData.filePath}
                      onChange={handleInputChange}
                      error={!!errors.filePath}
                      helperText={errors.filePath}
                      placeholder="https://example.com/audio.mp3"
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: <MusicIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="URL Cover Image"
                      name="coverImagePath"
                      value={formData.coverImagePath}
                      onChange={handleInputChange}
                      placeholder="https://example.com/cover.jpg"
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: <ImageIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </>
                )}

                {/* File Upload Method */}
                {uploadMethod === 'file' && (
                  <Stack spacing={2}>
                    {/* Audio File */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          <MusicIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          File Audio *
                        </Typography>
                        
                        <input
                          ref={audioFileRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileChange}
                          style={{ display: 'none' }}
                        />
                        
                        <Button
                          variant="outlined"
                          onClick={() => audioFileRef.current?.click()}
                          disabled={isLoading}
                          startIcon={<FileUploadIcon />}
                        >
                          Chọn file audio
                        </Button>
                        
                        {audioPreview && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={<CheckIcon />}
                              label={audioFile?.name}
                              onDelete={removeAudioFile}
                              color="success"
                              sx={{ maxWidth: '100%' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {(audioFile?.size / (1024 * 1024)).toFixed(2)} MB
                            </Typography>
                          </Stack>
                        )}
                        
                        {errors.audioFile && (
                          <Typography variant="caption" color="error">
                            {errors.audioFile}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>

                    {/* Cover Image */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          <ImageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Cover Image
                        </Typography>
                        
                        <input
                          ref={coverFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileChange}
                          style={{ display: 'none' }}
                        />
                        
                        <Button
                          variant="outlined"
                          onClick={() => coverFileRef.current?.click()}
                          disabled={isLoading}
                          startIcon={<ImageIcon />}
                        >
                          Chọn ảnh bìa
                        </Button>
                        
                        {coverPreview && (
                          <Box>
                            <Box
                              component="img"
                              src={coverPreview}
                              alt="Cover preview"
                              sx={{
                                width: '100%',
                                maxWidth: 200,
                                borderRadius: 2,
                                mb: 1,
                              }}
                            />
                            <Chip
                              icon={<CheckIcon />}
                              label={coverFile?.name}
                              onDelete={removeCoverFile}
                              color="success"
                            />
                          </Box>
                        )}
                        
                        {errors.coverFile && (
                          <Typography variant="caption" color="error">
                            {errors.coverFile}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Stack>
                )}

                {/* Progress Bar */}
                {isLoading && (
                  <Box>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
                      Đang upload... {uploadProgress}%
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />}
                  >
                    {isLoading ? 'Đang upload...' : 'Upload bài hát'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default UploadPage;
