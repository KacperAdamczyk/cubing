import { getCategories } from "@/queries/getCategories";
import type { FC } from "react";

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.map(({ id }) => ({
    categoryId: id,
  }));
};

interface Props {
  params: {
    categoryId: string;
  };
}

const CategoryPage: FC<Props> = ({ params: { categoryId } }) => {
  return (
    <div>
      <h1>Category Page: {categoryId}</h1>
    </div>
  );
};

export default CategoryPage;
