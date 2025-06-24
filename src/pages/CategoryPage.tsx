
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionamento para a página de serviços com o filtro de categoria aplicado
    navigate(`/services?category=${categoryId}`);
  }, [categoryId, navigate]);

  return null;
};

export default CategoryPage;
