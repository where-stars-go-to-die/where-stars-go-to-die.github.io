document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('selectstart', (e) => {
    const tag = e.target.tagName.toLowerCase();

    if (tag === 'input' || tag === 'textarea') {
        return;
    }

    e.preventDefault();
});