import { Category } from '../models';
import { requestJson, Method } from './utils';

export async function listCategorys(search: string | null = null): Promise<Category[]> {
  return await requestJson(Method.GET, 'categories' + (search ? '?search=' + search : ''));
}

export async function createCategory(category: Category): Promise<string> {
  return await requestJson(Method.PUT, 'categories', category);
}

export async function getCategory(id: string): Promise<Category> {
  return await requestJson(Method.GET, 'category/' + id);
}

export async function updateCategory(category: Category) {
  return await requestJson(Method.POST, 'category/' + category.id);
}

export async function deleteCategory(category: Category) {
  return await requestJson(Method.DELETE, 'category/' + category.id);
}
