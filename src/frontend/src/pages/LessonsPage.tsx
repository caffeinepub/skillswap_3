import { useGetAllLessons } from '../hooks/useQueries';
import AppShell from '../components/layout/AppShell';
import LessonCard from '../components/lessons/LessonCard';
import { Loader2, BookOpen } from 'lucide-react';

export default function LessonsPage() {
  const { data: lessons, isLoading, error } = useGetAllLessons();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Explore Lessons</h1>
            <p className="text-sm text-muted-foreground">
              Learn new skills from the community
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load lessons</p>
          </div>
        )}

        {lessons && lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No lessons available yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to upload a lesson!
            </p>
          </div>
        )}

        {lessons && lessons.length > 0 && (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id.toString()} lesson={lesson} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

