interface BrandLogoProps {
  variant?: 'icon' | 'wordmark' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BrandLogo({ variant = 'full', size = 'md', className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  if (variant === 'icon') {
    return (
      <img
        src="/assets/generated/skillswap-icon.dim_512x512.png"
        alt="SkillSwap"
        className={`${sizeClasses[size]} w-auto ${className}`}
      />
    );
  }

  if (variant === 'wordmark') {
    return (
      <img
        src="/assets/generated/skillswap-wordmark.dim_1200x300.png"
        alt="SkillSwap"
        className={`${sizeClasses[size]} w-auto ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/assets/generated/skillswap-icon.dim_512x512.png"
        alt="SkillSwap"
        className={`${sizeClasses[size]} w-auto`}
      />
      <img
        src="/assets/generated/skillswap-wordmark.dim_1200x300.png"
        alt="SkillSwap"
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
}

