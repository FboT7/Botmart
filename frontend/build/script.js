document.getElementById('orderForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const userId = "67c6841ab70f65385aae0173";
    const deliveryAddress = "285 Old Westport";

    if (productName && quantity > 0) {
        const orderData = {
            userId,
            items: [
                { productName, price: 5, quantity }
            ],
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
                document.getElementById('orderStatus').textContent = `Order placed successfully! Order ID: ${result.order._id}`;
            } else {
                const errorData = await response.json();
                document.getElementById('orderStatus').textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            document.getElementById('orderStatus').textContent = 'Error placing order. Check console for details.';
            console.error("Order placement error:", error);
        }
    } else {
        document.getElementById('orderStatus').textContent = 'Please enter a valid product name and quantity.';
    }
});
