import https from 'https';

const queries = [
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1080&q=80'
];

queries.forEach(url => {
  https.get(url, (res) => {
    console.log(`Status for ${url}:`, res.statusCode);
  });
});
