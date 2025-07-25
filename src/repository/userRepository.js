// src/repository/userRepository.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};
