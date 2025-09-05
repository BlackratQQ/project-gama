import React from 'react';

interface CallToActionBtnProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  width?: string;
  textPosition?: string;
  textSize?: string;
  minHeightClass?: string;
}

export default function CallToActionBtn({
  text,
  href,
  onClick,
  className = '',
  width = '100%',
  textPosition = 'justify-center text-center',
  textSize = 'text-lg',
  minHeightClass = 'min-h-[50px]',
}: CallToActionBtnProps) {
  const buttonContent = (
    <>
      <span
        className={`call-to-action-mas ${textPosition} ${textSize} ${className} ${minHeightClass}`}
      >
        {text}
      </span>
      <button
        type="button"
        name="Hover"
        className={`block w-full rounded-lg px-4 py-2 font-bold ${textPosition} ${className} ${minHeightClass} ${textSize} call-to-action-btn`}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );

  if (href) {
    if (href.startsWith('#')) {
      return (
        <div
          className={`call-to-action-button-container ${textPosition} ${className} ${minHeightClass}`}
          style={{ width }}
        >
          <a
            href={href}
            className={`block cursor-pointer w-full rounded-lg px-4 py-2 font-bold ${textPosition} ${className} ${minHeightClass} ${textSize} call-to-action-btn`}
          >
            <span
              className={`call-to-action-mas ${textPosition} ${textSize} ${className} ${minHeightClass}`}
            >
              {text}
            </span>
            {text}
          </a>
        </div>
      );
    } else {
      return (
        <div
          className={`call-to-action-button-container ${textPosition} ${className} ${minHeightClass}`}
          style={{ width }}
        >
          <a
            href={href}
            className={`block w-full rounded-lg px-4 py-2 font-bold ${textPosition} ${className} ${minHeightClass} ${textSize} call-to-action-btn`}
          >
            <span
              className={`call-to-action-mas ${textPosition} ${textSize} ${className} ${minHeightClass}`}
            >
              {text}
            </span>
            {text}
          </a>
        </div>
      );
    }
  }

  return (
    <div
      className={`call-to-action-button-container ${textPosition} ${className} ${minHeightClass}`}
      style={{ width }}
    >
      {buttonContent}
    </div>
  );
}
