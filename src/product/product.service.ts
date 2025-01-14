import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  private firestore = admin.firestore();

  async createProduct(productData: CreateProductDto) {
    const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
  
    if (!categoryDoc.exists) throw new Error('Category not found');
  
    const productRef = this.firestore.collection('products').doc();
    const plainData = { ...productData, id: productRef.id };
    await productRef.set(plainData);
  
    return {
      ...plainData,
      category: { id: categoryDoc.id, ...categoryDoc.data() },
      categoryId: undefined,
    };
  }

  async getAllProducts() {
    const productsRef = await this.firestore.collection('products').get();
    return Promise.all(
      productsRef.docs.map(async (doc) => {
        const productData = doc.data();
        const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
        return {
          ...productData,
          category: categoryDoc.data(),
          categoryId: undefined,
        };
      }),
    );
  }

  async getProductById(productId: string) {
    const productDoc = await this.firestore.collection('products').doc(productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    const productData = productDoc.data();
    const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();

    return {
      ...productData,
      category: categoryDoc.data(),
      categoryId: undefined,
    };
  }

  async updateProduct(productId: string, updateData: any) {
    const productRef = this.firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) throw new Error('Product not found');
  
    if (updateData.categoryId) {
      const categoryDoc = await this.firestore.collection('category').doc(updateData.categoryId).get();
      if (!categoryDoc.exists) throw new Error('Category not found');
    }
  
    await productRef.update({ ...updateData });
    const productData = (await productRef.get()).data();
    const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
  
    return {
      ...productData,
      category: categoryDoc.data(),
      categoryId: undefined,
    };
  }
  
  async deleteProduct(productId: string) {
    await this.firestore.collection('products').doc(productId).delete();
    return { message: `Product ${productId} deleted successfully` };
  }
}
