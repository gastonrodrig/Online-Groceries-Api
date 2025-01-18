import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { convertFirestoreTimestampToISO } from 'src/utils/firestoreTimestapToISO';

@Injectable()
export class ProductReviewsService {
  private firestore = admin.firestore();

  async createProductReview(productReviewData: CreateProductReviewDto) {
    // Verificar si el producto existe
    const productDoc = await this.firestore.collection('products').doc(productReviewData.productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    // Verificar si el usuario existe
    const userDoc = await this.firestore.collection('users').doc(productReviewData.userId).get();
    if (!userDoc.exists) throw new Error('User not found');

    // Crear un documento en la colección products
    const prodReviewRef = this.firestore.collection('product-review').doc();
    const plainData = { ...productReviewData, id: prodReviewRef.id, createdAt: new Date() };
    await prodReviewRef.set(plainData);

    // Obtener los datos del registro de producto
    return {
      ...plainData,
      product: productDoc.data(),
      user: userDoc.data(),
      productId: undefined,
      userId: undefined
    }
  }

  async getAllUserFavorite() {
    const prodReviewRef = await this.firestore.collection('product-review').get();
    return Promise.all(
      prodReviewRef.docs.map(async (doc) => {
        const prodReviewData = doc.data();
        const productDoc = await this.firestore.collection('products').doc(prodReviewData.productId).get();
        const userDoc = await this.firestore.collection('users').doc(prodReviewData.userId).get();
        return {
          ...prodReviewData,
          createdAt: convertFirestoreTimestampToISO(prodReviewData.createdAt),
          product: productDoc.data(),
          user: userDoc.data(),
          productId: undefined,
          userId: undefined
        }
      })
    )
  }

  async updateProductReview(prodReviewId: string, dto: UpdateProductReviewDto) {
    const docRef = this.firestore.collection('product-review').doc(prodReviewId)
    const snapshot = await docRef.get();
    if (!snapshot.exists) throw new Error(`Product review not found`);
  
    // Actualiza el documento
    await docRef.update({
      rating: dto.rating,
      comment: dto.comment,
      createdAt: admin.firestore.FieldValue.delete(),
      updatedAt: new Date(),
    });
  
    // Recuperamos nuevamente el documento actualizado
    const updatedSnapshot = await docRef.get();
    const prodReviewData = updatedSnapshot.data();
  
    // Cargamos la info del producto y del usuario
    const productDoc = await this.firestore.collection('products').doc(prodReviewData.productId).get();
    const userDoc = await this.firestore.collection('users').doc(prodReviewData.userId).get();
  
    // Retornamos todo en un solo objeto
    return {
      ...prodReviewData,
      updatedAt: convertFirestoreTimestampToISO(prodReviewData.updatedAt),
      product: productDoc.data(),
      user: userDoc.data(),
      productId: undefined,
      userId: undefined,
    };
  }

  async deleteProductReview(prodReviewId: string) {
    await this.firestore.collection('product-review').doc(prodReviewId).delete();
    return { message: `Product review ${prodReviewId} deleted successfully` };
  }
}
