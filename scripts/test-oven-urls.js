import https from 'https';

const testUrls = [
  'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1080&q=80'
];

testUrls.forEach(url => {
  https.get(url, res => {
    console.log(`${res.statusCode} -> ${url}`);
  });
});
