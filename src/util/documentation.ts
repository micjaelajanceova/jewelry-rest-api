import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';


/**
 * 
 * @param app 
 */

export function setupSwagger(app: Application) {
    const swaggerDefinition = {
            openapi: '3.0.0',
            info: {
                title: 'My API',
                version: '1.0.0',
                description: 'API documentation for my Express app',
            },
            servers: [
                {
                    url: 'http://localhost:4000/api',
                    description: 'Development server',
                },
                 {
                    url: 'https://jewelry-rest-api.onrender.com/api',
                    description: 'Production server'
                }
            ],
            components: {
                securitySchemes: {
                    ApiKeyAuth: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'Authorization',
                    },
                },
            
            schemas: {

                Jewelry: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        material: { type: 'string', enum: ['gold', 'silver', 'steel', 'other'] },
                        description: { type: 'string' },
                        imageURL: { type: 'string' },
                        price: { type: 'number' },
                        stock: { type: 'integer' },
                        collection: { type: 'string' },
                        isOnDiscount: { type: 'boolean' },
                        discount: { type: 'number' },
                        isFeatured: { type: 'boolean' },
                        _createdBy: { type: 'string'}
                    },
                },


                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        registeredAt: { type: 'string', format: 'date-time'}
                    },
                },
            }
        },
}

    const options = {
        swaggerDefinition,
        apis: ['**/*.ts'], 
    }

    const swaggerSpec = swaggerJsdoc(options);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
