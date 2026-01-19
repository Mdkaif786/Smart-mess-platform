function GlassBox({ children, className = "" }) {
  return (
    <div
      className={`relative pointer-events-auto glass-box p-6 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default GlassBox;
