import { Link } from "react-router-dom";
import logoImg from "../assets/img/vintage logo.png";

const VintageLogo = ({ className }) => {
  return (
    <Link
      to="/"
      className={`flex items-center justify-center group ${className}`}
    >
      <img
        src={logoImg}
        alt="Vintage Logo"
        className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
};

export default VintageLogo;
