let loading = false;
const flashEl = document.querySelector('.flash');

window.addEventListener('click', e => {
    if (e.target !== flashEl) flashEl.classList.remove('active');
})

/**
 * 
 * @param {'success'|'error'} type 
 * @param {string} message 
 */
function flash(type, message) {
    flashEl.classList.remove('active');
    flashEl.classList.remove('success');
    flashEl.classList.remove('error');
    flashEl.textContent = '-';

    flashEl.textContent = message;

    flashEl.classList.add('active');

    switch (type) {
        case 'success':
            flashEl.classList.add('success');
            break;
        case 'error':
            flashEl.classList.add('error');
            break;
        default:
            throw new Error('Invalid flash message type');
    }
}

async function logOut() {
    try {
        const res = await fetch('/logout', {
            method: 'DELETE'
        });
        const json = await res.json();
        if ('error' in json) {
            flash('error', json.error);
        } else {
            flash('success', json.success);
            setTimeout(() => window.location.assign(json.redirect), 1000);
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan');
    }
}