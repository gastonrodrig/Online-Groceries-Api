import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StorageService } from 'src/firebase/storage.service';

@Injectable()
export class CategoryService {
  constructor(private readonly storageService: StorageService) {}
  private firestore = admin.firestore();

  async createCategory(categoryData: CreateCategoryDto, file: Express.Multer.File) {
    // Subir la imagen a Firebase Storage
    const imageUrl = await this.storageService.uploadFile('categories', file, 'multimedia');

    // Crear un documento en la colección multimedia
    const multimediaRef = admin.firestore().collection('multimedia').doc();
    const multimediaData = {
      id: multimediaRef.id,
      nombre: file.originalname,
      url: imageUrl,
      tamanio: file.size,
    };
    await multimediaRef.set(multimediaData);

    // Crear un documento en la colección category
    const cateogryRef = this.firestore.collection('category').doc();
    const plainData = { id: cateogryRef.id, ...categoryData, multimediaId: multimediaRef.id };
    await cateogryRef.set(plainData);

    // Obtener los datos del registro de multimedia
    const multimediaDoc = await admin.firestore().collection('multimedia').doc(multimediaRef.id).get();

    return {
      ...plainData,
      multimedia: multimediaDoc.data(),
      multimediaId: undefined
    };
  }

  // Listar todas las categorías
  async getAllCategories() {
    const categoriesRef = await this.firestore.collection('category').get();
    return Promise.all(
      categoriesRef.docs.map(async (doc) => {
        const categoryData = doc.data();
        const multiDoc = await this.firestore.collection('multimedia').doc(categoryData.multimediaId).get();
        return {
          ...categoryData,
          multimedia: multiDoc.data(),
          multimediaId: undefined,
        };
      }),
    );
  }

  // Obtener una categoría por ID
  async getCategoryById(categoryId: string) {
    const categoryDoc = await this.firestore.collection('category').doc(categoryId).get();
    if (!categoryDoc.exists) throw new Error('Category not found');

    const categoryData = categoryDoc.data();
    const multimediaDoc = await this.firestore.collection('multimedia').doc(categoryData.multimediaId).get();
    return {
      ...categoryData,
      multimedia: multimediaDoc.data(),
      multimediaId: undefined,
    };
  }

  async updateCategory(categoryId: string, updateData: UpdateCategoryDto, file: Express.Multer.File) {
    const categoryRef = this.firestore.collection('category').doc(categoryId);
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) throw new Error('Category not found');
  
    const category = categoryDoc.data();
  
    // Eliminar la imagen anterior si existe
    if (category.multimediaId) {
      const multimediaRef = this.firestore.collection('multimedia').doc(category.multimediaId);
      const oldImageUrl = (await multimediaRef.get()).data().url;
      if (oldImageUrl) {
        // Eliminar la imagen del almacenamiento
        await this.storageService.deleteFile(oldImageUrl);
        // Eliminar el registro de multimedia en Firestore
        await multimediaRef.delete();
      }
    }
  
    // Subir la nueva imagen utilizando storageService
    const imageUrl = await this.storageService.uploadFile('categories', file, 'multimedia');
    
    // Crear multimedia
    const multimediaRef = this.firestore.collection('multimedia').doc();
    await multimediaRef.set({
      id: multimediaRef.id,
      url: imageUrl,
      nombre: file?.originalname,
      tamanio: file?.size,
    });
  
    // Actualizar la categoria
    await categoryRef.update({
      ...updateData,
      multimediaId: multimediaRef.id,
    });
  
    const updatedCategoryData = (await categoryRef.get()).data();
    const multimediaDoc = await this.firestore.collection('multimedia').doc(updatedCategoryData.multimediaId).get();
  
    return {
      ...updatedCategoryData,
      multimedia: multimediaDoc.data(),
      multimediaId: undefined
    };
  }

  // Borrar una categoria
  async deleteCategory(categoryId: string) {
    const categoryRef = this.firestore.collection('category').doc(categoryId);
    const category = (await categoryRef.get()).data();
    
    if (category.multimediaId) {
      const multimediaRef = this.firestore.collection('multimedia').doc(category.multimediaId);
      const imageUrl = (await multimediaRef.get()).data()?.url;
      if (imageUrl) {
        await this.storageService.deleteFile(imageUrl);
        await multimediaRef.delete();
      }
    }
  
    await categoryRef.delete();
    return { message: `Product ${categoryId} deleted successfully` };
  }
}