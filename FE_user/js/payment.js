document.addEventListener('DOMContentLoaded', function () {
    // Lấy thông tin từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const showtimeId = urlParams.get('showtimeId');
    const startTime = urlParams.get('startTime');
    const endTime = urlParams.get('endTime');
    const ticketType = urlParams.get('ticketType');
    const price = urlParams.get('price');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const phone = urlParams.get('phone');
    const movieTitle = urlParams.get('movieTitle');

    function formatTime(timeString) {
        if (!timeString) return 'N/A'; // Trả về 'N/A' nếu timeString là null hoặc undefined
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Kiểm tra xem date có hợp lệ không
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    // Hiển thị thông tin đơn hàng
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = `
        <p>Tên phim: ${movieTitle || 'N/A'}</p>
        <p>Suất chiếu: ${formatTime(startTime)} - ${formatTime(endTime)}</p>
        <p>Loại vé: ${ticketType || 'N/A'}</p>
        <p>Giá: ${price ? price + ' VND' : 'N/A'}</p>
        <p>Tên: ${name || 'N/A'}</p>
        <p>Email: ${email || 'N/A'}</p>
        <p>Số điện thoại: ${phone || 'N/A'}</p>
    `;

    // Xử lý nút thanh toán
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', async function () {
        payButton.disabled = true;
        payButton.textContent = "Đang xử lý...";

        const paymentData = {
            movieTitle: movieTitle,
            showtime: `${formatTime(startTime)} - ${formatTime(endTime)}`, // Sử dụng showtimeStart thay vì showtimeId
            ticketType: ticketType,
            amount: parseInt(price),
            name: name,
            email: email,
            phone: phone,
            showtimeId: showtimeId // Vẫn giữ showtimeId để sử dụng ở backend
        };

        try {
            const response = await fetch('http://localhost:5000/api/pay/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert('Có lỗi xảy ra khi tạo thông tin thanh toán');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra: ${error.message}`);
        } finally {
            payButton.disabled = false;
            payButton.textContent = "Thanh toán qua VNPay";
        }
    });
});