document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const show = (id) => document.getElementById(id).style.display = 'block';
    const hide = (id) => document.getElementById(id).style.display = 'none';

    if (name.value.trim() === '') { show('nameError'); valid = false; } else hide('nameError');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { show('emailError'); valid = false; } else hide('emailError');
    if (message.value.trim() === '') { show('messageError'); valid = false; } else hide('messageError');

    if (!valid) return;

    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            message: message.value.trim()
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            alert('Something went wrong. Please try again.');
        }
    })
    .catch(() => alert('Something went wrong. Please try again.'));
});