// ============================================
// CLASSICAL ENCRYPTION ALGORITHMS - MANUAL IMPLEMENTATION
// ============================================

// DISCLAIMER: These algorithms are for academic demonstration only
// and are NOT secure for real-world applications.

// ========== 1. CAESAR CIPHER (shift = 3) ==========
function caesarEncrypt(text) {
    let result = '';
    const shift = 3;
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        // Handle uppercase letters
        if (char >= 'A' && char <= 'Z') {
            result += String.fromCharCode(
                ((char.charCodeAt(0) - 65 + shift) % 26) + 65
            );
        }
        // Handle lowercase letters
        else if (char >= 'a' && char <= 'z') {
            result += String.fromCharCode(
                ((char.charCodeAt(0) - 97 + shift) % 26) + 97
            );
        }
        // Non-alphabet characters remain unchanged
        else {
            result += char;
        }
    }
    
    return result;
}

function caesarDecrypt(text) {
    let result = '';
    const shift = 3;
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        if (char >= 'A' && char <= 'Z') {
            result += String.fromCharCode(
                ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65
            );
        }
        else if (char >= 'a' && char <= 'z') {
            result += String.fromCharCode(
                ((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97
            );
        }
        else {
            result += char;
        }
    }
    
    return result;
}

// ========== 2. COLUMNAR TRANSPOSITION CIPHER ==========
function columnarEncrypt(text) {
    const key = "SECURITY";
    const keyLength = key.length;
    
    // Create array of indices sorted by key characters
    const keyIndices = key.split('')
        .map((char, index) => ({char, index}))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({originalIndex: item.index, newIndex}));
    
    // Create matrix
    const rows = Math.ceil(text.length / keyLength);
    const matrix = new Array(rows);
    
    // Fill matrix row by row
    for (let i = 0; i < rows; i++) {
        matrix[i] = text.slice(i * keyLength, (i + 1) * keyLength).split('');
        // Pad if necessary
        while (matrix[i].length < keyLength) {
            matrix[i].push('X');
        }
    }
    
    // Read columns according to key order
    let result = '';
    for (let col = 0; col < keyLength; col++) {
        // Find which column to read
        const colToRead = keyIndices.find(item => item.newIndex === col).originalIndex;
        
        for (let row = 0; row < rows; row++) {
            result += matrix[row][colToRead];
        }
    }
    
    return result;
}

function columnarDecrypt(text) {
    const key = "SECURITY";
    const keyLength = key.length;
    const rows = Math.ceil(text.length / keyLength);
    
    // Create array of indices sorted by key characters
    const keyIndices = key.split('')
        .map((char, index) => ({char, index}))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({originalIndex: item.index, newIndex}));
    
    // Reconstruct matrix
    const matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(keyLength);
    }
    
    // Fill matrix column by column in key order
    let textIndex = 0;
    for (let col = 0; col < keyLength; col++) {
        const colToWrite = keyIndices.find(item => item.newIndex === col).originalIndex;
        
        for (let row = 0; row < rows; row++) {
            matrix[row][colToWrite] = text[textIndex];
            textIndex++;
        }
    }
    
    // Read matrix row by row
    let result = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < keyLength; col++) {
            if (matrix[row][col] !== 'X') {
                result += matrix[row][col];
            }
        }
    }
    
    return result.replace(/X+$/g, '');
}

// ========== 3. HILL CIPHER (2×2 matrix) ==========
function hillEncrypt(text) {
    // Simple 2x2 matrix: [[a, b], [c, d]]
    const matrix = [
        [5, 8],
        [17, 3]
    ];
    
    // Convert text to uppercase and remove non-letters
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Pad with 'X' if length is odd
    if (text.length % 2 !== 0) {
        text += 'X';
    }
    
    let result = '';
    
    // Process text in pairs of 2 letters
    for (let i = 0; i < text.length; i += 2) {
        // Convert letters to numbers (A=0, B=1, ..., Z=25)
        const p1 = text.charCodeAt(i) - 65;
        const p2 = text.charCodeAt(i + 1) - 65;
        
        // Matrix multiplication mod 26
        const c1 = (matrix[0][0] * p1 + matrix[0][1] * p2) % 26;
        const c2 = (matrix[1][0] * p1 + matrix[1][1] * p2) % 26;
        
        // Convert back to letters
        result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
    }
    
    return result;
}

