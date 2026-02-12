import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../../utils/bigintFormat';
import { Coins, User } from 'lucide-react';
import type { Lesson } from '../../backend';

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate({ to: '/lesson/$lessonId', params: { lessonId: lesson.id.toString() } })}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
          <Badge variant="secondary" className="gap-1 shrink-0">
            <Coins className="w-3 h-3" />
            {lesson.creditCost.toString()}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="truncate">{lesson.creator.toString().slice(0, 8)}...</span>
          </div>
          <span>{formatDate(lesson.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

