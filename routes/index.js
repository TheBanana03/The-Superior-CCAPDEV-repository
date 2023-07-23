const express = require('express');
const app = express();
const port = 3000;

// Sample communities data
const sampleCommunities = [
  {
    name: 'Community 1',
    description: 'Description of Community 1',
    image: 'path_to_image_1.jpg',
  },
  {
    name: 'Community 2',
    description: 'Description of Community 2',
    image: 'path_to_image_2.jpg',
  },
];

// API endpoint to fetch communities data from MongoDB
app.get('/api/communities', (req, res) => {
  res.json(sampleCommunities);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
