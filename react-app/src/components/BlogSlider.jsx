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
        platformLink: 'https://www.linkedin.com/pulse/doubt-entrepreneurs-acute-acumen-siddharth-choudhary',
        appPath: `${baseUrl}blogs/entrepreneurship/index.html`,
      },
      {
        slug: 'oci-ai-agent',
        title: 'OCI AI Agent prototype',
        img: `${baseUrl}img/portfolio/oci-new-logo-scaled.jpeg`,
        excerpt: 'Prototype to scan Jira tickets and suggest workarounds or SMEs for faster issue resolution.',
        appPath: `${baseUrl}blogs/oci-ai-agent/index.html`,
      },
      {
        slug: 'auto-blog-generator-ai-agent',
        title: 'Auto Blog Generator AI Agent',
        img: `${baseUrl}img/file.png`,
        excerpt:
          'Design notes for an AI agent that turns raw engineering updates into polished publish-ready blog drafts. Still working on it.',
        appPath: `${baseUrl}blogs/auto-blog-generator-ai-agent/index.html`,
      },
      {
        slug: 'tailor-resume-ai-agent',
        title: 'Tailor Resume AI Agent',
        img: `${baseUrl}img/portfolio/GitHub-logo.png`,
        excerpt:
          'Agent concept for tailoring resumes to specific job descriptions with measurable impact statements. Still working on it.',
        appPath: `${baseUrl}blogs/tailor-resume-ai-agent/index.html`,
      },
    ],
    [baseUrl]
  )

  const openBlog = (blog) => {
    if (blog.platformLink) {
      window.open(blog.platformLink, '_blank', 'noopener,noreferrer')
      return
    }
    window.location.href = blog.appPath
  }

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
                <button
                  type="button"
                  className="btn btn-warning align-self-start"
                  onClick={() => openBlog(b)}
                >
                  {b.platformLink ? 'Read on Platform' : 'Read on Site'}
                </button>
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
