export function initVerificationUI() {
    const form = document.getElementById('verifyForm');
    if (!form) return;

    setupCodeInputs();
    setupFormSubmission(form);
    startResendTimer();
}

function setupCodeInputs() {
    const inputs = document.querySelectorAll('[data-code-input]');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                input.value = e.key;
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                input.value = '';
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.match(/\d/g) || [];
            
            inputs.forEach((input, i) => {
                if (digits[i]) {
                    input.value = digits[i];
                }
            });

            if (digits.length > 0) {
                inputs[Math.min(digits.length - 1, inputs.length - 1)].focus();
            }
        });
    });
}

function setupFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[name="email"]').value;
        const type = form.querySelector('input[name="type"]').value;
        const inputs = form.querySelectorAll('[data-code-input]');
        const code = Array.from(inputs).map(input => input.value).join('');
        
        try {
            const response = await fetch(`/auth/verify?type=${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            });
            
            const result = await response.json();
            if (result.success) {
                window.showNotification('Verification successful!', 'success');
                setTimeout(() => window.location.href = '/', 1500);
            } else {
                window.showNotification(result.error || 'Invalid verification code', 'error');
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }
        } catch (error) {
            window.showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

let resendTimer;
let timeLeft = 60;

export function startResendTimer() {
    const timerEl = document.getElementById('resendTimer');
    const resendButton = document.getElementById('resendButton');
    const timerCount = timerEl.querySelector('.timer-count');
    
    if (!timerEl || !resendButton || !timerCount) return;

    timerEl.classList.remove('hidden');
    resendButton.classList.add('hidden');
    
    timeLeft = 60;
    timerCount.textContent = timeLeft;
    
    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
        timeLeft--;
        timerCount.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(resendTimer);
            timerEl.classList.add('hidden');
            resendButton.classList.remove('hidden');
        }
    }, 1000);
}

export async function resendCode() {
    const form = document.getElementById('verifyForm');
    if (!form) return;

    const email = form.querySelector('input[name="email"]').value;
    const type = form.querySelector('input[name="type"]').value;
    
    try {
        const response = await fetch(`/auth/resend-code?type=${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        if (result.success) {
            window.showNotification('A new verification code has been sent', 'success');
            startResendTimer();
        } else {
            window.showNotification(result.error || 'Failed to send code', 'error');
        }
    } catch (error) {
        window.showNotification('An error occurred. Please try again.', 'error');
    }
}