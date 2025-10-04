import React, { useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  IconButton, 
  Typography, 
  Slider, 
  Stack,
  LinearProgress,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay as ReplayIcon,
  SkipNext as SkipNextIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function MusicPlayer() {
  const theme = useTheme();
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    error,
    togglePlayPause,
    stopSong,
    seekTo,
    changeVolume,
    getUrlType
  } = useMusicPlayer();

  const [showVolume, setShowVolume] = React.useState(false);

  // Handle restart song
  const handleRestart = () => {
    seekTo(0);
  };

  // Handle next song
  const handleNext = () => {
    console.log('Next song feature - coming soon!');
    stopSong();
  };

  // Add/remove body class when player is shown
  useEffect(() => {
    if (currentSong) {
      document.body.classList.add('has-music-player');
    } else {
      document.body.classList.remove('has-music-player');
    }

    return () => {
      document.body.classList.remove('has-music-player');
    };
  }, [currentSong]);

  // Don't render if no song is selected
  if (!currentSong) {
    return null;
  }

  const handleProgressChange = (event, newValue) => {
    const newTime = (newValue / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (event, newValue) => {
    changeVolume(newValue / 100);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const urlType = getUrlType(currentSong?.filePath || '');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.default, 0.98)})`,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: `0 -4px 30px ${alpha('#000', 0.3)}`,
      }}
    >
      {/* Loading progress bar */}
      {isLoading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            height: 3,
          }} 
        />
      )}

      <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
        {/* Progress Bar */}
        <Slider
          value={progress}
          onChange={handleProgressChange}
          aria-label="Playback progress"
          sx={{
            mb: 2,
            height: 6,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.3,
            },
          }}
        />

        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ width: '100%' }}
        >
          {/* Song Info */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                width: 56, 
                height: 56, 
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <CardMedia
                component="img"
                image={currentSong.coverUrl || '/music.png'}
                alt={currentSong.title}
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Card>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentSong.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentSong.artist || 'Unknown Artist'}
              </Typography>
            </Box>

            {urlType && (
              <Chip 
                label={urlType.toUpperCase()} 
                size="small"
                color="primary"
                variant="outlined"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              />
            )}
          </Stack>

          {/* Playback Controls */}
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                minWidth: 45,
                textAlign: 'right',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {formatTime(currentTime)}
            </Typography>

            <IconButton
              onClick={handleRestart}
              size="medium"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <ReplayIcon />
            </IconButton>

            <IconButton
              onClick={togglePlayPause}
              disabled={isLoading}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                '&.Mui-disabled': {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            >
              {isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
            </IconButton>

            <IconButton
              onClick={handleNext}
              size="medium"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <SkipNextIcon />
            </IconButton>

            <Typography 
              variant="caption"
              sx={{ 
                minWidth: 45,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {formatTime(duration)}
            </Typography>
          </Stack>

          {/* Volume Control */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ 
              width: { xs: 'auto', md: 200 },
              flexShrink: 0,
            }}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <IconButton 
              size="small"
              onClick={() => changeVolume(volume > 0 ? 0 : 1)}
              sx={{ color: 'text.secondary' }}
            >
              {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>

            <Slider
              value={volume * 100}
              onChange={handleVolumeChange}
              aria-label="Volume"
              sx={{
                display: { xs: 'none', md: 'block' },
                opacity: showVolume ? 1 : 0.5,
                transition: 'opacity 0.3s',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              }}
            />
          </Stack>
        </Stack>

        {/* Error Message */}
        {error && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              mt: 1,
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MusicPlayer;
