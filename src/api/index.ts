// Main API exports
export * from './database';
export * from './debugService';
export { itemsService } from './itemsService';
export * from './types';

// Service stubs for missing services
export const capsulesService = {
  getAllCapsules: async () => ({ success: false, error: 'Not implemented' }),
  getCapsule: async () => ({ success: false, error: 'Not implemented' }),
  createCapsule: async () => ({ success: false, error: 'Not implemented' }),
  updateCapsule: async () => ({ success: false, error: 'Not implemented' }),
  deleteCapsule: async () => ({ success: false, error: 'Not implemented' }),
  // Add methods expected by hooks
  getCapsules: async () => ({ success: false, error: 'Not implemented' }),
  setCapsulesState: async () => {},
  getCapsulesState: async () => null,
};

export const categoriesService = {
  getAllCategories: async () => ({ success: false, error: 'Not implemented' }),
  getCategory: async () => ({ success: false, error: 'Not implemented' }),
  createCategory: async () => ({ success: false, error: 'Not implemented' }),
  updateCategory: async () => ({ success: false, error: 'Not implemented' }),
  deleteCategory: async () => ({ success: false, error: 'Not implemented' }),
  // Add methods expected by hooks
  getCategories: async () => ({ success: false, error: 'Not implemented' }),
  setCategoriesState: async () => {},
  getCategoriesState: async () => null,
};

export const tagsService = {
  getAllTags: async () => ({ success: false, error: 'Not implemented' }),
  getTag: async () => ({ success: false, error: 'Not implemented' }),
  createTag: async () => ({ success: false, error: 'Not implemented' }),
  updateTag: async () => ({ success: false, error: 'Not implemented' }),
  deleteTag: async () => ({ success: false, error: 'Not implemented' }),
  // Add methods expected by hooks
  getTags: async () => ({ success: false, error: 'Not implemented' }),
  setTagsState: async () => {},
  getTagsState: async () => null,
};
