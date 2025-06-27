const Heading = ({
  children,
  gradient = "var(--primary-gradient)",
  as: Tag = "h1",
  className = "",
  ...props
}) => {
  return (
    <Tag
      className={`heading ${className}`}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        color: "transparent",
        letterSpacing: "0.2rem",
        fontWeight: 700,
        margin: 0,
        display: "inline-block",
        textTransform: "uppercase",
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading; 