document.addEventListener('DOMContentLoaded', function() {
    generateCaptcha();

    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const captchaInput = document.getElementById('captchaInput').value;
        const captchaText = document.getElementById('captcha').textContent;

        if (captchaInput === captchaText) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const content = document.getElementById('content').value;

            const feedback = {
                name: name,
                email: email,
                content: content
            };

            fetch('http://localhost:5000/api/Feedback/CreateFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedback)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Cảm ơn bạn đã gửi phản hồi!');
                // Clear the form
                this.reset();
                generateCaptcha();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi. Vui lòng thử lại.');
            });
        } else {
            alert('Mã captcha không đúng. Vui lòng thử lại.');
            generateCaptcha();
        }
    });
});

function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('captcha').textContent = captcha;
}