import React from 'react';

type stepsProps = {
  title?: string;
  step: number;
};

function Steps({ title, step }: stepsProps) {
  return (
    <div
      className={`flex ${
        !!title ? 'justify-between' : 'justify-center'
      } items-center `}
    >
      <h2 className="text-[#f26f21] font-medium leading-[1.1] title-size mb-2.5 mt-5 ">
        {title}
      </h2>
      <h3
        className={`text-lg font-medium text-right leading-[1.9] text-[#e9730d] ${
          title && 'mt-4'
        }`}
      >
        Step {step} out of 3
      </h3>
    </div>
  );
}

export default Steps;
