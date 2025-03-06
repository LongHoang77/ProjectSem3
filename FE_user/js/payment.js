// document.addEventListener('DOMContentLoaded', function () {
//     // Lấy thông tin từ URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const showtimeId = urlParams.get('showtimeId');
//     const ticketType = urlParams.get('ticketType');
//     const price = urlParams.get('price');
//     const name = urlParams.get('name');
//     const email = urlParams.get('email');
//     const phone = urlParams.get('phone');

//     // Hiển thị thông tin đơn hàng
//     const orderSummary = document.getElementById('order-summary');
//     orderSummary.innerHTML = `
//         <p>Suất chiếu: ${showtimeId}</p>
//         <p>Loại vé: ${ticketType}</p>
//         <p>Giá: ${price} VND</p>
//         <p>Tên: ${name}</p>
//         <p>Email: ${email}</p>
//         <p>Số điện thoại: ${phone}</p>
//     `;

//     // Xử lý nút thanh toán
//     const payButton = document.getElementById('pay-button');
//     payButton.addEventListener('click', async function () {
//         payButton.disabled = true;
//         payButton.textContent = "Đang xử lý...";

//         const paymentData = {
//             // movieTitle: movieTitle, // Tên phim
//             showtime: showtimeId,   // Suất chiếu
//             ticketType: ticketType, // Loại vé
//             amount: price,          // Gửi giá vé lên backend
//             name: name,
//             email: email,
//             phone: phone
//         };

//         try {
//             const response = await fetch('http://localhost:5000/api/pay/test', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(paymentData)
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data && data.paymentUrl) {
//                 window.location.href = data.paymentUrl;
//             } else {
//                 alert('Có lỗi xảy ra khi tạo thông tin thanh toán');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert(`Có lỗi xảy ra: ${error.message}`);
//         } finally {
//             payButton.disabled = false;
//             payButton.textContent = "Thanh toán qua VNPay";
//         }
//     });
// });
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
        <p>Suất chiếu: ${showtimeId || 'N/A'}</p>
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
            showtime: showtimeId,
            ticketType: ticketType,
            amount: parseInt(price), // Chuyển đổi sang số nguyên và đơn vị đồng
            name: name,
            email: email,
            phone: phone
        };

        try {
            const response = await fetch('http://localhost:5000/api/pay/test', {
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