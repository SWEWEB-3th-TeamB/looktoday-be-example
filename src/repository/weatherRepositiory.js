import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createWeather = async(data) => {
    return prisma.weather.create({ data });
};