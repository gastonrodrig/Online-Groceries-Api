import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateBestProductDto } from './dto/create-best-product.dto';

@Injectable()
export class BestProductsService {
  private firestore = admin.firestore();

  async createBestProduct(bestProductData: CreateBestProductDto) {
    // Verificar si el producto existe
    const productDoc = await this.firestore.collection('products').doc(bestProductData.productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    // Crear un documento en la colección products
    const bestProdRef = this.firestore.collection('best-products').doc();
    const plainData = { ...bestProductData, id: bestProdRef.id };
    await bestProdRef.set(plainData);

    // Obtener los datos del registro de producto
    return {
      ...plainData,
      product: productDoc.data(),
      productId: undefined
    }
  }

  async getAllBestProducts() {
    const bestProdRef = await this.firestore.collection('best-products').get();
    return Promise.all(
      bestProdRef.docs.map(async (doc) => {
        const bestProdData = doc.data();
        const productDoc = await this.firestore.collection('products').doc(bestProdData.productId).get();
        return {
          ...bestProdData,
          product: productDoc.data(),
          productId: undefined
        };
      })
    )
  }

  async deleteBestProduct(bestProdId: string) {
    await this.firestore.collection('best-products').doc(bestProdId).delete();
    return { message: `Best product ${bestProdId} deleted successfully` };
  }
}
