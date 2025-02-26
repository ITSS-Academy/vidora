import { createReducer, on } from '@ngrx/store';
import { CategoryState } from './category.state';
import * as CategoryActions from './category.actions';

const initialState: CategoryState = {
  categories: [],

  isGettingAllCategories: false,
  isGetAllCategoriesSuccess: false,
  getAllCategoriesErrorMessages: '',
};

export const categoryReducer = createReducer(
  initialState,

  on(CategoryActions.getAllCategories, (state, action) => {
    console.log(action.type);
    return <CategoryState>{
      ...state,
      isGettingAllCategories: true,
    };
  }),

  on(CategoryActions.getAllCategoriesSuccess, (state, action) => {
    console.log(action.type);
    return <CategoryState>{
      ...state,
      isGettingAllCategories: false,
      isGetAllCategoriesSuccess: true,
      categories: action.categories,
    };
  }),

  on(CategoryActions.getAllCategoriesFailure, (state, action) => {
    console.log(action.type);
    return <CategoryState>{
      ...state,
      isGettingAllCategories: false,
      getAllCategoriesErrorMessages: action.error,
    };
  }),
);
