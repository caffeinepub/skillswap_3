export async function fileToUint8Array(file: File, maxSizeBytes: number = 100_000_000): Promise<Uint8Array> {
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeBytes / 1_000_000} MB limit`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime'];
  
  if (!acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a video file (MP4, WebM, or MOV)'
    };
  }
  
  if (file.size > 100_000_000) {
    return {
      valid: false,
      error: 'Video file must be under 100 MB'
    };
  }
  
  return { valid: true };
}
