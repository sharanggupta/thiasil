interface HeadingProps {
  children: any;
  gradient?: string;
  as?: any;
  className?: string;
  [key: string]: any;
}

const Heading = ({
  children,
  gradient = "var(--primary-gradient)",
  as: Tag = "h1",
  className = "",
  ...props
}: HeadingProps) => {
  return (
    <Tag
      className={`heading ${className}`}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        color: "transparent",
        margin: 0,
        display: "inline-block",
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;
