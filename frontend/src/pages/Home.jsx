import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCoverflow,
  EffectCards
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";

import logo from "../assets/logo.png";
import ChatbotAssistant from "../components/ChatbotAssistant";

import { getActiveMenuItems } from "../services/menuService";
import { getActiveDeals } from "../services/dealService";
import { API_ORIGIN } from "../services/api";

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/src/assets/hero-bg.jpg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_ORIGIN}${imageUrl}`;
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const menuRes = await getActiveMenuItems();
        const dealRes = await getActiveDeals();

        setMenuItems(menuRes.items || []);
        setDeals(dealRes.deals || []);
      } catch (error) {
        console.error("Home slider data load failed", error);
      }
    };

    loadHomeData();
  }, []);

  const heroSlides = useMemo(() => {
    const menuSlides = menuItems.slice(0, 4).map((item) => ({
      id: `menu-${item.id}`,
      title: item.name,
      subtitle: item.description || "Freshly prepared Broast Chasers item",
      price: `Rs. ${item.price}`,
      image: getImageUrl(item.image_url),
      link: "/menu-deals#menu",
      badge: item.category || "Menu"
    }));

    const dealSlides = deals.slice(0, 2).map((deal) => ({
      id: `deal-${deal.id}`,
      title: deal.name,
      subtitle: deal.items_description || "Special Broast Chasers deal",
      price: `Rs. ${deal.price}`,
      image: getImageUrl(deal.image_url),
      link: "/menu-deals#deals",
      badge: "Deal"
    }));

    const allSlides = [...menuSlides, ...dealSlides];

    if (allSlides.length > 0) return allSlides;

    return [
      {
        id: "default-1",
        title: "Quarter Broast",
        subtitle: "Crispy broast served with fries, bun and dip",
        price: "Rs. 750",
        image: "/src/assets/hero-bg.jpg",
        link: "/menu-deals#menu",
        badge: "Broast"
      },
      {
        id: "default-2",
        title: "Family Deal",
        subtitle: "Perfect meal deal for family sharing",
        price: "Rs. 2499",
        image: "/src/assets/hero-bg.jpg",
        link: "/menu-deals#deals",
        badge: "Deal"
      }
    ];
  }, [menuItems, deals]);

  return (
    <>
      {/* HERO SLIDER */}
      <section className="premium-hero-slider">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          loop
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          className="premium-hero-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="premium-hero-slide"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,.58), rgba(0,0,0,.78)), url(${slide.image})`
                }}
              >
                <div className="premium-hero-content">
                  <img src={logo} alt="Broast Chasers Logo" className="hero-logo" />

                  <span className="slider-badge">{slide.badge}</span>

                  <h1>Broast Chasers</h1>
                  <h2>{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                  <h3>{slide.price}</h3>

                  <Link to={slide.link}>
                    <button className="primary-btn">Order Now</button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* FEATURED MENU COVERFLOW */}
      <section className="section coverflow-section">
        <div className="section-header-row">
          <h2>Featured Menu</h2>

          <Link to="/menu-deals#menu">
            <button className="secondary-btn">View Full Menu</button>
          </Link>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          navigation
          pagination={{ clickable: true }}
          slidesPerView="auto"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 160,
            modifier: 1,
            slideShadows: true
          }}
          className="menu-coverflow-swiper"
        >
          {menuItems.map((item) => (
            <SwiperSlide key={item.id} className="coverflow-slide">
              <Link to="/menu-deals#menu" className="coverflow-card">
                <div
                  className="coverflow-img"
                  style={{
                    backgroundImage: `url(${getImageUrl(item.image_url)})`
                  }}
                ></div>

                <div className="coverflow-content">
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>Rs. {item.price}</strong>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* DEALS CARDS SLIDER */}
      <section className="section deals-card-section">
        <div className="section-header-row">
          <h2>Deals & Promotions</h2>

          <Link to="/menu-deals#deals">
            <button className="secondary-btn">View All Deals</button>
          </Link>
        </div>

        <div className="deals-cards-wrap">
          <Swiper
            modules={[Autoplay, EffectCards]}
            effect="cards"
            grabCursor
            loop
            autoplay={{
              delay: 3200,
              disableOnInteraction: false
            }}
            className="deals-cards-swiper"
          >
            {deals.map((deal) => (
              <SwiperSlide key={deal.id}>
                <Link to="/menu-deals#deals" className="deal-stack-card">
                  <div
                    className="deal-stack-image"
                    style={{
                      backgroundImage: `url(${getImageUrl(deal.image_url)})`
                    }}
                  ></div>

                  <div className="deal-stack-content">
                    <span>Special Deal</span>
                    <h3>{deal.name}</h3>
                    <p>{deal.items_description}</p>
                    <strong>Rs. {deal.price}</strong>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <ChatbotAssistant />
    </>
  );
}

export default Home;