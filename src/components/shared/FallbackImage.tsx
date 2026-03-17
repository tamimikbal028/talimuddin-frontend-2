import { useState, type ImgHTMLAttributes } from "react";
import {
  getAvatarFallbackClassName,
  getCoverFallbackClassName,
  getInitials,
  hasImageSource,
} from "../../utils/imageFallback";

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

type BaseImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  name?: string | null;
  fallbackClassName?: string;
  textClassName?: string;
};

export const AvatarImage = ({
  src,
  name,
  alt,
  className,
  fallbackClassName,
  textClassName,
  onError,
  ...imgProps
}: BaseImageProps) => {
  const [hasError, setHasError] = useState(false);
  const label = alt || name || "Avatar";

  if (hasImageSource(src) && !hasError) {
    return (
      <img
        {...imgProps}
        src={src}
        alt={label}
        className={className}
        onError={(event) => {
          setHasError(true);
          onError?.(event);
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={joinClasses(
        "flex items-center justify-center overflow-hidden text-white select-none",
        getAvatarFallbackClassName(name),
        className,
        fallbackClassName
      )}
    >
      <span className={joinClasses("font-semibold uppercase", textClassName)}>
        {getInitials(name)}
      </span>
    </div>
  );
};

type CoverImageProps = BaseImageProps & {
  showName?: boolean;
};

export const CoverImage = ({
  src,
  name,
  alt,
  className,
  fallbackClassName,
  textClassName,
  onError,
  showName = false,
  ...imgProps
}: CoverImageProps) => {
  const [hasError, setHasError] = useState(false);
  const label = alt || name || "Cover image";

  if (hasImageSource(src) && !hasError) {
    return (
      <img
        {...imgProps}
        src={src}
        alt={label}
        className={className}
        onError={(event) => {
          setHasError(true);
          onError?.(event);
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={joinClasses(
        "flex h-full w-full items-center justify-center overflow-hidden text-white",
        getCoverFallbackClassName(name),
        className,
        fallbackClassName
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={joinClasses(
            "text-4xl font-bold tracking-wide text-white/95 uppercase",
            textClassName
          )}
        >
          {getInitials(name, 1)}
        </span>
        {showName && name && (
          <span className="max-w-full truncate text-xs font-medium tracking-[0.2em] text-white/80 uppercase">
            {name}
          </span>
        )}
      </div>
    </div>
  );
};
