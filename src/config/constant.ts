export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    hostname: process.env.HOSTNAME || '0.0.0.0',
    mongodb: {
        uri: 'mongodb+srv://beartful:5P6Jgx5UfSt6zkmm@beartful-db.xo9cguc.mongodb.net/beartful'
    }
}
