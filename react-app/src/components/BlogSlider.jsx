import { useEffect, useMemo } from 'react'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

const BlogSlider = () => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const blogs = useMemo(
    () => [
      {
        slug: 'entrepreneurship',
        title: "In doubt? Entrepreneurs' Acute Acumen",
        img: `${baseUrl}img/portfolio/entrepreneurship.jpeg`,
        excerpt: 'My very first blog. Thoughts on entrepreneurship and decision making.',
        href: `https://www.linkedin.com/pulse/doubt-entrepreneurs-acute-acumen-siddharth-choudhary`,
      },
      {
        slug: 'oci-ai-agent',
        title: 'OCI AI Agent prototype',
        img: `${baseUrl}img/portfolio/oci-new-logo-scaled.jpeg`,
        excerpt: 'Prototype to scan Jira tickets and suggest workarounds or SMEs for faster issue resolution.',
        href: `blogs/oci-ai-agent/`,
      },
    ],
    [baseUrl]
  )

  useEffect(() => {
    const slider = new Swiper('.blog-slider', {
      speed: 600,
      loop: false,
      autoplay: { delay: 5000, disableOnInteraction: false },
      autoHeight: false,
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 16,
      breakpoints: {
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
      pagination: { el: '.blog-slider .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.blog-slider .swiper-button-next',
        prevEl: '.blog-slider .swiper-button-prev',
      },
    })

    const onVisible = () => {
      try {
        slider.update()
      } catch (_) {}
    }
    window.addEventListener('blog-slider-visible', onVisible)

    return () => {
      window.removeEventListener('blog-slider-visible', onVisible)
      slider && slider.destroy(true, true)
    }
  }, [])

  return (
    <div className="blog-slider swiper">
      <div className="swiper-wrapper">
        {blogs.map((b) => (
          <div className="swiper-slide" key={b.slug}>
            <div className="card h-100">
              <img src={b.img} className="card-img-top" alt={b.title} loading="lazy" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text flex-grow-1">{b.excerpt}</p>
                <a
                  className="btn btn-warning align-self-start"
                  href={b.href}
                  target={/^https?:\/\//.test(b.href) ? '_blank' : undefined}
                  rel={/^https?:\/\//.test(b.href) ? 'noopener noreferrer' : undefined}
                >
                  Read post
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  )
}

export default BlogSlider
