// presentation.js - Uses backend API for encryption/decryption

// API Base URL
const API_BASE_URL = 'http://localhost:3000';

// Tab management variables
let currentAlgorithm = 'caesar';
let currentFunction = 'encrypt';

// Algorithm configuration
const algorithmConfig = {
    caesar: {
        name: "Caesar Cipher",
        description: "Shift = 3",
        inputGuideline: "Enter text with letters (A-Z, a-z) and spaces. Other characters remain unchanged.",
        encryptEndpoint: '/api/caesar/encrypt',
        decryptEndpoint: '/api/caesar/decrypt'
    },
    columnar: {
        name: "Columnar Transposition",
        description: "Key = 'SECURITY'",
        inputGuideline: "Enter any text (letters, numbers, symbols). Email format recommended but not required.",
        encryptEndpoint: '/api/columnar/encrypt',
        decryptEndpoint: '/api/columnar/decrypt'
    },
    hill: {
        name: "Hill Cipher",
        description: "2×2 matrix",
        inputGuideline: "Enter letters only (A-Z, a-z). Non-letters will be removed automatically. 'X' will be added if odd length.",
        encryptEndpoint: '/api/hill/encrypt',
        decryptEndpoint: '/api/hill/decrypt'
    },
    railfence: {
        name: "Rail Fence Cipher",
        description: "3 rails",
        inputGuideline: "Enter any text (letters, numbers, symbols, spaces). All characters are encrypted.",
        encryptEndpoint: '/api/railfence/encrypt',
        decryptEndpoint: '/api/railfence/decrypt'
    },
    vigenere: {
        name: "Vigenère Cipher",
        description: "Key = 'KEY' (numeric)",
        inputGuideline: "Enter digits only (0-9). Non-digits will be removed automatically.",
        encryptEndpoint: '/api/vigenere/encrypt',
        decryptEndpoint: '/api/vigenere/decrypt'
    }
};

