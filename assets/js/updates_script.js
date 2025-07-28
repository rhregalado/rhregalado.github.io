document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".carousel_item");
  const dots = document.querySelectorAll(".carousel_dot");
  const prevBtn = document.querySelector(".carousel_button__prev");
  const nextBtn = document.querySelector(".carousel_button__next");

  let currentIndex = 0;
  let interval = setInterval(nextSlide, 5000);

  function updateCarousel() {
    items.forEach((item, index) => {
      item.classList.remove("carousel_item__active");
      if (index === currentIndex) item.classList.add("carousel_item__active");
    });

    dots.forEach((dot, index) => {
      dot.classList.remove("carousel_dot__active");
      if (index === currentIndex) dot.classList.add("carousel_dot__active");
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      resetInterval();
    });
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  updateCarousel();
});
