import mongoose from 'mongoose';

const maskUri = (uri: string) => uri.replace(/:\/\/(.*):(.*)@/, '://$1:*****@');

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
    console.error('❌ MONGODB_URI is not set');
    process.exit(1);
}

const mongoUri = rawUri.replace(/:\/\/(.*):(.*)@/, (_, user, pass) => {
    const encodedPass = encodeURIComponent(pass);
    return `://${user}:${encodedPass}@`;
});

mongoose.set('debug', true);

(async () => {
    console.log('🔗 Attempting to connect to MongoDB at:', maskUri(mongoUri));

    try {
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });

        console.log('✅ Connected to MongoDB successfully');

        // Null check to satisfy TS
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('Collections in DB:', collections.map(c => c.name));
        } else {
            console.warn('⚠️ mongoose.connection.db is undefined');
        }

    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
})();
