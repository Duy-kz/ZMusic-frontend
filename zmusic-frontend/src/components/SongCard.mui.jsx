import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

function SongCard({ song, onPlay }) {
  const theme = useTheme();
  const { currentSong, isPlaying } = useMusicPlayer();
  const [isFavorite, setIsFavorite] = React.useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(song);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    console.log('More options for:', song.title);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        borderRadius: 2,
        background: isCurrentSong 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.background.paper, 0.9)})`
          : alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        border: isCurrentSong ? `2px solid ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.3)}`,
          '& .play-button': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
      onClick={handlePlayClick}
    >
      {/* Cover Image */}
      <Box sx={{ position: 'relative', paddingTop: '100%' }}>
        <CardMedia
          component="img"
          image={song.coverUrl || song.coverImagePath || '/music.png'}
          alt={song.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Play Button Overlay */}
        <IconButton
          className="play-button"
          onClick={handlePlayClick}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isCurrentlyPlaying ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
            opacity: isCurrentlyPlaying ? 1 : 0,
            transition: 'all 0.3s ease',
            bgcolor: theme.palette.primary.main,
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          }}
        >
          {isCurrentlyPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
        </IconButton>

        {/* Currently Playing Badge */}
        {isCurrentSong && (
          <Chip
            label={isPlaying ? "Đang phát" : "Tạm dừng"}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5,
            color: isCurrentSong ? 'primary.main' : 'text.primary',
          }}
          title={song.title}
        >
          {song.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={song.artist}
        >
          {song.artist || 'Unknown Artist'}
        </Typography>
        {song.album && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 0.5,
            }}
            title={song.album}
          >
            {song.album}
          </Typography>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'space-between' }}>
        <Box>
          {song.duration && (
            <Typography variant="caption" color="text.secondary">
              {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
            </Typography>
          )}
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{
              color: isFavorite ? 'error.main' : 'text.secondary',
              transition: 'all 0.3s',
              '&:hover': {
                color: 'error.main',
                transform: 'scale(1.2)',
              },
            }}
          >
            {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleMoreClick}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}

export default SongCard;
