import { Injectable } from '@nestjs/common';
import { CreateUserNoProviderDto } from './dto/create-user-no-provider.dto';
import { CreateUserWithProviderDto } from './dto/create-user-with-provider.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  private firestore = admin.firestore();

  // Crear usuario sin proveedor
  async createUserNoProvider(userData: CreateUserNoProviderDto) {
    const generatedId = this.firestore.collection('users').doc().id;
    const userRef = this.firestore.collection('users').doc(generatedId);

    const plainData = { uid: generatedId, ...userData };

    await userRef.set(plainData);

    return plainData;
  }

  // Crear usuario con proveedor
  async createUserWithProvider(userData: CreateUserWithProviderDto) {
    const generatedId = this.firestore.collection('users').doc().id;
    const userRef = this.firestore.collection('users').doc(generatedId);

    const plainData = { uid: generatedId, ...userData };

    await userRef.set(plainData);

    return plainData;
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    const usersRef = await this.firestore.collection('users').get();
    return usersRef.docs.map((doc) => doc.data());
  }

  // Obtener usuario por ID
  async getUserById(userId: string) {
    const userRef = this.firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    return userDoc.data();
  }

  async getUserByEmail(email: string) {
    const querySnapshot = await this.firestore.collection('users').where('email', '==', email).get();
    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    return querySnapshot.docs[0].data();
  }

  // Actualizar usuario
  async updateUser(userId: string, updateData: UpdateUserDto) {
    const userRef = this.firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const currentData = userDoc.data();
    const updatedData = { ...currentData, ...updateData };

    await userRef.update(updatedData);

    return updatedData;
  }

  // Eliminar usuario
  async deleteUser(userId: string) {
    await this.firestore.collection('users').doc(userId).delete();
    return { message: `User ${userId} deleted successfully` };
  }
}
