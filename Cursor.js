document.addEventListener("mousemove", (e) => {
    const customCursor = document.querySelector(".custom-cursor");
    customCursor.style.left = e.pageX + "px";
    customCursor.style.top = e.pageY + "px";
});
