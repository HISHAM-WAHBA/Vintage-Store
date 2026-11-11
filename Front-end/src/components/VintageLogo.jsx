import { Link } from "react-router-dom";
import logoImg from "../assets/img/vintage logo.png";

const VintageLogo = ({ className = "" }) => (
  <Link
    to="/"
    aria-label="Vintage home"
    className="group inline-flex items-center"
  >
    <img
      src={logoImg}
      alt="Vintage Logo"
      className={`h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
    />
  </Link>
);

export default VintageLogo;
