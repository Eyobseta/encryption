        async function loadEncryptedData() {
            try {
                const response = await fetch('http://localhost:3000/users/encrypted');
                const users = await response.json();
                displayEncryptedData(users);
            } catch (error) {
                showError('Failed to load encrypted data');
            }
        }

        async function loadDecryptedData() {
            try {
                const response = await fetch('http://localhost:3000/users/decrypted');
                const users = await response.json();
                displayDecryptedData(users);
            } catch (error) {
                showError('Failed to load decrypted data');
            }
        }

        async function loadBothData() {
            try {
                const response = await fetch('http://localhost:3000/users/both');
                const data = await response.json();
                displayBothData(data);
            } catch (error) {
                showError('Failed to load data');
            }
        }

        function displayEncryptedData(users) {
            if (users.length === 0) {
                document.getElementById('dataDisplay').innerHTML = '<p>No users in database.</p>';
                return;
            }

            let html = `<h3>Encrypted Data (${users.length} users)</h3>`;
            html += '<table><tr><th>ID</th><th>Encrypted Name</th><th>Encrypted Email</th><th>Encrypted Password</th><th>Encrypted ID</th><th>Encrypted Phone</th></tr>';
            
            users.forEach(user => {
                html += `
                    <tr>
                        <td>${user.id}</td>
                        <td class="encrypted">${user.fullName}</td>
                        <td class="encrypted">${user.email}</td>
                        <td class="encrypted">${user.password}</td>
                        <td class="encrypted">${user.nationalId}</td>
                        <td class="encrypted">${user.phoneNumber}</td>
                    </tr>
                `;
            });
            
            html += '</table>';
            document.getElementById('dataDisplay').innerHTML = html;
        }

        function displayDecryptedData(users) {
            if (users.length === 0) {
                document.getElementById('dataDisplay').innerHTML = '<p>No users in database.</p>';
                return;
            }

            let html = `<h3>Decrypted Data (${users.length} users)</h3>`;
            html += '<table><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Password</th><th>National ID</th><th>Phone Number</th></tr>';
            
            users.forEach(user => {
                html += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.nationalId}</td>
                        <td>${user.phoneNumber}</td>
                    </tr>
                `;
            });
            
            html += '</table>';
            document.getElementById('dataDisplay').innerHTML = html;
        }

        function displayBothData(data) {
            if (data.length === 0) {
                document.getElementById('dataDisplay').innerHTML = '<p>No users in database.</p>';
                return;
            }

            let html = `<h3>Both Encrypted and Decrypted (${data.length} users)</h3>`;
            
            data.forEach(item => {
                html += `
                    <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                        <h4>User ID: ${item.encrypted.id}</h4>
                        <div style="display: flex; justify-content: space-between;">
                            <div style="width: 48%;">
                                <strong>Encrypted:</strong>
                                <p><small>Name:</small> <span class="encrypted">${item.encrypted.fullName}</span></p>
                                <p><small>Email:</small> <span class="encrypted">${item.encrypted.email}</span></p>
                                <p><small>Password:</small> <span class="encrypted">${item.encrypted.password}</span></p>
                                <p><small>ID:</small> <span class="encrypted">${item.encrypted.nationalId}</span></p>
                                <p><small>Phone:</small> <span class="encrypted">${item.encrypted.phoneNumber}</span></p>
                            </div>
                            <div style="width: 48%;">
                                <strong>Decrypted:</strong>
                                <p><small>Name:</small> ${item.decrypted.fullName}</p>
                                <p><small>Email:</small> ${item.decrypted.email}</p>
                                <p><small>Password:</small> ${item.decrypted.password}</p>
                                <p><small>ID:</small> ${item.decrypted.nationalId}</p>
                                <p><small>Phone:</small> ${item.decrypted.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            document.getElementById('dataDisplay').innerHTML = html;
        }

        async function clearDatabase() {
            if (confirm('Are you sure you want to clear all user data?')) {
                try {
                    await fetch('http://localhost:3000/clear', { method: 'DELETE' });
                    document.getElementById('dataDisplay').innerHTML = 
                        '<p style="color: green;">Database cleared successfully.</p>';
                } catch (error) {
                    showError('Failed to clear database');
                }
            }
        }

        function showError(message) {
            document.getElementById('dataDisplay').innerHTML = 
                `<p style="color: red;">Error: ${message}. Make sure backend is running on port 3000.</p>`;
        }


     document.querySelector('#viewEncryptedData').addEventListener("click",loadEncryptedData);
     document.querySelector('#viewDecryptedData').addEventListener("click",loadDecryptedData);
     document.querySelector('#viewBoth').addEventListener("click",loadBothData);
     document.querySelector('#clearDB').addEventListener('click',clearDatabase);