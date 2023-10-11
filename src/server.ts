import fastify from 'fastify';
import router from './router';

const server = fastify();
server.register(router);

const start = async () => {
  try {
    await server.listen(3006, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
