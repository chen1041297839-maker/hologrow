(() => {
  const items = Array.from(document.querySelectorAll("#faq details"));

  items.forEach((item) => {
    item.setAttribute("name", "amazon-seller-faq");
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
