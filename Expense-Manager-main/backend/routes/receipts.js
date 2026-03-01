const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `receipt-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: fileFilter
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to extract text from image using Gemini API
async function extractReceiptData(filePath, fileType) {
  try {
    // Read the file
    const fileData = fs.readFileSync(filePath);
    
    // Determine the appropriate model based on file type
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    // Prepare the prompt for receipt data extraction
    const prompt = `
      Extract the following information from this receipt image:
      1. Vendor/Store name
      2. Date of purchase (in YYYY-MM-DD format)
      3. Total amount
      4. List of items purchased
      5. Category (choose one: Food, Travel, Shopping, Healthcare, Education, Entertainment, Utilities, Housing, Transportation, Others)
      
      Format the response as a JSON object with these fields:
      {
        "vendor": "Store name",
        "date": "YYYY-MM-DD",
        "amount": number,
        "items": ["item1", "item2", ...],
        "category": "category name",
        "title": "Short descriptive title for this expense",
        "description": "Brief summary of the purchase"
      }
      
      If you cannot determine any field, use null for that field.
    `;

    // Generate content with the image and prompt
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: {
                mime_type: fileType,
                data: fileData.toString('base64')
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 4096,
      }
    });
    
    if (!result || !result.response) {
      throw new Error("No response received from Gemini API");
    }
    
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw API response:", text);
    
    // Extract JSON from the response - try multiple patterns
    let jsonData;
    
    // Try to find JSON in code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonData = JSON.parse(jsonMatch[1]);
        console.log("Extracted JSON from code block");
      } catch (error) {
        console.error("Failed to parse JSON from code block:", error);
      }
    }
    
    // If that fails, try to find JSON directly in the text
    if (!jsonData) {
      try {
        // Look for patterns that look like JSON objects
        const directJsonMatch = text.match(/{[\s\S]*?}/);
        if (directJsonMatch) {
          jsonData = JSON.parse(directJsonMatch[0]);
          console.log("Extracted JSON directly from text");
        }
      } catch (error) {
        console.error("Failed to parse JSON directly from text:", error);
      }
    }
    
    // If we still don't have valid JSON, try to extract key-value pairs manually
    if (!jsonData) {
      console.log("Attempting to extract data manually from text");
      jsonData = {
        vendor: extractField(text, "vendor", "store"),
        date: extractField(text, "date"),
        amount: parseFloat(extractField(text, "amount", "total")) || 0,
        category: extractField(text, "category"),
        title: extractField(text, "title"),
        description: extractField(text, "description", "summary"),
      };
    }
    
    if (!jsonData) {
      throw new Error("Could not extract structured data from the response");
    }
    
    return jsonData;
  } catch (error) {
    console.error("Error in extractReceiptData:", error);
    throw error;
  }
}

// Helper function to extract fields from text
function extractField(text, ...fieldNames) {
  for (const fieldName of fieldNames) {
    const regex = new RegExp(`${fieldName}[\\s:]*["']?([^"',\\n}]+)["']?`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

// POST /process - Process a receipt image and extract data
router.post('/process', passport.authenticate('jwt', { session: false }), upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    console.log(`Processing receipt: ${req.file.originalname} (${req.file.mimetype})`);
    
    // Extract data from the receipt
    const receiptData = await extractReceiptData(req.file.path, req.file.mimetype);
    
    // Delete the file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    console.log("Receipt data extracted successfully:", JSON.stringify(receiptData));

    // Return the extracted data
    return res.status(200).json({
      message: 'Receipt processed successfully',
      ...receiptData,
      // Ensure amount is a number
      amount: typeof receiptData.amount === 'number' ? receiptData.amount : parseFloat(receiptData.amount) || 0
    });
  } catch (error) {
    console.error("Error processing receipt:", error);
    console.error("Error details:", error.stack);
    
    // Get more details if it's a Gemini API error
    let errorMessage = 'Failed to process receipt';
    if (error.message) {
      errorMessage += ': ' + error.message;
    }
    
    // If there's a response object with more details
    if (error.response) {
      console.error("API response error:", error.response);
      if (error.response.data && error.response.data.error) {
        errorMessage += ` - ${error.response.data.error.message || 'Unknown API error'}`;
      }
    }
    
    // Delete the file if there was an error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    
    return res.status(500).json({ message: errorMessage });
  }
});

// POST /process-history - Process a transaction history PDF and extract transactions
router.post('/process-history', passport.authenticate('jwt', { session: false }), upload.single('history'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const fileData = fs.readFileSync(filePath);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `
      The uploaded PDF contains a table of financial transactions. Extract each row as a transaction object with the following fields:
      - title: string (short description or merchant name)
      - amount: number
      - type: "income" or "expense"
      - date: string (YYYY-MM-DD)
      - category: string (choose from Food, Travel, Shopping, Healthcare, Education, Entertainment, Utilities, Housing, Transportation, Others)
      - description: string (optional, details about the transaction)
      
      Return a JSON array of objects, one for each transaction. If a field is missing, use null. Example:
      [
        { "title": "Starbucks", "amount": 250, "type": "expense", "date": "2024-06-01", "category": "Food", "description": "Coffee" },
        ...
      ]
    `;
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: {
                mime_type: fileType,
                data: fileData.toString('base64')
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 4096,
      }
    });
    if (!result || !result.response) {
      throw new Error("No response received from Gemini API");
    }
    const response = await result.response;
    const text = response.text();
    console.log("Raw API response (history):", text);
    // Try to extract JSON array from code block or text
    let transactions = [];
    const arrayMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/\[([\s\S]*?)\]/);
    if (arrayMatch) {
      try {
        transactions = JSON.parse(arrayMatch[1] || arrayMatch[0]);
      } catch (e) {
        console.error('Failed to parse transactions array:', e);
      }
    }
    if (!Array.isArray(transactions)) {
      // Try to find the first array in the text
      const arrMatch = text.match(/\[([\s\S]*?)\]/);
      if (arrMatch) {
        try {
          transactions = JSON.parse('[' + arrMatch[1] + ']');
        } catch (e) {
          console.error('Failed to parse fallback array:', e);
        }
      }
    }
    // Clean up file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(500).json({ message: 'Failed to extract transactions from PDF.' });
    }
    // Ensure all fields are present and types are correct
    transactions = transactions.map(t => ({
      title: t.title || '',
      amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0,
      type: t.type === 'income' ? 'income' : 'expense',
      date: t.date || '',
      category: t.category || 'Others',
      description: t.description || ''
    }));
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error processing transaction history:", error);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return res.status(500).json({ message: 'Failed to process transaction history: ' + error.message });
  }
});

module.exports = router; 