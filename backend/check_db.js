import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: 'backend/.env' });

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/storm-rescue';

async function check() {
  try {
    console.log(`Connecting to: ${mongodbUri}`);
    await mongoose.connect(mongodbUri);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
