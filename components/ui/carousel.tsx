import React from "react";
import Splide from "@splidejs/splide";

const Carousel: React.FC = () => {
  new Splide(".splide").mount();

  return (
    <section className="splide" aria-label="Splide Basic HTML Example">
      <div className="splide__track">
        <ul className="splide__list">
          <li className="splide__slide">Slide 01</li>
          <li className="splide__slide">Slide 02</li>
          <li className="splide__slide">Slide 03</li>
        </ul>
      </div>
    </section>
  );
};

export default Carousel;
