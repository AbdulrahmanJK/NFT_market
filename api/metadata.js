require('dotenv').config();
const sharp = require('sharp');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const attributes = {
  weapon: [
    'Stick',
    'Knife',
    'Blade',
    'Club',
    'Ax',
    'Sword',
    'Spear',
    'Halberd',
  ],
  environment: [
    'Space',
    'Sky',
    'Deserts',
    'Forests',
    'Grasslands',
    'Mountains',
    'Oceans',
    'Rainforests',
  ],
  rarity: Array.from(Array(6).keys()),
};

const toMetadata = ({ id, name, description, price, image }) => ({
  id,
  name,
  description,
  price,
  image,
  demand: faker.random.numeric({ min: 10, max: 100 }),
  attributes: [
    {
      trait_type: 'Environment',
      value: attributes.environment.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Weapon',
      value: attributes.weapon.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Rarity',
      value: attributes.rarity.sort(() => 0.5 - Math.random())[0],
    },
    {
      display_type: 'date',
      trait_type: 'Created',
      value: Date.now(),
    },
    {
      display_type: 'number',
      trait_type: 'generation',
      value: 1,
    },
  ],
});

const toWebp = async (image) => await sharp(image).resize(500).webp().toBuffer();

const uploadToIPFS = async (data) => {
  const formData = new FormData();
  formData.append('file', data, 'image.webp');

  const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    maxContentLength: 'Infinity',
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};

exports.toWebp = toWebp;
exports.toMetadata = toMetadata;
exports.uploadToIPFS = uploadToIPFS;
