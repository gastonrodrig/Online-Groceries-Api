import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserFavoriteDto } from './dto/create-user-fav.dto';

@Injectable()
export class UserFavoritesService {
  private firestore = admin.firestore();

  async createUserFavorite(userFavoriteData: CreateUserFavoriteDto) {
    // Verificar si el producto existe
    const productDoc = await this.firestore.collection('products').doc(userFavoriteData.productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    // Verificar si el usuario existe
    const userDoc = await this.firestore.collection('users').doc(userFavoriteData.userId).get();
    if (!userDoc.exists) throw new Error('User not found');

    // Crear un documento en la colección products
    const userFavRef = this.firestore.collection('user-favorite').doc();
    const plainData = { ...userFavoriteData, id: userFavRef.id };
    await userFavRef.set(plainData);

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
    const userFavRef = await this.firestore.collection('user-favorite').get();
    return Promise.all(
      userFavRef.docs.map(async (doc) => {
        const userFavData = doc.data();
        const productDoc = await this.firestore.collection('products').doc(userFavData.productId).get();
        const userDoc = await this.firestore.collection('users').doc(userFavData.userId).get();
        return {
          ...userFavData,
          product: productDoc.data(),
          user: userDoc.data(),
          productId: undefined,
          userId: undefined
        }
      })
    )
  }

  async deleteUserFavorite(userFavId: string) {
    await this.firestore.collection('user-favorite').doc(userFavId).delete();
    return { message: `User favorite ${userFavId} deleted successfully` };
  }
}