// API call function
async function callEncryptionAPI(endpoint, text) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Tab management functions
function showAlgorithm(algorithmId) {
    // Hide all algorithm contents
    document.querySelectorAll('.algorithm-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Remove active class from all algorithm tabs
    document.querySelectorAll('.algorithm-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected algorithm
    const selectedAlgorithm = document.getElementById(algorithmId);
    if (selectedAlgorithm) {
        selectedAlgorithm.classList.add('active');
        selectedAlgorithm.style.display = 'block';
    }
    
    // Activate corresponding tab
    const algorithmTab = document.querySelector(`.algorithm-tab[onclick="showAlgorithm('${algorithmId}')"]`);
    if (algorithmTab) {
        algorithmTab.classList.add('active');
    }
    
    // Reset to encryption view for new algorithm
    currentAlgorithm = algorithmId;
    showFunction(algorithmId, 'encrypt');
    
    // Update test section information
    updateAlgorithmInfo();
    
    // Clear previous test results
    document.getElementById('testResults').innerHTML = 
        '<p style="text-align: center; color: #7f8c8d;">Test results will appear here...</p>';
    
    // Clear input validation
    clearInputValidation();
    
    // Scroll to top of algorithm section
    if (selectedAlgorithm) {
        selectedAlgorithm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showFunction(algorithmId, funcType) {
    // Hide all function contents for this algorithm
    const algorithmContent = document.getElementById(algorithmId);
    if (!algorithmContent) return;
    
    algorithmContent.querySelectorAll('.function-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all function tabs for this algorithm
    algorithmContent.querySelectorAll('.function-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected function
    const selectedFunction = document.getElementById(`${algorithmId}-${funcType}`);
    if (selectedFunction) {
        selectedFunction.style.display = 'block';
    }
    
    // Activate corresponding tab
    const functionTab = algorithmContent.querySelector(`.function-tab[onclick="showFunction('${algorithmId}', '${funcType}')"]`);
    if (functionTab) {
        functionTab.classList.add('active');
    }
    
    // Update current state
    currentAlgorithm = algorithmId;
    currentFunction = funcType;
}

// Update algorithm information in test section
function updateAlgorithmInfo() {
    const algorithm = algorithmConfig[currentAlgorithm];
    
    // Update algorithm name and description
    const nameElement = document.getElementById('currentAlgorithmName');
    const descElement = document.getElementById('currentAlgorithmDesc');
    const guidelineElement = document.getElementById('inputGuidelines');
    
    if (nameElement) {
        nameElement.textContent = algorithm.name;
    }
    
    if (descElement) {
        descElement.textContent = algorithm.description;
    }
    
    if (guidelineElement) {
        guidelineElement.textContent = algorithm.inputGuideline;
    }
}

// Test functions using API calls
async function testEncryptionCurrent() {
    const input = document.getElementById('testInput').value.trim();
    const resultsDiv = document.getElementById('testResults');
    
    if (!input) {
        resultsDiv.innerHTML = '<div class="result-item"><p style="color: #e74c3c;">Please enter some text to test.</p></div>';
        return;
    }
    
    const algorithm = algorithmConfig[currentAlgorithm];
    resultsDiv.innerHTML = '<div class="result-item"><p style="text-align: center; color: #3498db;">Encrypting... Please wait.</p></div>';
    
    try {
        const result = await callEncryptionAPI(algorithm.encryptEndpoint, input);
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h5 class="result-title">${algorithm.name} Encryption Result:</h5>
                <div class="result-content">
                    <div><strong>Input:</strong> ${input}</div>
                    <div><strong>Encrypted:</strong> ${result.encrypted}</div>
                    <div><strong>Algorithm:</strong> ${currentAlgorithm}</div>
                    <div><strong>Description:</strong> ${algorithm.description}</div>
                    <div><strong>Input Guideline:</strong> ${algorithm.inputGuideline}</div>
                </div>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <p style="color: #e74c3c;">Error: ${error.message}</p>
                <p>Check if backend server is running on port 3000.</p>
                <p>Input Guideline: ${algorithm.inputGuideline}</p>
            </div>
        `;
    }
}

async function testDecryptionCurrent() {
    const input = document.getElementById('testInput').value.trim();
    const resultsDiv = document.getElementById('testResults');
    
    if (!input) {
        resultsDiv.innerHTML = '<div class="result-item"><p style="color: #e74c3c;">Please enter some text to test decryption.</p></div>';
        return;
    }
    
    const algorithm = algorithmConfig[currentAlgorithm];
    resultsDiv.innerHTML = '<div class="result-item"><p style="text-align: center; color: #3498db;">Decrypting... Please wait.</p></div>';
    
    try {
        const result = await callEncryptionAPI(algorithm.decryptEndpoint, input);
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h5 class="result-title">${algorithm.name} Decryption Result:</h5>
                <div class="result-content">
                    <div><strong>Input:</strong> ${input}</div>
                    <div><strong>Decrypted:</strong> ${result.decrypted}</div>
                    <div><strong>Algorithm:</strong> ${currentAlgorithm}</div>
                    <div><strong>Description:</strong> ${algorithm.description}</div>
                    <div><strong>Input Guideline:</strong> ${algorithm.inputGuideline}</div>
                </div>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <p style="color: #e74c3c;">Error: ${error.message}</p>
                <p>Check if backend server is running on port 3000.</p>
                <p>Input Guideline: ${algorithm.inputGuideline}</p>
            </div>
        `;
    }
}

async function testFullCycle() {
    const input = document.getElementById('testInput').value.trim();
    const resultsDiv = document.getElementById('testResults');
    
    if (!input) {
        resultsDiv.innerHTML = '<div class="result-item"><p style="color: #e74c3c;">Please enter text to test full cycle.</p></div>';
        return;
    }
    
    const algorithm = algorithmConfig[currentAlgorithm];
    resultsDiv.innerHTML = '<div class="result-item"><p style="text-align: center; color: #3498db;">Testing full cycle... Please wait.</p></div>';
    
    try {
        // Step 1: Encrypt
        const encryptResult = await callEncryptionAPI(algorithm.encryptEndpoint, input);
        const encrypted = encryptResult.encrypted;
        
        // Step 2: Decrypt the encrypted result
        const decryptResult = await callEncryptionAPI(algorithm.decryptEndpoint, encrypted);
        const decrypted = decryptResult.decrypted;
        
        // Determine if cycle was successful
        let cycleSuccess = false;
        if (currentAlgorithm === 'vigenere') {
            // For Vigenère, compare only digits
            const inputDigits = input.replace(/\D/g, '');
            cycleSuccess = inputDigits === decrypted;
        } else {
            cycleSuccess = input === decrypted;
        }
        
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h5 class="result-title">${algorithm.name} Full Cycle Test:</h5>
                <div class="result-content">
                    <div><strong>Original Input:</strong> ${input}</div>
                    <div><strong>Encrypted:</strong> ${encrypted}</div>
                    <div><strong>Decrypted:</strong> ${decrypted}</div>
                    <div style="grid-column: 1 / -1; padding: 10px; background: ${cycleSuccess ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
                        <strong>Cycle Result:</strong> ${cycleSuccess ? '✓ Perfect - Original restored!' : '✗ Cycle incomplete'}
                    </div>
                    <div><strong>Algorithm:</strong> ${currentAlgorithm}</div>
                    <div><strong>Input Guideline:</strong> ${algorithm.inputGuideline}</div>
                </div>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <p style="color: #e74c3c;">Error: ${error.message}</p>
                <p>Check if backend server is running on port 3000.</p>
            </div>
        `;
    }
}

function clearAllTests() {
    document.getElementById('testResults').innerHTML = 
        '<p style="text-align: center; color: #7f8c8d;">Test results will appear here...</p>';
    document.getElementById('testInput').value = '';
    clearInputValidation();
}

// Input validation and guidance
function validateInput() {
    const input = document.getElementById('testInput').value;
    const algorithm = algorithmConfig[currentAlgorithm];
    
    // Create or get validation message element
    let validationMsg = document.getElementById('inputValidationMsg');
    if (!validationMsg) {
        validationMsg = document.createElement('div');
        validationMsg.id = 'inputValidationMsg';
        validationMsg.style.fontSize = '12px';
        validationMsg.style.marginTop = '5px';
        validationMsg.style.padding = '5px';
        validationMsg.style.borderRadius = '3px';
        document.querySelector('#testInput').parentNode.appendChild(validationMsg);
    }
    
    if (!input) {
        validationMsg.innerHTML = '';
        validationMsg.style.display = 'none';
        return;
    }
    
    validationMsg.style.display = 'block';
    
    if (currentAlgorithm === 'vigenere') {
        const nonDigits = input.replace(/[0-9]/g, '').length;
        if (nonDigits > 0) {
            validationMsg.innerHTML = `<span style="color: #e74c3c;">
                ⚠ Warning: ${nonDigits} non-digit character(s) will be removed.<br>
                Only digits (0-9) are allowed for Vigenère Cipher.
            </span>`;
            validationMsg.style.backgroundColor = '#fff3cd';
        } else {
            validationMsg.innerHTML = '<span style="color: #2ecc71;">✓ Valid input (digits only)</span>';
            validationMsg.style.backgroundColor = '#d4edda';
        }
    } else if (currentAlgorithm === 'hill') {
        const nonLetters = input.replace(/[A-Za-z]/g, '').length;
        if (nonLetters > 0) {
            validationMsg.innerHTML = `<span style="color: #e74c3c;">
                ⚠ Warning: ${nonLetters} non-letter character(s) will be removed.<br>
                Only letters (A-Z, a-z) are allowed for Hill Cipher.
            </span>`;
            validationMsg.style.backgroundColor = '#fff3cd';
        } else {
            validationMsg.innerHTML = '<span style="color: #2ecc71;">✓ Valid input (letters only)</span>';
            validationMsg.style.backgroundColor = '#d4edda';
        }
    } else if (currentAlgorithm === 'caesar') {
        validationMsg.innerHTML = '<span style="color: #3498db;">ℹ Letters will be shifted, other characters remain unchanged.</span>';
        validationMsg.style.backgroundColor = '#e3f2fd';
    } else if (currentAlgorithm === 'railfence') {
        validationMsg.innerHTML = '<span style="color: #3498db;">ℹ All characters (letters, numbers, symbols) will be encrypted.</span>';
        validationMsg.style.backgroundColor = '#e3f2fd';
    } else if (currentAlgorithm === 'columnar') {
        validationMsg.innerHTML = '<span style="color: #3498db;">ℹ All characters will be rearranged in columns.</span>';
        validationMsg.style.backgroundColor = '#e3f2fd';
    }
}

function clearInputValidation() {
    const validationMsg = document.getElementById('inputValidationMsg');
    if (validationMsg) {
        validationMsg.innerHTML = '';
        validationMsg.style.display = 'none';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize first algorithm and function
    showAlgorithm('caesar');
    showFunction('caesar', 'encrypt');
    
    // Add click handlers to code explanations
    document.querySelectorAll('.code-explanation').forEach(explanation => {
        explanation.addEventListener('click', function() {
            this.classList.toggle('highlighted');
        });
    });
    
    // Add input validation on keyup
    document.getElementById('testInput').addEventListener('keyup', validateInput);
    
    // Add input validation on change
    document.getElementById('testInput').addEventListener('change', validateInput);
    
    // Update algorithm info on load
    updateAlgorithmInfo();
});

// Export functions for use in HTML onclick attributes
window.showAlgorithm = showAlgorithm;
window.showFunction = showFunction;
window.testEncryptionCurrent = testEncryptionCurrent;
window.testDecryptionCurrent = testDecryptionCurrent;
window.testFullCycle = testFullCycle;
window.clearAllTests = clearAllTests;