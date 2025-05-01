import { ReactNode } from "react";

const Subtitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`font-bold text-xl text-gray-800 ${className || ""}`}>
      {children}
    </h2>
  );
};

export default Subtitle;