function hillDecrypt(text) {
    // Correct inverse matrix for [[5,8],[17,3]] modulo 26
    const inverseMatrix = [
        [9, 2],
        [1, 15]
    ];
    
    let result = '';
    
    for (let i = 0; i < text.length; i += 2) {
        const c1 = text.charCodeAt(i) - 65;
        const c2 = text.charCodeAt(i + 1) - 65;
        
        let p1 = (inverseMatrix[0][0] * c1 + inverseMatrix[0][1] * c2) % 26;
        let p2 = (inverseMatrix[1][0] * c1 + inverseMatrix[1][1] * c2) % 26;
        
        // Ensure positive modulo
        if (p1 < 0) p1 += 26;
        if (p2 < 0) p2 += 26;
        
        result += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
    }
    
    // Remove padding X if it exists
    if (result.endsWith('X')) result = result.slice(0, -1);
    
    return result;
}


// ========== 4. RAIL FENCE CIPHER (3 rails) ==========
function railFenceEncrypt(text) {
    const rails = 3;
    const fence = new Array(rails);
    for (let i = 0; i < rails; i++) fence[i] = [];
    
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < text.length; i++) {
        fence[rail].push(text[i]);
        
        // Change direction at edges
        if (rail === 0 && direction === -1) {
            direction = 1;
        } else if (rail === rails - 1 && direction === 1) {
            direction = -1;
        }
        
        rail += direction;
    }
    
    // Combine all rails
    return fence.flat().join('');
}

function railFenceDecrypt(text) {
    const rails = 3;
    const fencePattern = new Array(rails);
    for (let i = 0; i < rails; i++) fencePattern[i] = [];
    
    // Reconstruct the pattern
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < text.length; i++) {
        fencePattern[rail].push('*');
        
        if (rail === 0 && direction === -1) {
            direction = 1;
        } else if (rail === rails - 1 && direction === 1) {
            direction = -1;
        }
        
        rail += direction;
    }
    
    // Fill the pattern with ciphertext
    let index = 0;
    for (let r = 0; r < rails; r++) {
        for (let c = 0; c < fencePattern[r].length; c++) {
            fencePattern[r][c] = text[index];
            index++;
        }
    }
    
    // Read according to pattern
    let result = '';
    rail = 0;
    direction = 1;
    const positions = new Array(rails).fill(0);
    
    for (let i = 0; i < text.length; i++) {
        result += fencePattern[rail][positions[rail]];
        positions[rail]++;
        
        if (rail === 0 && direction === -1) {
            direction = 1;
        } else if (rail === rails - 1 && direction === 1) {
            direction = -1;
        }
        
        rail += direction;
    }
    
    return result;
}

// ========== 5. VIGENÈRE CIPHER (numeric version) ==========
function vigenereEncryptNumeric(text) {
    const key = "KEY";
    let result = '';
    
    // Remove non-numeric characters
    text = text.replace(/\D/g, '');
    
    for (let i = 0; i < text.length; i++) {
        const textChar = parseInt(text[i]);
        const keyChar = key.charCodeAt(i % key.length) - 65; // A=0, B=1, etc.
        
        // For numeric version, add key value (mod 10)
        const encrypted = (textChar + (keyChar % 10)) % 10;
        result += encrypted.toString();
    }
    
    return result;
}

function vigenereDecryptNumeric(text) {
    const key = "KEY";
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const textChar = parseInt(text[i]);
        const keyChar = key.charCodeAt(i % key.length) - 65;
        
        // For numeric version, subtract key value (mod 10)
        const decrypted = (textChar - (keyChar % 10) + 10) % 10;
        result += decrypted.toString();
    }
    
    return result;
}

// Export all functions
module.exports = {
    caesarEncrypt,
    caesarDecrypt,
    columnarEncrypt,
    columnarDecrypt,
    hillEncrypt,
    hillDecrypt,
    railFenceEncrypt,
    railFenceDecrypt,
    vigenereEncryptNumeric,
    vigenereDecryptNumeric
};