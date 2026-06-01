import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// User Model requires establishing connection first, so we'll define a minimal schema here 
// or import the existing one. For safety and simplicity, a minimal schema is fine.
const userSchema = new mongoose.Schema({
  email: String,
  role: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

const makeAdmin = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: npx tsx scripts/makeAdmin.ts <user-email>');
    process.exit(1);
  }

  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('Error: MONGODB_URI is not defined in the .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB database.');

    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.error(`Error: User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`Success! ${email} has been granted the "admin" role.`);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

makeAdmin();
