import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate("/products"); // auto go to products page
  };

  return (
    <input
      type="text"
      placeholder="Search for products..."
      value={searchTerm}
      onChange={handleSearch}
      className="search-input"
    />
  );
};

export default Navbar;
