import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  private firestore = admin.firestore();

  async createCategory(categoryData: CreateCategoryDto) {
    const generatedId = this.firestore.collection('category').doc().id;

    const categoryRef = this.firestore.collection('category').doc(generatedId);

    const plainData = { id: generatedId, ...categoryData };

    await categoryRef.set(plainData);

    return plainData;
  }

  async getAllCategories() {
    const categoriesRef = await this.firestore.collection('category').get();
    return categoriesRef.docs.map(doc => doc.data());
  }

  async getCategoryById(categoryId: string) {
    const categoryRef = this.firestore.collection('category').doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      throw new Error('Category not found');
    }
    return categoryDoc.data();
  }

  async updateCategory(categoryId: string, updateData: UpdateCategoryDto) {
    const categoryRef = this.firestore.collection('category').doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      throw new Error('Category not found');
    }

    const currentData = categoryDoc.data();

    const updatedData = { ...currentData, ...updateData };

    await categoryRef.update(updatedData);

    return updatedData;
  }

  async deleteCategory(categoryId: string) {
    await this.firestore.collection('category').doc(categoryId).delete();
    return { message: `Category ${categoryId} deleted successfully` };
  }
}