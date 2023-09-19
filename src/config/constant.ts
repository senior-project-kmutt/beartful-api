export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3006,
    hostname: process.env.HOSTNAME || 'localhost',
    mongodb: {
        uri: 'mongodb+srv://beartful:5P6Jgx5UfSt6zkmm@beartful-db.xo9cguc.mongodb.net/beartful'
    }
}
