import { useEffect, useState } from 'react';
import { getRandomBackground } from '@/utils/images';

export function BackgroundImage() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(getRandomBackground());
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}