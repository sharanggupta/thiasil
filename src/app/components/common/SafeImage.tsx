'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { logError, ERROR_CATEGORIES, ERROR_LEVELS } from '@/lib/error';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.webp',
  showPlaceholder = true,
  className = '',
  priority = false,
  lazy = true,
  ...props
}: SafeImageProps) {
  // Filter out loading prop to prevent conflicts
  const { loading: propsLoading, ...imageProps } = props;
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = (error?: any) => {
    // Log the image loading error
    logError(error || new Error('Image failed to load'), {
      category: ERROR_CATEGORIES.NETWORK,
      level: ERROR_LEVELS.LOW,
      imageSrc: imgSrc,
      fallbackSrc,
    });

    setHasError(true);
    setIsLoading(false);

    // Try fallback image if we haven't already
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If both original and fallback failed, show placeholder
  if (hasError && imgSrc === fallbackSrc) {
    return showPlaceholder ? (
      <div className={`flex items-center justify-center bg-white/5 rounded-lg ${className}`} {...props}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-xs text-white/60">
            {alt || 'Image unavailable'}
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: imageProps.width && imageProps.height ? `${imageProps.width}/${imageProps.height}` : '1' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        loading={lazy ? 'lazy' : 'eager'}
        style={{ aspectRatio: imageProps.width && imageProps.height ? `${imageProps.width}/${imageProps.height}` : '1' }}
        {...imageProps}
      />
    </div>
  );
}