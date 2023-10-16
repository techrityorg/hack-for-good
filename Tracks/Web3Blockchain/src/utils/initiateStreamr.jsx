// streamrFunctions.js
import { StreamrClient } from 'streamr-client'

const initializeStreamr = async () => {
  try {
    const streamr = new StreamrClient({
      auth: {
        privateKey: import.meta.env.VITE_PRIVATE_KEY,
      },
    });

    const stream = await streamr.getOrCreateStream({
      id: '/VerxioPool',
    });
    
    return stream;
  } catch (error) {
    console.error('Error initializing Streamr:', error);
    throw error; 
  }
};

export default initializeStreamr;
