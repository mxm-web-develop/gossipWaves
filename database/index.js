const mongoose = require('mongoose');

// MongoDB connection URI with authentication
const MONGODB_URI = 'mongodb://admin:password@mxm-ai.com:27017/testmongo?authSource=admin';

// Define the Schema
const aiItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['model', 'service', 'application', 'essay']
  },
  is_open_source: Boolean,
  date: Date,
  post: {
    content: String,
    rawString: String
  },
  owner: String,
  network: {
    type: String,
    enum: ['non-cn', 'global', 'gientech-only']
  },
  isEvent: Boolean,
  img: String,
  sourceUrl: {
    url: String,
    iframeUrl: String,
    githubUrl: String,
    downloadUrl: String
  },
  tags: [String],
  model_score: {
    MMLU: Number,
    GPQA: Number,
    MMMU: Number,
    HellaSWAG: Number,
    HumanEval: Number,
    BBHard: Number,
    GSM8K: Number,
    MATH: Number
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
});

// Create the model
const AIItem = mongoose.model('AIItem', aiItemSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
})
.then(() => {
  console.log('Initial connection successful');
  // 只在连接完全建立后执行上传
  uploadDemoData()
    .then(() => {
      console.log('Upload completed successfully');
      // mongoose.connection.close(); // 如果需要在上传后关闭连接
    })
    .catch(error => {
      console.error('Upload failed:', error);
      mongoose.connection.close();
    });
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Function to upload demo data
async function uploadDemoData() {
  try {
    // 添加路径调试信息
    const path = require('path');
    const dataPath = path.join(__dirname, 'data.json');
    console.log('Attempting to read from:', dataPath);
    
    // Read demo data from json file
    const items = require('./data.json');  // 直接使用数组，不需要解构
    
    console.log('Data to be uploaded:', JSON.stringify(items, null, 2));
    
    // 如果 items 不是数组，提前返回
    if (!Array.isArray(items)) {
      throw new Error('Invalid or empty data structure in data.json');
    }
    
    // Clear existing data (optional)
    await AIItem.deleteMany({});
    
    // Insert new data
    const result = await AIItem.insertMany(items);
    
    console.log(`Successfully uploaded ${result.length} items to database`);
    return result;
  } catch (error) {
    console.error('Error uploading demo data:', error);
    
    // 添加更详细的错误信息
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`Field "${key}" error:`, error.errors[key].message);
      });
    }
    
    throw error;
  }
}

// Export the necessary items
// module.exports = {
//   connection: mongoose.connection,
//   AIItem,
//   uploadDemoData
// };
