const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`font-extrabold text-2xl text-gray-800 ${className || ""}`}>
      {children}
    </h2>
  );
};

export default Title;
