import { CategoryModel } from '../../../../../Vita/client/src/models/category.model';

export interface CategoryState {
  categories: CategoryModel[];

  isGettingAllCategories: boolean;
  isGetAllCategoriesSuccess: boolean;
  getAllCategoriesErrorMessages: '';
}
