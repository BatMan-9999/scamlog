import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function BaseImage({
  src: originalSrc,
  image,
  fallback,
}: BaseImageProps) {
  const [src, setSrc] = useState(originalSrc);

  return (
    // included in rest param
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...image}
      src={src}
      onError={() => {
        setSrc(fallback);
      }}
    />
  );
}

export interface BaseImageProps {
  src: string;
  fallback: string;
  image: ImageProps;
}
