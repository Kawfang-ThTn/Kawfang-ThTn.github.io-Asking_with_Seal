let rightClickCount = 0;
const MAX_CLICKS = 3;

const btnRight = document.getElementById('btn-right');
const btnLeft = document.getElementById('btn-left');
const hint = document.getElementById('hint');
const modal = document.getElementById('modal');
const btnRightLabel = document.getElementById('btn-right-label');

/* ── Right button: grow each click, hide on 3rd ── */
function growBtn() {
    rightClickCount++;

    // Remove previous size classes
    btnRight.classList.remove('size-1', 'size-2', 'size-3');

    if (rightClickCount === 1) {
        btnRight.classList.add('size-1');
        btnRightLabel.textContent = '🚀 Go!!';
        hint.textContent = 'getting bigger... (' + rightClickCount + '/3)';
    } else if (rightClickCount === 2) {
        btnRight.classList.add('size-2');
        btnRightLabel.textContent = '🚀 GO!!!';
        hint.textContent = 'one more click... (' + rightClickCount + '/3)';
    } else if (rightClickCount >= MAX_CLICKS) {
        // Hide right button completely
        btnRight.classList.add('size-3'); // display:none via CSS
        hint.textContent = 'press ✨ Yay! to finish 👈';
        hint.style.color = 'rgba(255, 100, 100, 0.7)';
    }
}

/* ── Open modal ── */
function openModal() {
    modal.classList.remove('hidden');
}

/* ── Close modal + full reset ── */
function closeModal() {
    modal.classList.add('hidden');

    // Reset right button
    rightClickCount = 0;
    btnRight.classList.remove('size-1', 'size-2', 'size-3');
    btnRightLabel.textContent = '🚀 Go';

    // Reset hint
    hint.textContent = 'click right button to see what happens';
    hint.style.color = '';
}
