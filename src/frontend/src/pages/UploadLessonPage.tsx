import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateLesson } from '../hooks/useQueries';
import { fileToUint8Array, validateVideoFile } from '../utils/fileToUint8Array';
import AppShell from '../components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Video } from 'lucide-react';

export default function UploadLessonPage() {
  const navigate = useNavigate();
  const createLesson = useCreateLesson();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditCost, setCreditCost] = useState('3');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setVideoFile(null);
      return;
    }

    setError(null);
    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    const cost = parseInt(creditCost);
    if (isNaN(cost) || cost < 1 || cost > 10) {
      setError('Credit cost must be between 1 and 10');
      return;
    }

    try {
      const videoBytes = await fileToUint8Array(videoFile);
      const lessonId = await createLesson.mutateAsync({
        title,
        description,
        video: videoBytes,
        creditCost: BigInt(cost)
      });
      
      navigate({ to: '/lesson/$lessonId', params: { lessonId: lessonId.toString() } });
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload lesson');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Upload className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Upload a Lesson</h1>
            <p className="text-sm text-muted-foreground">
              Share your knowledge with the community
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>
              Upload a short video lesson (max 100MB, MP4/WebM/MOV)
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to React Hooks"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what students will learn..."
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditCost">Credit Cost *</Label>
                <Input
                  id="creditCost"
                  type="number"
                  value={creditCost}
                  onChange={(e) => setCreditCost(e.target.value)}
                  min={1}
                  max={10}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How many credits should students spend to complete this lesson? (1-10)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video File *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="video"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                  {videoFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{videoFile.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: MP4, WebM, MOV (max 100MB)
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={createLesson.isPending || !videoFile}
                className="w-full"
                size="lg"
              >
                {createLesson.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Lesson
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
