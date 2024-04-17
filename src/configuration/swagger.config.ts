import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('KupiPodariDay API')
  .setDescription('The KupiPodariDay API description')
  .setVersion('1.0')
  .addTag('Wishlists', 'API endpoints related to wishlists')
  .addTag('Wishes', 'API endpoints related to wishes')
  .addTag('Users', 'API endpoints related to users')
  .addTag('Offers', 'API endpoints related to offers')
  .build();
