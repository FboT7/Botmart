// Function to display cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.productPrice * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.productName}</span>
                <span>$${item.productPrice.toFixed(2)}</span>
                <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                <button data-index="${index}" class="remove-item">Remove</button>
            </div>
        `;
    });

    cartTotalContainer.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Function to remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Event listener for quantity change
document.addEventListener('change', (event) => {
    if (event.target.classList.contains('quantity-input')) {
        const index = event.target.getAttribute('data-index');
        const quantity = parseInt(event.target.value);
        updateQuantity(index, quantity);
    }
});

// Event listener for remove button
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item')) {
        const index = event.target.getAttribute('data-index');
        removeItem(index);
    }
});

// Display cart on page load
document.addEventListener('DOMContentLoaded', displayCart);

document.getElementById('place-order').addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const userId = "67c6841ab70f65385aae0173"; // Replace with dynamic user ID
    const deliveryAddress = "285 Old Westport"; // Replace with user's delivery address

    const orderData = {
        userId,
        items: cart.map(item => ({
            productName: item.productName,
            price: item.productPrice,
            quantity: item.quantity
        })),
        deliveryAddress
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            // Handle successful order placement, e.g., navigate to order tracking
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order.');
    } finally {
        // Optional: Code that runs regardless of success or error
    }
});



// Function to check if profile is complete
function isProfileComplete() {
    return userData.name && userData.address && userData.phone;
}

// Event listener for place order button
document.getElementById('place-order').addEventListener('click', () => {
    if (isProfileComplete()) {
        // Proceed with order placement
    } else {
        alert('Please complete your profile before placing an order.');
        // Optionally, redirect to profile page
        window.location.href = 'profile.html';
    }
});



document.getElementById('place-order').addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Retrieve user profile information from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (!userProfile) {
        alert('Please complete your profile information before placing an order.');
        return;
    }









// Function to fetch user data from the server
function fetchUserDataFromServer() {
    fetch('/get-profile')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            userData = data.userData;
            populateUserInfo();
            // Update localStorage to keep it in sync
            saveUserData();
        } else {
            console.error('Failed to retrieve profile data.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Call fetchUserDataFromServer() when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUserDataFromServer();
    // Other initialization code...
});


    const { userId, name, address, phone } = userProfile;

    const orderData = {
        userId,
        items: cart.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.productPrice,
            quantity: item.quantity
        })),
        deliveryAddress: address,
        customerName: name,
        customerPhone: phone
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to place order.');
        }

        const result = await response.json();
        const { trackingNumber, botId } = result;

        alert(`Order placed successfully! Your tracking number is ${trackingNumber}.`);

        // Initialize map for real-time tracking
        initMap(botId);
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error placing your order. Please try again.');
    }
});

function initMap(botId) {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 0, lng: 0 } // Default center; update based on bot's location
    });

    const botMarker = new google.maps.Marker({
        map: map,
        title: 'Delivery Bot'
    });

    // Function to update bot's location
    async function updateBotLocation() {
        try {
            const response = await fetch(`http://localhost:5000/api/bots/${botId}/location`);
            if (!response.ok) {
                throw new Error('Failed to fetch bot location.');
            }
            const { latitude, longitude } = await response.json();
            const botPosition = { lat: latitude, lng: longitude };
            botMarker.setPosition(botPosition);
            map.setCenter(botPosition);
        } catch (error) {
            console.error('Error fetching bot location:', error);
        }
    }

    // Update bot location every 5 seconds
    setInterval(updateBotLocation, 5000);
}
