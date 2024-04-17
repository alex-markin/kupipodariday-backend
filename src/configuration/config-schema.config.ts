import * as Joi from 'joi';

const schema = Joi.object({
  port: Joi.number().integer().default(3000),
  database: Joi.object({
    url: Joi.string()
      .pattern(/postgres:\/\/[a-zA-Z]/)
      .required(),
    port: Joi.number().integer().required(),
    host: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    synchronize: Joi.boolean().default(true),
    entities: Joi.array().items(Joi.string()).required(),
  }),
});

export default schema;
