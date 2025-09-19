# ZMusic File Upload - Hướng dẫn sử dụng

## Tích hợp với Backend .NET API

### 1. Backend Requirements

Đảm bảo backend .NET API của bạn có:

#### a) UploadController đã được tạo:

- Endpoint: `POST /api/upload/songs`
- Nhận `[FromForm] UploadSongRequest`
- Yêu cầu Authorization với Role "Admin"
- Lưu files vào `wwwroot/music` và `wwwroot/covers`

#### b) Static Files Middleware:

```csharp
// Trong Program.cs hoặc Startup.cs
app.UseStaticFiles(); // Serve files từ wwwroot
```

#### c) CORS Configuration (nếu cần):

```csharp
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

### 2. Frontend Integration

#### a) File Upload Service:

- `uploadFiles()` - Upload file lên .NET API
- `validateAudioFileType()` - Validate audio files (MP3, WAV, FLAC, M4A, AAC)
- `validateImageFileType()` - Validate image files (JPG, PNG, WEBP)
- `getFileDuration()` - Lấy thời lượng audio file

#### b) Form Data:

Frontend gửi dữ liệu dưới dạng `FormData`:

- `AudioFile`: File audio (required)
- `CoverFile`: File cover image (optional)
- `Title`: Tên bài hát
- `Artist`: Nghệ sĩ
- `Album`: Album
- `Duration`: Thời lượng (giây)

#### c) URL Handling cho File Playback:

Frontend tự động xử lý các loại URL:

- **Backend files** (`/music/abc.mp3`): Tự động build thành `http://localhost:5000/music/abc.mp3`
- **Blob URLs** (`blob:...`): File upload tạm thời trong session
- **Direct URLs** (`http://...`): Link trực tiếp từ internet
- **Local files** (`/public/...`): File trong thư mục public của frontend

**Environment Variable (.env):**

```
VITE_API_URL=http://localhost:5000
```

Thay đổi port phù hợp với backend .NET của bạn.

#### c) Authentication:

- Tự động gửi Bearer token từ localStorage
- Chỉ Admin mới có thể upload

### 3. File Validation

#### Audio Files:

- Formats: MP3, WAV, FLAC, M4A, AAC
- Max size: 50MB
- Duration: Tự động detect

#### Cover Images:

- Formats: JPG, JPEG, PNG, WEBP
- Max size: 5MB

### 4. Usage Flow

1. **Login**: User đăng nhập với role Admin
2. **Navigate**: Vào trang `/upload`
3. **Select Method**: Chọn "📁 Upload File"
4. **Fill Form**:
   - Chọn file audio (required)
   - Chọn cover image (optional)
   - Điền thông tin bài hát
5. **Upload**: Click "Tải lên"
6. **Result**: File được lưu vào backend và hiển thị ở trang chủ

### 5. Error Handling

- **401 Unauthorized**: "Không có quyền truy cập. Vui lòng đăng nhập lại."
- **403 Forbidden**: "Chỉ Admin mới có thể upload nhạc."
- **File size**: "File quá lớn. Kích thước tối đa là XMB"
- **File type**: "Định dạng file không được hỗ trợ. Chỉ chấp nhận: ..."
- **Server error**: Hiển thị message từ backend

### 6. Fallback Mechanism

Nếu upload server thất bại:

- Hiển thị lỗi cụ thể
- Đề xuất lưu vào localStorage
- Sử dụng blob URL tạm thời
- Chỉ có thể phát trong session hiện tại

### 7. Testing

1. **Start Backend**: Đảm bảo .NET API đang chạy
2. **Start Frontend**: `npm run dev`
3. **Login Admin**: Đăng nhập với tài khoản Admin
4. **Test Upload**: Thử upload file nhạc

### 8. File Storage Structure

```
backend/
├── wwwroot/
│   ├── music/           # Audio files
│   │   └── {timestamp}_{filename}.mp3
│   └── covers/          # Cover images
│       └── {timestamp}_{filename}.jpg
```

### 9. API Response

Successful upload response:

```json
{
  "success": true,
  "message": "Song uploaded successfully",
  "song": {
    "id": 123,
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "duration": 180,
    "filePath": "/music/12345_song.mp3",
    "coverImagePath": "/covers/12345_cover.jpg",
    "createdAt": "2025-09-17T10:30:00Z",
    "createdByUsername": "admin"
  }
}
```

### 10. Troubleshooting

**File không phát được:**

- Kiểm tra file đã được lưu vào `wwwroot/music`
- Kiểm tra Static Files Middleware
- Kiểm tra đường dẫn file trong database

**Upload thất bại:**

- Kiểm tra token authentication
- Kiểm tra user role (phải là Admin)
- Kiểm tra file size và format
- Kiểm tra CORS configuration

**Không thấy file mới:**

- Refresh trang chủ
- Kiểm tra database có record mới
- Kiểm tra getAllSongs API
