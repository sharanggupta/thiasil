
const Heading = ({
  children,
  gradient = "linear-gradient(to right, #009ffd, #2a2a72)",
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