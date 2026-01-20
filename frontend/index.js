// script.js - Handles only index.html functionality

document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        nationalId: document.getElementById('nationalId').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };
    
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('responseMessage').innerHTML = `
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px;">
                    <strong>✓ User registered successfully!</strong><br>
                    Encrypted data stored in database.<br>
                    <small>ID: ${result.encryptedUser.id}</small>
                </div>
            `;
            document.getElementById('registrationForm').reset();
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        document.getElementById('responseMessage').innerHTML = `
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px;">
                <strong>✗ Error:</strong> ${error.message}<br>
                Make sure the backend server is running on port 3000.
            </div>
        `;
    }
});

function clearForm() {
    document.getElementById('registrationForm').reset();
    document.getElementById('responseMessage').innerHTML = '';
}