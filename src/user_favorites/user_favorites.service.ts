import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserFavoriteDto } from './dto/create-user-fav.dto';

@Injectable()
export class UserFavoritesService {
  private firestore = admin.firestore();

  // Crear un favorito
  async createUserFavorite(createUserFavoriteDto: CreateUserFavoriteDto) {
    const { userId, productId } = createUserFavoriteDto;

    const productDoc = await this.firestore.collection('products').doc(productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    const userDoc = await this.firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new Error('User not found');

    const userFavRef = this.firestore.collection('user-favorites').doc();
    const userFavoriteData = { id: userFavRef.id, userId, productId };
    await userFavRef.set(userFavoriteData);

    return {
      ...userFavoriteData,
      product: productDoc.data(),
      user: userDoc.data(),
      productId: undefined, 
      userId: undefined
    };
  }

  // Obtener todos los favoritos
  async getAllUserFavorites() {
    const userFavRef = await this.firestore.collection('user-favorites').get();
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
        };
      })
    );
  }

  // Verificar si un producto es favorito de un usuario
  async isFavorite(userId: string, productId: string) {
    const userFavRef = this.firestore.collection('user-favorites');
    const query = await userFavRef
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    return !query.empty;
  }

  // Obtener todos los favoritos de un usuario
  async getUserFavoritesByUserId(userId: string) {
    const userFavRef = await this.firestore.collection('user-favorites').where('userId', '==', userId).get();
    return Promise.all(
      userFavRef.docs.map(async (doc) => {
        const userFavData = doc.data();

        const productDoc = await this.firestore.collection('products').doc(userFavData.productId).get();
        const productData = productDoc.data();

        const multimediaDoc = await this.firestore.collection('multimedia').doc(productData.multimediaId).get();
        const multimediaData = multimediaDoc.data();

        const userDoc = await this.firestore.collection('users').doc(userFavData.userId).get();
        return {
          ...userFavData,
          product: {
            ...productData,
            multimedia: multimediaData,
            multimediaId: undefined
          },
          user: userDoc.data(),
          productId: undefined, 
          userId: undefined
        };
      })
    );
  }

  // Obtener todos los productos favoritos según userId
  async getFavoriteProductsByUserId(userId: string) {
    const userFavRef = await this.firestore.collection('user-favorites').where('userId', '==', userId).get();
    return Promise.all(
      userFavRef.docs.map(async (doc) => {
        const userFavData = doc.data();
        const productDoc = await this.firestore.collection('products').doc(userFavData.productId).get();
        return {
          product: productDoc.data(),
          productId: undefined
        };
      })
    );
  }

  // Eliminar un favorito por userId y productId
  async deleteUserFavoriteByUserAndProductId(userId: string, productId: string) {
    const userFavRef = await this.firestore.collection('user-favorites')
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    if (userFavRef.empty) {
      throw new Error('Favorite not found for the given user and product');
    }

    const favoriteId = userFavRef.docs[0].id;
    await this.firestore.collection('user-favorites').doc(favoriteId).delete();

    return { message: `Favorite deleted successfully` };
  }
}
