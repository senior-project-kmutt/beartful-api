export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3006,
    hostname: process.env.HOSTNAME || 'localhost',
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://localhost/beartful-db'
    }
}
