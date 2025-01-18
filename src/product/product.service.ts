import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from 'src/firebase/storage.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class ProductService {
  constructor(private readonly storageService: StorageService) {}
  private firestore = admin.firestore();

  async createProduct(productData: CreateProductDto, file: Express.Multer.File) {
    // Verificar si la categoría existe
    const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
    if (!categoryDoc.exists) throw new Error('Category not found');

    // Verificar si la marca existe
    const brandDoc = await this.firestore.collection('brand').doc(productData.brandId).get();
    if (!brandDoc.exists) throw new Error('Brand not found');

    // Subir la imagen a Firebase Storage
    const imageUrl = await this.storageService.uploadFile('products', file, 'multimedia');

    // Crear un documento en la colección multimedia
    const multimediaRef = admin.firestore().collection('multimedia').doc();
    const multimediaData = {
      id: multimediaRef.id,
      nombre: file.originalname,
      url: imageUrl,
      tamanio: file.size,
    };
    await multimediaRef.set(multimediaData);
  
    // Crear un documento en la colección products
    const productRef = this.firestore.collection('products').doc();
    const plainData = { ...productData, id: productRef.id, multimediaId: multimediaRef.id };
    await productRef.set(plainData);

    // Obtener los datos del registro de multimedia
    const multimediaDoc = await admin.firestore().collection('multimedia').doc(multimediaRef.id).get();
  
    return {
      ...plainData,
      category: categoryDoc.data(),
      brand: brandDoc.data(),
      multimedia: multimediaDoc.data(),
      categoryId: undefined,
      brandId: undefined,
      multimediaId: undefined
    };
  }

  async getAllProducts() {
    const productsRef = await this.firestore.collection('products').get();
    return Promise.all(
      productsRef.docs.map(async (doc) => {
        const productData = doc.data();
        const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
        const brandDoc = await this.firestore.collection('brand').doc(productData.brandId).get();
        const multimediaDoc = await this.firestore.collection('multimedia').doc(productData.multimediaId).get();
        return {
          ...productData,
          category: categoryDoc.data(),
          brand: brandDoc.data(),
          multimedia: multimediaDoc.data(),
          categoryId: undefined,
          brandId: undefined,
          multimediaId: undefined
        };
      }),
    );
  }

  async getProductById(productId: string) {
    const productDoc = await this.firestore.collection('products').doc(productId).get();
    if (!productDoc.exists) throw new Error('Product not found');

    const productData = productDoc.data();
    const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
    const brandDoc = await this.firestore.collection('brand').doc(productData.brandId).get();
    const multimediaDoc = await this.firestore.collection('multimedia').doc(productData.multimediaId).get();

    return {
      ...productData,
      category: categoryDoc.data(),
      brand: brandDoc.data(),
      multimedia: multimediaDoc.data(),
      categoryId: undefined,
      brandId: undefined,
      multimediaId: undefined
    };
  }

  async updateProduct(productId: string, updateData: UpdateProductDto, file: Express.Multer.File) {
    const productRef = this.firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) throw new Error('Product not found');
  
    const product = productDoc.data();
  
    // Verificar la existencia de la categoría y la marca si es necesario
    if (updateData.categoryId) {
      const categoryDoc = await this.firestore.collection('category').doc(updateData.categoryId).get();
      if (!categoryDoc.exists) throw new Error('Category not found');
    }
  
    if (updateData.brandId) {
      const brandDoc = await this.firestore.collection('brand').doc(updateData.brandId).get();
      if (!brandDoc.exists) throw new Error('Brand not found');
    }
  
    // Eliminar la imagen anterior si existe
    if (product.multimediaId) {
      const multimediaRef = this.firestore.collection('multimedia').doc(product.multimediaId);
      const oldImageUrl = (await multimediaRef.get()).data().url;
      if (oldImageUrl) {
        // Eliminar la imagen del almacenamiento
        await this.storageService.deleteFile(oldImageUrl);
        // Eliminar el registro de multimedia en Firestore
        await multimediaRef.delete();
      }
    }
  
    // Subir la nueva imagen utilizando storageService
    const imageUrl = await this.storageService.uploadFile('products', file, 'multimedia');
    
    // Crear multimedia
    const multimediaRef = this.firestore.collection('multimedia').doc();
    await multimediaRef.set({
      id: multimediaRef.id,
      url: imageUrl,
      nombre: file?.originalname,
      tamanio: file?.size,
    });
  
    // Actualizar el producto
    await productRef.update({
      ...updateData,
      multimediaId: multimediaRef.id,
    });
  
    const updatedProductData = (await productRef.get()).data();
    const categoryDoc = await this.firestore.collection('category').doc(updatedProductData.categoryId).get();
    const brandDoc = await this.firestore.collection('brand').doc(updatedProductData.brandId).get();
    const multimediaDoc = await this.firestore.collection('multimedia').doc(updatedProductData.multimediaId).get();
  
    return {
      ...updatedProductData,
      category: categoryDoc.data(),
      brand: brandDoc.data(),
      multimedia: multimediaDoc.data(),
      categoryId: undefined,
      brandId: undefined,
      multimediaId: undefined
    };
  }
  
  async deleteProduct(productId: string) {
    const productRef = this.firestore.collection('products').doc(productId);
    const product = (await productRef.get()).data();
    
    if (product.multimediaId) {
      const multimediaRef = this.firestore.collection('multimedia').doc(product.multimediaId);
      const imageUrl = (await multimediaRef.get()).data()?.url;
      if (imageUrl) {
        await this.storageService.deleteFile(imageUrl);
        await multimediaRef.delete();
      }
    }
  
    await productRef.delete();
    return { message: `Product ${productId} deleted successfully` };
  }

  async getAllProductsWithOffer() {
    const productsSnapshot = await this.firestore
      .collection('products')
      .where('offer', '!=', null)
      .get();
  
    return Promise.all(
      productsSnapshot.docs.map(async (doc) => {
        const productData = doc.data();
        const categoryDoc = await this.firestore.collection('category').doc(productData.categoryId).get();
        const brandDoc = await this.firestore.collection('brand').doc(productData.brandId).get();
        const multimediaDoc = await this.firestore.collection('multimedia').doc(productData.multimediaId).get();
  
        return {
          ...productData,
          category: categoryDoc.data(),
          brand: brandDoc.data(),
          multimedia: multimediaDoc.data(),
          categoryId: undefined,
          brandId: undefined,
          multimediaId: undefined
        };
      })
    );
  }

  async addOfferToProduct(productId: string, dto: CreateOfferDto) {
    const productRef = this.firestore.collection('products').doc(productId);
    const snapshot = await productRef.get();

    if (!snapshot.exists) {
      throw new Error(`Product not found`);
    }

    await productRef.update({
      offer: {
        price: dto.price,
        start_date: dto.start_date,
        end_date: dto.end_date
      }
    });

    const updatedSnapshot = await productRef.get();
    return updatedSnapshot.data();
  }

  async removeOfferFromProduct(productId: string) {
    const productRef = this.firestore.collection('products').doc(productId);
    const snapshot = await productRef.get();

    if (!snapshot.exists) {
      throw new Error(`Product not found`);
    }

    await productRef.update({
      offer: admin.firestore.FieldValue.delete()
    });

    const updatedSnapshot = await productRef.get();
    return updatedSnapshot.data();
  }
}
