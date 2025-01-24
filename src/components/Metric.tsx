import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imgUrl: string | null;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
}: Props) => {
  const initials = alt
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const metricContent = (
    <>
      {/* implemented custom avatar logic */}
      {imgUrl ? (
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`rounded-full object-contain ${imgStyles}`}
        />
      ) : (
        <div
          className={`primary-gradient flex h-4 w-4 items-center justify-center rounded-full ${imgStyles}`}
        >
          <span className="text-[8px] font-bold text-light-900">
            {initials}
          </span>
        </div>
      )}

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
