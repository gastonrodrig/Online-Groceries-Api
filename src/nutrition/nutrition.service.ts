import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NutritionService {
  private firestore = admin.firestore();

  async createNutritionForProduct(productId: string, nutritionData: any) {
    const nutritionCollectionRef = this.firestore
      .collection('products')
      .doc(productId)
      .collection('nutrition');
    const docRef = nutritionCollectionRef.doc();
    const newData = { id: docRef.id, ...nutritionData };
    await docRef.set(newData);
    return newData;
  }

  async getAllNutritionOfProduct(productId: string) {
    const nutritionCollectionRef = this.firestore
      .collection('products')
      .doc(productId)
      .collection('nutrition');

    const snapshot = await nutritionCollectionRef.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async updateNutritionOfProduct(productId: string, nutritionId: string, updateData: any) {
    const docRef = this.firestore
      .collection('products')
      .doc(productId)
      .collection('nutrition')
      .doc(nutritionId);

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new Error(`Nutrition record ${nutritionId} not found for product ${productId}`);
    }

    // Actualiza sólo los campos que envíes en `updateData`
    await docRef.update(updateData);

    // Lee el documento actualizado
    const updatedSnapshot = await docRef.get();
    return updatedSnapshot.data();
  }

  async deleteNutritionOfProduct(productId: string, nutritionId: string) {
    const docRef = this.firestore
      .collection('products')
      .doc(productId)
      .collection('nutrition')
      .doc(nutritionId);

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new Error(`Nutrition record ${nutritionId} not found for product ${productId}`);
    }

    await docRef.delete();
    return { message: `Nutrition record ${nutritionId} deleted successfully` };
  }
}
