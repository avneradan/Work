document.addEventListener("mousemove", (e) => {
    const customCursor = document.querySelector(".custom-cursor");

    // If the element doesn't exist or there's some other issue, bail out
    if (!customCursor) return;

    customCursor.style.left = e.pageX + "px";
    customCursor.style.top = e.pageY + "px";
});
