import type {
  AwsCommunityType,
  AwsDifficultyLevel,
  AwsServiceCardType,
  AwsServiceCategory,
} from "@prisma/client";

export const AWS_SERVICE_CATEGORY_LABELS: Record<AwsServiceCategory, string> = {
  COMPUTE: "Cómputo",
  STORAGE: "Almacenamiento",
  DATABASE: "Bases de datos",
  NETWORKING: "Redes",
  SECURITY: "Seguridad",
  ANALYTICS: "Analítica",
  MACHINE_LEARNING: "Machine Learning",
  INTEGRATION: "Integración",
  MANAGEMENT: "Gestión",
  OTHER: "Otros",
};

export const AWS_DIFFICULTY_LABELS: Record<AwsDifficultyLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export const AWS_COMMUNITY_TYPE_LABELS: Record<AwsCommunityType, string> = {
  STUDENT_BUILDER_GROUP: "Student Builder Group",
  USER_GROUP: "User Group",
  CLOUD_CLUB: "Cloud Club",
  COMMUNITY_DAY: "Community Day",
  OTHER: "Comunidad AWS",
};

export const AWS_SERVICE_CARD_TYPE_LABELS: Record<AwsServiceCardType, string> = {
  USE_CASE: "Caso de uso",
  TIP: "Tip",
  WARNING: "Advertencia",
  LAB: "Laboratorio",
  PRICING: "Precios",
  ARCHITECTURE: "Arquitectura",
  RELATED_LINK: "Enlace",
  CUSTOM: "Extra",
};
