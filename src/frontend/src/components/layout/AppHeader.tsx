import { useNavigate } from '@tanstack/react-router';
import BrandLogo from '../brand/BrandLogo';
import CreditBalanceBadge from '../credits/CreditBalanceBadge';
import AuthButton from '../auth/AuthButton';

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BrandLogo variant="icon" size="sm" />
        </button>
        
        <div className="flex items-center gap-3">
          <CreditBalanceBadge />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

