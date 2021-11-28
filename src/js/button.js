function handleClickAnimation(button, callback) {
    const span = button.querySelector('span')
    if (span.classList.contains('running')) return

    animateButton(span)
    window.setTimeout(() => {
        animateButton(span)
        callback()
    }, 1000)
}

function handleErrorAnimation(button, callback) {
    const span = button.querySelector('span')
    if (span.classList.contains('running')) return

    animateError(span, button)
    window.setTimeout(() => {
        animateError(span, button)
        callback()
    }, 1000)
}

function animateButton(span) {
    const text = span.dataset.text
    span.dataset.text = span.innerHTML
    span.innerHTML = text
    span.classList.contains('running')
        ? span.classList.remove('running')
        : span.classList.add('running')
}

function animateError(span, button) {
    const text = span.dataset.error
    span.dataset.error = span.innerHTML
    span.innerHTML = text
    span.classList.contains('running')
        ? span.classList.remove('running')
        : span.classList.add('running')
    button.classList.contains('error')
        ? button.classList.remove('error')
        : button.classList.add('error')
}

export { handleClickAnimation, handleErrorAnimation, animateButton, animateError }
