import 'dotenv/config';

export default {
  expo: {
    name: 'myApp',
    slug: 'myApp',
    version: '1.0.0',
    scheme: 'myapp', // Add this line
    extra: {
      apiUrl: process.env.API_URL,
    },
    plugins: [
      "expo-router"
    ],
  },
};