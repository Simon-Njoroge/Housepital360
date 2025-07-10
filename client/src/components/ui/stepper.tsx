// components/ui/stepper.tsx
import React from "react";

export const Stepper = ({
  children,
  activeStep,
}: {
  children: React.ReactElement<{ active?: boolean; label: string }> | React.ReactElement<{ active?: boolean; label: string }>[];
  activeStep: number;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { active: index <= activeStep })
      )}
    </div>
  );
};

export const Step = ({ label, active }: { label: string; active?: boolean }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${
          active ? "bg-blue-600" : "bg-gray-300"
        }`}
      ></div>
      <span className={active ? "font-semibold text-blue-700" : "text-gray-500"}>{label}</span>
    </div>
  );
};
