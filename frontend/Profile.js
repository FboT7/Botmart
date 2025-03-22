document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const editBtn = document.querySelector('.edit-btn');
    const saveBtn = document.querySelector('.save-btn');
    const inputs = document.querySelectorAll('#profile-form input');
    const cancelBtn = document.querySelector('.cancel-btn');
    const userInfoFields = document.querySelectorAll('.user-info p');
    const passwordChangeForm = document.querySelector('#password-change-form');
    const orderHistoryList = document.querySelector('.past-orders ul');

    // Sample user data (replace with actual data retrieval logic)
    let userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        address: '123 Main St, Anytown, USA',
        orders: [
            { id: '12345', amount: '$25.00', date: '01/15/2025' },
            { id: '12344', amount: '$15.50', date: '12/30/2024' }
        ]
    };

    // Function to populate user information
    function populateUserInfo() {
        userInfoFields[0].textContent = `Name: ${userData.name}`;
        userInfoFields[1].textContent = `Email: ${userData.email}`;
        userInfoFields[2].textContent = `Phone: ${userData.phone}`;
        userInfoFields[3].textContent = `Address: ${userData.address}`;
    }

    // Function to populate order history
    function populateOrderHistory() {
        orderHistoryList.innerHTML = '';
        userData.orders.forEach(order => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p><strong>Order #${order.id}</strong> - ${order.amount}</p>
                <p><em>Placed on ${order.date}</em></p>
            `;
            orderHistoryList.appendChild(listItem);
        });
    }

    // Enable editing of user information
    editBtn.addEventListener('click', () => {
        userInfoFields.forEach(field => {
            const [label, value] = field.textContent.split(': ');
            field.innerHTML = `${label}: <input type="text" value="${value}">`;
        });
        toggleEditButtons(true);
    });

    // Save edited user information
    saveBtn.addEventListener('click', () => {
        userInfoFields.forEach(field => {
            const input = field.querySelector('input');
            const label = field.textContent.split(': ')[0];
            const newValue = input.value;
            field.textContent = `${label}: ${newValue}`;
            // Update userData object
            const key = label.toLowerCase();
            userData[key] = newValue;
        });
        toggleEditButtons(false);
        // Implement logic to save updated user data to the server
    });

    // Cancel editing
    cancelBtn.addEventListener('click', () => {
        populateUserInfo();
        toggleEditButtons(false);
    });

    // Toggle edit/save/cancel buttons
    function toggleEditButtons(isEditing) {
        editBtn.style.display = isEditing ? 'none' : 'inline-block';
        saveBtn.style.display = isEditing ? 'inline-block' : 'none';
        cancelBtn.style.display = isEditing ? 'inline-block' : 'none';
    }

    // Handle password change form submission
    passwordChangeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }

        // Implement password change logic (e.g., validate current password, update to new password)
        // For now, just display a success message
        alert('Password changed successfully.');
        passwordChangeForm.reset();
    });

    // Initialize page with user data
    populateUserInfo();
    populateOrderHistory();
    toggleEditButtons(false);
});

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Load user data from localStorage
function loadUserData() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
        userData = JSON.parse(storedData);
        populateUserInfo();
    }
}

// Call loadUserData() when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    // Other initialization code...
});


// Send data to the server
fetch('/update-profile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        // Optionally, store data locally
        localStorage.setItem('userData', JSON.stringify(updatedData));
        alert('Profile updated successfully.');
    } else {
        alert('Failed to update profile.');
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('An error occurred while updating your profile.');
});

saveButton.disabled = true;
editButton.disabled = true;





