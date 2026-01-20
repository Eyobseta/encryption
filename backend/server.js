const express = require('express');
const cors = require('cors');
const encryption = require('./encryption');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for demonstration)
let usersDatabase = [];

// Root endpoint
app.get('/', (req, res) => {
    res.send('Classical Encryption Web Application - Backend Running');
});

// Register new user
app.post('/register', (req, res) => {
    try {
        const { fullName, email, password, nationalId, phoneNumber } = req.body;
        
        // Encrypt each field using the specified algorithms
        const encryptedUser = {
            id: Date.now(),
            fullName: encryption.caesarEncrypt(fullName),
            email: encryption.columnarEncrypt(email),
            password: encryption.hillEncrypt(password),
            nationalId: encryption.railFenceEncrypt(nationalId),
            phoneNumber: encryption.vigenereEncryptNumeric(phoneNumber),
            timestamp: new Date().toISOString()
        };
        
        // Store in "database"
        usersDatabase.push(encryptedUser);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            encryptedUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Encryption failed' });
    }
});

// Get encrypted users
app.get('/users/encrypted', (req, res) => {
    res.json(usersDatabase);
});

// Get decrypted users
app.get('/users/decrypted', (req, res) => {
    try {
        const decryptedUsers = usersDatabase.map(user => ({
            id: user.id,
            fullName: encryption.caesarDecrypt(user.fullName),
            email: encryption.columnarDecrypt(user.email),
            password: encryption.hillDecrypt(user.password),
            nationalId: encryption.railFenceDecrypt(user.nationalId),
            phoneNumber: encryption.vigenereDecryptNumeric(user.phoneNumber),
            timestamp: user.timestamp
        }));
        
        res.json(decryptedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed' });
    }
});

// Get both encrypted and decrypted
app.get('/users/both', (req, res) => {
    const result = usersDatabase.map(user => ({
        encrypted: user,
        decrypted: {
            fullName: encryption.caesarDecrypt(user.fullName),
            email: encryption.columnarDecrypt(user.email),
            password: encryption.hillDecrypt(user.password),
            nationalId: encryption.railFenceDecrypt(user.nationalId),
            phoneNumber: encryption.vigenereDecryptNumeric(user.phoneNumber)
        }
    }));
    
    res.json(result);
});

// Clear database (for testing)
app.delete('/clear', (req, res) => {
    usersDatabase = [];
    res.json({ message: 'Database cleared' });
});



// ========== INDIVIDUAL ENCRYPTION/DECRYPTION API ENDPOINTS ==========

// Caesar Cipher
app.post('/api/caesar/encrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const encrypted = encryption.caesarEncrypt(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Caesar encryption failed' });
    }
});

app.post('/api/caesar/decrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const decrypted = encryption.caesarDecrypt(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Caesar decryption failed' });
    }
});

// Columnar Transposition
app.post('/api/columnar/encrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const encrypted = encryption.columnarEncrypt(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Columnar encryption failed' });
    }
});

app.post('/api/columnar/decrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const decrypted = encryption.columnarDecrypt(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Columnar decryption failed' });
    }
});

// Hill Cipher
app.post('/api/hill/encrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const encrypted = encryption.hillEncrypt(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Hill encryption failed' });
    }
});

app.post('/api/hill/decrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const decrypted = encryption.hillDecrypt(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Hill decryption failed' });
    }
});

// Rail Fence Cipher
app.post('/api/railfence/encrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const encrypted = encryption.railFenceEncrypt(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Rail Fence encryption failed' });
    }
});

app.post('/api/railfence/decrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const decrypted = encryption.railFenceDecrypt(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Rail Fence decryption failed' });
    }
});

// Vigenère Cipher (numeric)
app.post('/api/vigenere/encrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const encrypted = encryption.vigenereEncryptNumeric(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Vigenère encryption failed' });
    }
});

app.post('/api/vigenere/decrypt', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const decrypted = encryption.vigenereDecryptNumeric(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Vigenère decryption failed' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Encryption methods available:');
    console.log('1. Caesar Cipher (shift=3)');
    console.log('2. Columnar Transposition (key=SECURITY)');
    console.log('3. Hill Cipher (2x2 matrix)');
    console.log('4. Rail Fence (3 rails)');
    console.log('5. Vigenère Cipher (key=KEY, numeric)');
});