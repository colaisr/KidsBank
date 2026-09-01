import type { ReactNode } from 'react';

type PhoneFrameProps = {
  children: ReactNode;
};

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#e8eaed]">
      <div className="flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-surface shadow-none transition-colors duration-300 md:my-4 md:h-[calc(100dvh-2rem)] md:rounded-[2rem] md:shadow-xl">
        {children}
      </div>
    </div>
  );
}
