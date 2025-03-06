document.addEventListener('DOMContentLoaded', function () {
    // Lấy thông tin từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const showtimeId = urlParams.get('showtimeId');
    const ticketType = urlParams.get('ticketType');
    const price = urlParams.get('price');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const phone = urlParams.get('phone');

    // Hiển thị thông tin đơn hàng
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = `
        <p>Suất chiếu: ${showtimeId}</p>
        <p>Loại vé: ${ticketType}</p>
        <p>Giá: ${price} VND</p>
        <p>Tên: ${name}</p>
        <p>Email: ${email}</p>
        <p>Số điện thoại: ${phone}</p>
    `;

    // Xử lý nút thanh toán
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', async function () {
        payButton.disabled = true;
        payButton.textContent = "Đang xử lý...";

        const paymentData = {
            showtimeId,
            ticketType,
            amount: parseInt(price),
            name,
            email,
            phone
        };

        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-payment', paymentData);
            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                alert('Có lỗi xảy ra khi tạo thông tin thanh toán');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
        } finally {
            payButton.disabled = false;
            payButton.textContent = "Thanh toán qua VNPay";
        }
    });
});