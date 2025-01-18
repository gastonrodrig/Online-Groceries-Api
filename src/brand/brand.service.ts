import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  private firestore = admin.firestore();

  async createBrand(brandData: CreateBrandDto) {
    const generatedId = this.firestore.collection('brand').doc().id;

    const brandRef = this.firestore.collection('brand').doc(generatedId);

    const plainData = { id: generatedId, ...brandData };

    await brandRef.set(plainData);

    return plainData;
  }

  async getAllBrands() {
    const brandsRef = await this.firestore.collection('brand').get();
    return brandsRef.docs.map(doc => doc.data());
  }

  async getBrandById(brandId: string) {
    const brandRef = this.firestore.collection('brand').doc(brandId);
    const brandDoc = await brandRef.get();

    if (!brandDoc.exists) {
      throw new Error('brand not found');
    }
    return brandDoc.data();
  }

  async updateBrand(brandId: string, updateData: UpdateBrandDto) {
    const brandRef = this.firestore.collection('brand').doc(brandId);
    const brandDoc = await brandRef.get();

    if (!brandDoc.exists) {
      throw new Error('Brand not found');
    }

    const currentData = brandDoc.data();

    const updatedData = { ...currentData, ...updateData };

    await brandRef.update(updatedData);

    return updatedData;
  }

  async deleteBrand(brandId: string) {
    await this.firestore.collection('brand').doc(brandId).delete();
    return { message: `Brand ${brandId} deleted successfully` };
  }
}
