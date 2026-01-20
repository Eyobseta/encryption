   // Tab management functions
        let currentAlgorithm = 'caesar';
        let currentFunction = 'encrypt';
        
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
            selectedAlgorithm.classList.add('active');
            selectedAlgorithm.style.display = 'block';
            
            // Activate corresponding tab
            document.querySelector(`.algorithm-tab[onclick="showAlgorithm('${algorithmId}')"]`).classList.add('active');
            
            // Reset to encryption view for new algorithm
            currentAlgorithm = algorithmId;
            showFunction(algorithmId, 'encrypt');
            
            // Scroll to top of algorithm section
            selectedAlgorithm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        function showFunction(algorithmId, funcType) {
            // Hide all function contents for this algorithm
            document.querySelectorAll(`#${algorithmId} .function-content`).forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all function tabs for this algorithm
            document.querySelectorAll(`#${algorithmId} .function-tab`).forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected function
            const selectedFunction = document.getElementById(`${algorithmId}-${funcType}`);
            if (selectedFunction) {
                selectedFunction.style.display = 'block';
            }
            
            // Activate corresponding tab
            const functionTab = document.querySelector(`#${algorithmId} .function-tab[onclick="showFunction('${algorithmId}', '${funcType}')"]`);
            if (functionTab) {
                functionTab.classList.add('active');
            }
            
            // Update current state
            currentAlgorithm = algorithmId;
            currentFunction = funcType;
        }
        
        // Test functions for all algorithms
        function caesarEncrypt(text) {
            let result = '';
            const shift = 3;
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (char >= 'A' && char <= 'Z') {
                    result += String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
                } else if (char >= 'a' && char <= 'z') {
                    result += String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
                } else {
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
                    result += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
                } else if (char >= 'a' && char <= 'z') {
                    result += String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
                } else {
                    result += char;
                }
            }
            return result;
        }
        
        function railFenceEncrypt(text) {
            const rails = 3;
            const fence = [[], [], []];
            let rail = 0;
            let direction = 1;
            
            for (let i = 0; i < text.length; i++) {
                fence[rail].push(text[i]);
                if (rail === 0 && direction === -1) direction = 1;
                else if (rail === rails - 1 && direction === 1) direction = -1;
                rail += direction;
            }
            
            return fence.flat().join('');
        }
        
        function columnarEncrypt(text) {
            // Simplified version for demonstration
            const key = "SECURITY";
            const keyLength = key.length;
            const rows = Math.ceil(text.length / keyLength);
            let result = '';
            
            for (let col = 0; col < keyLength; col++) {
                for (let row = 0; row < rows; row++) {
                    const index = row * keyLength + col;
                    if (index < text.length) {
                        result += text[index];
                    } else {
                        result += 'X';
                    }
                }
            }
            return result;
        }
        
        function hillEncrypt(text) {
            // Simplified version for demonstration
            const matrix = [[5, 8], [17, 3]];
            let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
            if (cleanText.length % 2 !== 0) cleanText += 'X';
            
            let result = '';
            for (let i = 0; i < cleanText.length; i += 2) {
                const p1 = cleanText.charCodeAt(i) - 65;
                const p2 = cleanText.charCodeAt(i + 1) - 65;
                const c1 = (matrix[0][0] * p1 + matrix[0][1] * p2) % 26;
                const c2 = (matrix[1][0] * p1 + matrix[1][1] * p2) % 26;
                result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
            }
            return result;
        }
        
        function vigenereEncryptNumeric(text) {
            const key = "KEY";
            let cleanText = text.replace(/\D/g, '');
            let result = '';
            
            for (let i = 0; i < cleanText.length; i++) {
                const textChar = parseInt(cleanText[i]);
                const keyChar = key.charCodeAt(i % key.length) - 65;
                const encrypted = (textChar + (keyChar % 10)) % 10;
                result += encrypted.toString();
            }
            return result;
        }
        
        // Test functions
        function testAllEncryption() {
            const input = document.getElementById('testInput').value.trim();
            const resultsDiv = document.getElementById('testResults');
            
            if (!input) {
                resultsDiv.innerHTML = '<p style="color: #e74c3c;">Please enter some text to test.</p>';
                return;
            }
            
            const results = `
                <h4>All Encryption Results:</h4>
                <div class="result-item">
                    <h5 class="result-title">1. Caesar Cipher (Shift=3):</h5>
                    <div class="result-content">
                        <div><strong>Input:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${caesarEncrypt(input)}</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">2. Rail Fence Cipher (3 rails):</h5>
                    <div class="result-content">
                        <div><strong>Input:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${railFenceEncrypt(input)}</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">3. Columnar Transposition (Key="SECURITY"):</h5>
                    <div class="result-content">
                        <div><strong>Input:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${columnarEncrypt(input)}</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">4. Hill Cipher (2×2 Matrix):</h5>
                    <div class="result-content">
                        <div><strong>Input:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${hillEncrypt(input)}</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">5. Vigenère Cipher (Key="KEY", numeric):</h5>
                    <div class="result-content">
                        <div><strong>Input:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${vigenereEncryptNumeric(input)}</div>
                    </div>
                </div>
            `;
            
            resultsDiv.innerHTML = results;
        }
        
        function testAllDecryption() {
            const input = document.getElementById('testInput').value.trim();
            const resultsDiv = document.getElementById('testResults');
            
            if (!input) {
                resultsDiv.innerHTML = '<p style="color: #e74c3c;">Please enter encrypted text to test decryption.</p>';
                return;
            }
            
            // For demonstration, we'll encrypt then decrypt to show the cycle
            const caesarEnc = caesarEncrypt(input);
            const caesarDec = caesarDecrypt(caesarEnc);
            
            const railEnc = railFenceEncrypt(input);
            // Note: Rail fence decryption is complex, so we'll show encryption-decryption pair
            
            const results = `
                <h4>Decryption Test Results:</h4>
                <p><em>Note: For demonstration, showing encryption → decryption cycle</em></p>
                
                <div class="result-item">
                    <h5 class="result-title">1. Caesar Cipher Cycle:</h5>
                    <div class="result-content">
                        <div><strong>Original:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${caesarEnc}</div>
                        <div><strong>Decrypted:</strong> ${caesarDec}</div>
                        <div><strong>Match:</strong> ${input === caesarDec ? '✓ Yes' : '✗ No'}</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">2. Rail Fence Cipher:</h5>
                    <div class="result-content">
                        <div><strong>Original:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${railEnc}</div>
                        <div><strong>Note:</strong> Decryption requires pattern reconstruction</div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">3. Other Algorithms:</h5>
                    <div class="result-content">
                        <div><strong>Columnar Transposition:</strong> Complex matrix reconstruction</div>
                        <div><strong>Hill Cipher:</strong> Requires inverse matrix calculation</div>
                        <div><strong>Vigenère:</strong> Simple subtraction with key</div>
                    </div>
                </div>
            `;
            
            resultsDiv.innerHTML = results;
        }
        
        function testFullCycle() {
            const input = document.getElementById('testInput').value.trim();
            const resultsDiv = document.getElementById('testResults');
            
            if (!input) {
                resultsDiv.innerHTML = '<p style="color: #e74c3c;">Please enter text to test full cycle.</p>';
                return;
            }
            
            // Test Caesar cipher full cycle
            const caesarEnc = caesarEncrypt(input);
            const caesarDec = caesarDecrypt(caesarEnc);
            
            // Test numeric Vigenère
            const numericInput = input.replace(/\D/g, '');
            const vigenereEnc = vigenereEncryptNumeric(input);
            const vigenereDec = (function() {
                const key = "KEY";
                let result = '';
                for (let i = 0; i < vigenereEnc.length; i++) {
                    const textChar = parseInt(vigenereEnc[i]);
                    const keyChar = key.charCodeAt(i % key.length) - 65;
                    const decrypted = (textChar - (keyChar % 10) + 10) % 10;
                    result += decrypted.toString();
                }
                return result;
            })();
            
            const results = `
                <h4>Full Encryption → Decryption Cycle Test:</h4>
                
                <div class="result-item">
                    <h5 class="result-title">1. Caesar Cipher:</h5>
                    <div class="result-content">
                        <div><strong>Original:</strong> ${input}</div>
                        <div><strong>Encrypted:</strong> ${caesarEnc}</div>
                        <div><strong>Decrypted:</strong> ${caesarDec}</div>
                        <div style="grid-column: 1 / -1; padding: 10px; background: ${input === caesarDec ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
                            <strong>Result:</strong> ${input === caesarDec ? '✓ Perfect cycle - Original restored!' : '✗ Cycle incomplete'}
                        </div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">2. Vigenère Cipher (Numeric):</h5>
                    <div class="result-content">
                        <div><strong>Original (digits):</strong> ${numericInput || 'No digits found'}</div>
                        <div><strong>Encrypted:</strong> ${vigenereEnc}</div>
                        <div><strong>Decrypted:</strong> ${vigenereDec}</div>
                        <div style="grid-column: 1 / -1; padding: 10px; background: ${numericInput === vigenereDec ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
                            <strong>Result:</strong> ${numericInput === vigenereDec ? '✓ Perfect cycle - Original restored!' : '✗ Cycle incomplete'}
                        </div>
                    </div>
                </div>
                
                <div class="result-item">
                    <h5 class="result-title">3. Other Algorithms:</h5>
                    <div class="result-content">
                        <div><strong>Rail Fence:</strong> Works on any text, decryption requires pattern reconstruction</div>
                        <div><strong>Columnar Transposition:</strong> Works on any text, requires matrix operations</div>
                        <div><strong>Hill Cipher:</strong> Works on letters only, requires matrix inversion</div>
                    </div>
                </div>
            `;
            
            resultsDiv.innerHTML = results;
        }
        
        function clearAllTests() {
            document.getElementById('testResults').innerHTML = '<p style="text-align: center; color: #7f8c8d;">Test results will appear here...</p>';
            document.getElementById('testInput').value = '';
        }
        
        // Initialize page on load
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
        });