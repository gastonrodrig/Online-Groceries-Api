import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  private firestore = admin.firestore();

  async createUser(userData: CreateUserDto) {
    const generatedId = this.firestore.collection('users').doc().id;
    const userRef = this.firestore.collection('users').doc(generatedId);

    const plainData = { id: generatedId, ...userData };

    await userRef.set(plainData);

    return plainData;
  }

  async getAllUsers() {
    const usersRef = await this.firestore.collection('users').get();
    return usersRef.docs.map((doc) => doc.data());
  }

  async getUserById(userId: string) {
    const userRef = this.firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    return userDoc.data();
  }

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

  async deleteUser(userId: string) {
    await this.firestore.collection('users').doc(userId).delete();
    return { message: `User ${userId} deleted successfully` };
  }
}
