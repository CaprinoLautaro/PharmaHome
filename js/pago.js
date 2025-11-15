
document.querySelectorAll('.icono-svg').forEach(async el => {
    const src = el.getAttribute('data-src');
    const response = await fetch(src);
    const svgText = await response.text();
    el.innerHTML = svgText;
});
