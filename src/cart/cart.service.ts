import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-quantity.dto';

@Injectable()
export class CartService {
  private firestore = admin.firestore();

  // Crear un nuevo item en el carrito
  async createCartItem(dto: CreateCartDto) {
    const { userId, productId, quantity } = dto;

    // Verificar que exista el producto
    const productDoc = await this.firestore.collection('products').doc(productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    // Verificar que exista el usuario
    const userDoc = await this.firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new Error('User not found');

    // Crear el documento en la colección "cart"
    const cartRef = this.firestore.collection('cart').doc();
    const cartData = { id: cartRef.id, userId, productId, quantity };

    await cartRef.set(cartData);

    return {
      ...cartData,
      product: productDoc.data(),
      user: userDoc.data(),
      productId: undefined,
      userId: undefined
    };
  }

  // Obtener todos los items del carrito
  async getAllCartItems() {
    const cartSnapshot = await this.firestore.collection('cart').get();
    return Promise.all(
      cartSnapshot.docs.map(async (doc) => {
        const cartItem = doc.data();
        const productDoc = await this.firestore.collection('products').doc(cartItem.productId).get();
        const userDoc = await this.firestore.collection('users').doc(cartItem.userId).get();
        return {
          ...cartItem,
          product: productDoc.data(),
          user: userDoc.data(),
          productId: undefined,
          userId: undefined
        };
      })
    );
  }

  // Verificar si un producto ya está en el carrito de un usuario
  async isInCart(userId: string, productId: string) {
    const query = await this.firestore.collection('cart')
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    return !query.empty;
  }

  // Obtener todos los items del carrito de un usuario
  async getCartItemsByUserId(userId: string) {
    const querySnapshot = await this.firestore
      .collection('cart')
      .where('userId', '==', userId)
      .get();

    return Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const cartItem = doc.data();

        // Obtener datos del producto
        const productDoc = await this.firestore.collection('products').doc(cartItem.productId).get();
        const productData = productDoc.data();

        // Obtener datos del usuario
        const userDoc = await this.firestore.collection('users').doc(cartItem.userId).get();

        return {
          ...cartItem,
          product: productData,
          user: userDoc.data(),
          productId: undefined,
          userId: undefined
        };
      })
    );
  }

  // Eliminar un item del carrito por userId y productId
  async deleteCartItemByUserAndProductId(userId: string, productId: string) {
    const querySnapshot = await this.firestore.collection('cart')
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    if (querySnapshot.empty) {
      throw new Error('Cart item not found for the given user and product');
    }

    const cartItemId = querySnapshot.docs[0].id;
    await this.firestore.collection('cart').doc(cartItemId).delete();

    return { message: 'Cart item deleted successfully' };
  }

  async increaseCartQuantity(userId: string, productId: string) {
    const snap = await this.firestore.collection('cart')
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    if (snap.empty) throw new Error('Cart item not found');

    const doc = snap.docs[0];
    const current = doc.data().quantity ?? 0;
    const newQuantity = Math.min(current + 1, 99); // Máximo de 99
    await doc.ref.update({ quantity: newQuantity });
    return { message: 'Quantity incremented', quantity: newQuantity };
  }

  async decreaseCartQuantity(userId: string, productId: string) {
    const snap = await this.firestore.collection('cart')
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    if (snap.empty) throw new Error('Cart item not found');

    const doc = snap.docs[0];
    const current = doc.data().quantity ?? 1;
    if (current <= 1) throw new Error('Cannot decrease below 1');
    const newQuantity = current - 1;
    await doc.ref.update({ quantity: newQuantity });
    return { message: 'Quantity decremented', quantity: newQuantity };
  }
}
