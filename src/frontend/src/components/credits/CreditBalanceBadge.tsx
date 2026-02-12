import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { formatCredits } from '../../utils/bigintFormat';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

export default function CreditBalanceBadge() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading || !userProfile) {
    return null;
  }

  return (
    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
      <Coins className="w-4 h-4 text-primary" />
      <span className="font-semibold">{formatCredits(userProfile.remainingLearningCredits)}</span>
    </Badge>
  );
}

