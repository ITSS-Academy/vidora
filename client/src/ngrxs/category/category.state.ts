import {CategoryModel} from '../../models/category.model';

export interface CategoryState {
  categories: any[];
  isGettingAllCategories: boolean;
  isGetAllCategoriesSuccess: boolean;
  getAllCategoriesErrorMessages: string;
}
