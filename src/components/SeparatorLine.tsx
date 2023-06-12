import React from 'react';

export default function SeparatorLine({ bottom = true }: { bottom?: boolean }) {
  return <div className={`${bottom && 'mb-[15px]'} bg-[#e9730d] h-2 w-full`} />;
}
