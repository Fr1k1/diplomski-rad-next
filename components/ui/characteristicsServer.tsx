import { prisma } from "@/lib/prisma";
import CharacteristicsClient from "./characteristicsClient";

async function getCharacteristics() {
  try {
    const characteristics = await prisma.characteristics.findMany();
    return characteristics;
  } catch (error) {
    console.error("Error fetching characteristics:", error);
    return [];
  }
}

export default async function CharacteristicsServer() {
  const characteristics = await getCharacteristics();

  return <CharacteristicsClient characteristics={characteristics} />;
}
