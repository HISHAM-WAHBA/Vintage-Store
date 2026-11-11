/**
 * Material Symbols icon wrapper.
 * Usage: <Icon name="favorite" fill size={16} className="text-primary" />
 */
const Icon = ({ name, fill = false, size, className = "" }) => (
  <span
    aria-hidden="true"
    className={`material-symbols-outlined ${fill ? "fill" : ""} ${className}`}
    style={size ? { fontSize: `${size}px` } : undefined}
  >
    {name}
  </span>
);

export default Icon;
