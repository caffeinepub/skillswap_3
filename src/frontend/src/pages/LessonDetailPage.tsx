import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetLesson } from '../hooks/useQueries';
import { useCompleteLesson } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import AppShell from '../components/layout/AppShell';
import VideoPlayer from '../components/lessons/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '../utils/bigintFormat';
import { Loader2, ArrowLeft, Coins, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function LessonDetailPage() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' });
  const navigate = useNavigate();
  const { data: lesson, isLoading } = useGetLesson(BigInt(lessonId));
  const { data: userProfile } = useGetCallerUserProfile();
  const completeLesson = useCompleteLesson();
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    if (!lesson || !userProfile) return;

    try {
      await completeLesson.mutateAsync(lesson.id);
      setCompleted(true);
    } catch (error: any) {
      console.error('Failed to complete lesson:', error);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!lesson) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lesson not found</p>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            Back to Lessons
          </Button>
        </div>
      </AppShell>
    );
  }

  const hasEnoughCredits = userProfile && userProfile.remainingLearningCredits >= lesson.creditCost;
  const canComplete = hasEnoughCredits && !completed;

  return (
    <AppShell>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1.5 shrink-0">
                <Coins className="w-4 h-4" />
                {lesson.creditCost.toString()} credits
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <VideoPlayer videoBytes={lesson.video} className="aspect-video" />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Creator: {lesson.creator.toString().slice(0, 16)}...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDateTime(lesson.createdAt)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              {completed ? (
                <div className="flex items-center justify-center gap-2 py-4 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Lesson completed!</span>
                </div>
              ) : (
                <>
                  {!hasEnoughCredits && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                      You need {lesson.creditCost.toString()} credits to complete this lesson.
                      You currently have {userProfile?.remainingLearningCredits.toString() || '0'} credits.
                    </div>
                  )}
                  
                  <Button
                    onClick={handleComplete}
                    disabled={!canComplete || completeLesson.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {completeLesson.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Complete Lesson ({lesson.creditCost.toString()} credits)
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

