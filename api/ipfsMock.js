const path = require('path');
const fs = require('fs');

const mockClient = {
  add: async (data) => {
    const mockPath = path.join(__dirname, 'mock_ipfs_data', `${Date.now()}.json`);
    fs.writeFileSync(mockPath, JSON.stringify(data));
    return { path: `mock/${mockPath}` };
  },
};

module.exports = mockClient;
