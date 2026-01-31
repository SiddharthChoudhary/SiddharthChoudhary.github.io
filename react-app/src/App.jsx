import { useEffect } from 'react'
import Isotope from 'isotope-layout'
import GLightbox from 'glightbox'
import Swiper from 'swiper/bundle'
import PureCounter from '@srexi/purecounterjs'
import 'waypoints/lib/noframework.waypoints.js'

function App() {
  const resumeHref = `${import.meta.env.BASE_URL}pdf/Siddharth_Choudhary_Resume.pdf`
  useEffect(() => {
    const select = (el, all = false) => {
      el = el.trim()
      if (all) return Array.from(document.querySelectorAll(el))
      return document.querySelector(el)
    }

    const on = (type, el, listener, all = false) => {
      const selectEl = select(el, all)
      if (!selectEl) return
      if (all) selectEl.forEach((e) => e.addEventListener(type, listener))
      else selectEl.addEventListener(type, listener)
    }

    const onscroll = (el, listener) => el.addEventListener('scroll', listener)

    // Navbar active state on scroll
    let navbarlinks = []
    const navbarlinksActive = () => {
      const position = window.scrollY + 200
      navbarlinks.forEach((navbarlink) => {
        if (!navbarlink.hash) return
        const section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }

    // Scroll with header offset
    const scrollto = (el) => {
      const header = select('#header')
      if (!header) return
      let offset = header.offsetHeight
      if (!header.classList.contains('header-scrolled')) offset -= 20
      const elementPos = select(el)?.offsetTop ?? 0
      window.scrollTo({ top: elementPos - offset, behavior: 'smooth' })
    }

    // Header scrolled class
    const selectHeader = () => select('#header')
    const header = selectHeader()
    const headerScrolled = () => {
      const h = selectHeader()
      if (!h) return
      if (window.scrollY > 100) h.classList.add('header-scrolled')
      else h.classList.remove('header-scrolled')
    }

    // Back to top
    const backtotop = select('.back-to-top')
    const toggleBacktotop = () => {
      const b = select('.back-to-top')
      if (!b) return
      if (window.scrollY > 100) b.classList.add('active')
      else b.classList.remove('active')
    }

    // Setup on mount
    navbarlinks = Array.from(document.querySelectorAll('#navbar .scrollto'))
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    if (header) {
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }

    if (backtotop) {
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }

    // Mobile nav toggle
    on('click', '.mobile-nav-toggle', function () {
      const nav = select('#navbar')
      nav?.classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })

    // Mobile dropdowns
    on(
      'click',
      '.navbar .dropdown > a',
      function (e) {
        const nav = select('#navbar')
        if (nav?.classList.contains('navbar-mobile')) {
          e.preventDefault()
          this.nextElementSibling?.classList.toggle('dropdown-active')
        }
      },
      true
    )

    // Scrollto links
    on(
      'click',
      '.scrollto',
      function (e) {
        if (this.hash && select(this.hash)) {
          e.preventDefault()
          const navbar = select('#navbar')
          if (navbar?.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile')
            const navbarToggle = select('.mobile-nav-toggle')
            navbarToggle?.classList.toggle('bi-list')
            navbarToggle?.classList.toggle('bi-x')
          }
          scrollto(this.hash)
        }
      },
      true
    )

    // Hash on load
    const onLoad = () => {
      if (window.location.hash && select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
    window.addEventListener('load', onLoad)

    // Skills animation via Waypoints
    const skilsContent = select('.skills-content')
    let skillsWaypoint
    if (skilsContent && window.Waypoint) {
      // eslint-disable-next-line no-undef
      skillsWaypoint = new window.Waypoint({
        element: skilsContent,
        offset: '80%',
        handler: () => {
          const progress = select('.progress .progress-bar', true)
          progress.forEach((el) => {
            el.style.width = `${el.getAttribute('aria-valuenow')}%`
          })
        },
      })
    }

    // Testimonials slider (if present)
    let testimonialsSwiper
    if (document.querySelector('.testimonials-slider')) {
      testimonialsSwiper = new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        slidesPerView: 'auto',
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      })
    }

    // Portfolio isotope and filters
    let portfolioIsotope
    const onPortfolioLoad = () => {
      const portfolioContainer = select('.portfolio-container')
      if (portfolioContainer) {
        portfolioIsotope = new Isotope(portfolioContainer, { itemSelector: '.portfolio-item' })
        const filters = select('#portfolio-flters li', true)
        on(
          'click',
          '#portfolio-flters li',
          function (e) {
            e.preventDefault()
            filters.forEach((el) => el.classList.remove('filter-active'))
            this.classList.add('filter-active')
            portfolioIsotope.arrange({ filter: this.getAttribute('data-filter') || '*' })
          },
          true
        )
      }
    }
    window.addEventListener('load', onPortfolioLoad)

    // Portfolio lightbox
    const portfolioLightbox = GLightbox({ selector: '.portfolio-lightbox' })

    // Portfolio details slider (if present)
    let detailsSwiper
    if (document.querySelector('.portfolio-details-slider')) {
      detailsSwiper = new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      })
    }

    // Pure Counter
    const pc = new PureCounter()

    return () => {
      window.removeEventListener('load', navbarlinksActive)
      document.removeEventListener('scroll', navbarlinksActive)
      window.removeEventListener('load', headerScrolled)
      document.removeEventListener('scroll', headerScrolled)
      window.removeEventListener('load', toggleBacktotop)
      document.removeEventListener('scroll', toggleBacktotop)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('load', onPortfolioLoad)
      if (skillsWaypoint) skillsWaypoint.destroy()
      if (testimonialsSwiper) testimonialsSwiper.destroy(true, true)
      if (detailsSwiper) detailsSwiper.destroy(true, true)
      if (portfolioLightbox) portfolioLightbox.destroy()
      if (pc) {
        // no dispose API, rely on GC
      }
    }
  }, [])

  return (
    <>
      <header id="header" className="fixed-top d-flex justify-content-center align-items-center header-transparent">
        <nav id="navbar" className="navbar">
          <ul>
            <li>
              <a className="nav-link scrollto active" href="#hero">
                Home
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#resume">
                Resume
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#services">
                Services
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#portfolio">
                Portfolio
              </a>
            </li>
            <li className="dropdown">
              <a href="#">
                <span>Social Links</span> <i className="bi bi-chevron-down"></i>
              </a>
              <ul>
                <li>
                  <a href="https://github.com/SiddharthChoudhary">Github</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/siddharth-choudhary-440102b8/">LinkedIn</a>
                </li>
                <li>
                  <a href="https://leetcode.com/u/SidStillLearning/">Leetcode</a>
                </li>
                <li>
                  <a href="https://stackoverflow.com/users/5972784/siddharth-choudhary">Stack Overflow</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="nav-link scrollto" href="#contact">
                Contact
              </a>
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </header>

      <section id="hero">
        <div className="hero-container">
          <h1>Siddharth Choudhary</h1>
          <h2>Senior Software Engineer with 7+ years of experience.</h2>
          <a href="#about" className="btn-scroll scrollto" title="Scroll Down">
            <i className="bx bx-chevron-down"></i>
          </a>
        </div>
      </section>

      <main id="main">
        <section id="about" className="about">
          <div className="container">
            <div className="section-title">
              <span>About Me</span>
              <h2>About Me</h2>
              <p>
                Senior Software Engineer with 7+ years building scalable cloud infrastructure and enterprise applications. SME in Oracle Cloud Infrastructure with strong experience in Python, Java, and DevOps tooling (AWS, Kubernetes, Jenkins). I lead cross-team initiatives, mentor engineers, and deliver high-impact systems that improve resilience, performance, and customer adoption.
              </p>
              <div className="mt-3">
                <a className="btn btn-sm btn-warning" href={resumeHref} download target="_blank" rel="noopener noreferrer">
                  Download Latest Resume
                </a>
              </div>
            </div>
            <div className="row">
              <div className="image col-lg-4 d-flex align-items-stretch justify-content-center justify-content-lg-start"></div>
              <div className="col-lg-8 d-flex flex-column align-items-stretch">
                <div className="content ps-lg-4 d-flex flex-column justify-content-center">
                  <div className="row">
                    <div className="col-lg-6">
                      <ul>
                        <li>
                          <i className="bi bi-chevron-right"></i> <strong>Name:</strong>{' '}
                          <span>Siddharth Choudhary</span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul>
                        <li>
                          <i className="bi bi-chevron-right"></i> <strong>Highest Degree:</strong>{' '}
                          <span>Masters in Computer Science from Stevens Institute of Technology</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="row mt-n4">
                    <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                      <div className="count-box">
                        <i className="bi bi-file-earmark-code" style={{ color: '#20b38e' }}></i>{' '}
                        <span data-purecounter-start="0" data-purecounter-end="39" data-purecounter-duration="1" className="purecounter"></span>
                        <p>
                          <strong>Projects</strong> I have been involved professionally, personally and some freelanced projects.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                      <div className="count-box">
                        <i className="bi bi-clock" style={{ color: '#2cbdee' }}></i>{' '}
                        <span data-purecounter-start="0" data-purecounter-end="7" data-purecounter-duration="1" className="purecounter"></span>
                        <p>
                          <strong>Years of experience.</strong> Worked in the USA professionally, not including internships
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="skills-content ps-lg-4">
                    <div>
                      <h3>Expertise</h3>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        AWS Cloud Services <i className="val">100%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Google cloud services <i className="val">80%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Oracle cloud services <i className="val">100%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Terraform<i className="val">100%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Python <i className="val">90%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Node js/ES6+ <i className="val">85%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Java<i className="val">80%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        React Js <i className="val">90%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Kotlin,Java, Swift UI, React Native (Mobile development)
                        <i className="val">85%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Typescript <i className="val">90%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Git/Docker/Kubernetes/Jenkins <i className="val">100%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        Data cleaning and Data Science <i className="val">60%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        HTML/CSS/Jquery/SPA <i className="val">100%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="progress">
                      <span className="skill">
                        MongoDb, MySQL <i className="val">90%</i>
                      </span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="resume" className="resume">
          <div className="container">
            <div className="section-title">
              <span>My Resume</span>
              <h2>My Resume</h2>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <h3 className="resume-title">Summary</h3>
                <div className="resume-item pb-0">
                  <h4>Siddharth Choudhary</h4>
                  <p>
                    <em>
                      Senior Software Engineer with 7+ years of experience building scalable cloud infrastructure and enterprise applications. Proven SME in Oracle Cloud Infrastructure with expertise in Python, Java, and DevOps tooling (AWS, Kubernetes, Jenkins). Strong track record of leading cross-team initiatives, mentoring peers, and delivering high-impact systems.
                    </em>
                  </p>
                  <p></p>
                  <p></p>
                </div>
                <h3 className="resume-title">Education</h3>
                <div className="resume-item">
                  <h4>Masters in Computer Science</h4>
                  <h5>Aug 2018 - May 2020</h5>
                  <p>
                    <em>Stevens Institute of Technology, Hoboken, NJ</em>
                  </p>
                  <p>
                    Graduated with a 3.8 GPA. Key coursework: NLP, Advanced Programming in the Unix Env., Distributed Systems, Advanced Algorithms.
                  </p>
                </div>
                <div className="resume-item">
                  <h4>Bachelor of Information Technology</h4>
                  <h5>2013 - 2017</h5>
                  <p>
                    <em>Rajasthan Technical University, Bhilwara, Rajasthan, India</em>
                  </p>
                  <p>
                    Graduated with 75 percentile. Coursework included: Networking, Principles of Programming Language, Data Structures & Algorithms, Computer Networks
                  </p>
                </div>
                <h3 className="resume-title">Internships</h3>
                <div className="resume-item">
                  <h4>ADP</h4>
                  <h5>May 2019 - July 2019</h5>
                  <p>
                    <em>Global Product &amp; Technology Intern, Roseland, NJ</em>
                  </p>
                  <p>Interned at ADP with the Devops team where deployed health checks services via Jenkins and React js</p>
                </div>
                <div className="resume-item">
                  <h4>Quest Lab, Stevens Institute of Technology</h4>
                  <h5>Sep 2018 - May 2019</h5>
                  <p>
                    <em>Graduate Research Assistant, Hoboken, NJ</em>
                  </p>
                  <p>
                    Worked as a Research Assistant, where I was able to work on multiple projects, related to low level socket programming in Python, building apps in React Native, and docker, Kubernetes in GCP
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <h3 className="resume-title">Professional Experience</h3>
                <div className="resume-item">
                  <h4>Oracle Cloud Infrastructure</h4>
                  <h5>Sep 2024 - Present</h5>
                  <p>
                    <em>Senior Software Engineer, Nashville, TN</em>
                  </p>
                  <ul>
                    <li>Mentored 4 junior engineers across teams, reducing production issue resolution time by 30% and improving stability.</li>
                    <li>Built an OCI AI Agent prototype to scan historical Jira tickets and suggest workarounds or SMEs for faster resolution.</li>
                    <li>Led 3 FusionApps projects from design to deployment, boosting customer engagement by 20% via enhanced user features.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>Oracle</h4>
                  <h5>Jan 2022 - Sep 2024</h5>
                  <p>
                    <em>Software Developer 2, Nashville, TN</em>
                  </p>
                  <ul>
                    <li>Deploying infrastructure using Terraform in OCI to increase the migration capacity from the older Gen infrastructure.</li>
                    <li>Collaborated with other teams within Oracle, as a cross-team effort, to build and deploy Devops-UX using React-js, Node-js.</li>
                    <li>Providing on-call support, maintaining the fault tolerance and scaling out of our core features to the distributed servers within OCI.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>Nextiles</h4>
                  <h5>Jan 2021 - Jan 2022</h5>
                  <p>
                    <em>Lead Software Engineer, Brooklyn, NY</em>
                  </p>
                  <ul>
                    <li>Built cloud solutions and CI/CD pipelines for the entire backend in AWS environment (S3, DDB, Codepipeline).</li>
                    <li>Incorporated customer needs, attended client meetings and worked closely with their development teams to help with the integration with our SDK.</li>
                    <li>Built iOS and Android SDKs for BLE devices from scratch, using Kotlin and Swift UI and intgrated with AWS services.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>AWS</h4>
                  <h5>July 2020 - Jan 2021</h5>
                  <p>
                    <em>Software Development Engineer, Portland, OR</em>
                  </p>
                  <ul>
                    <li>Integrated our services with the Tagging team at AWS to provide tagging features to the resources.</li>
                    <li>Built Infrastructure pipeline for product API layers, control flow layers, and end to end integration tests for the service.</li>
                    <li>Worked on multiple projects and reviewed the system design changes in a very new service launch of AWS.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>ADP</h4>
                  <h5>Feb 2020 - July 2020</h5>
                  <p>
                    <em>Associate Application Developer, Roseland, NJ</em>
                  </p>
                  <ul>
                    <li>Powered CEH product by building integral modules, automated testing using Expressjs/GraphQL backend &amp; React front-end.</li>
                    <li>Built several UI modules, which utilize MongoDB database and contributed to a microservices based architecture.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>Samy Web Technologies</h4>
                  <h5>Jan 2018 - July 2018</h5>
                  <p>
                    <em>Full Stack Developer, Bhilwara, Rajasthan, India</em>
                  </p>
                  <ul>
                    <li>Created the Checkout flow, Add to cart, Payment modules (using Paypal integration) for the Scubaya project.</li>
                    <li>Reduced the extra consuming time as compared to a regular search by implementing an optimized indexing search.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>ReadyBytes Software Labs</h4>
                  <h5>Jan 2017 - Jan 2018</h5>
                  <p>
                    <em>Full Stack Developer, Bhilwara, Rajasthan, India</em>
                  </p>
                  <ul>
                    <li>Contributed and maintained CMS software solutions to handle the back end of an e-service platform.</li>
                    <li>Introduced new cloud services for more user interaction which increased the overall sales by nearly 30%.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="portfolio">
          <div className="container">
            <div className="section-title">
              <span>My Portfolio</span>
              <h2>My Portfolio</h2>
            </div>
            <ul id="portfolio-flters" className="d-flex justify-content-center">
              <li data-filter="*" className="filter-active">
                All
              </li>
              <li data-filter=".filter-web">Websites</li>
              <li data-filter=".filter-professional">Professional</li>
              <li data-filter=".filter-blog">Blogs</li>
            </ul>

            <div className="row portfolio-container">
              <div className="col-lg-4 col-md-6 portfolio-item filter-blog">
                <div className="portfolio-img">
                  <img src="/img/portfolio/entrepreneurship.jpeg" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>Blog</h4>
                  <p>My very first blog</p>
                  <a href="/img/portfolio/entrepreneurship.jpeg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 1">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://www.linkedin.com/pulse/doubt-entrepreneurs-acute-acumen-siddharth-choudhary" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-img">
                  <img src="/img/portfolio/quest_web.png" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>Quest Website</h4>
                  <p>QUEST website which I built and deployed on GCP Kubernetes</p>
                  <a href="/img/portfolio/quest_web.png" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 3">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="http://www.questlab.us/" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-professional">
                <div className="portfolio-img">
                  <img src="/img/portfolio/aws_logo.jpeg" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>AWS</h4>
                  <p>
                    Cannot share what I have worked on professionally but can always attach a link to my work, right? :)
                  </p>
                  <a href="/img/portfolio/aws_logo.jpeg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 2">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://aws.amazon.com/blogs/aws/amazon-route-53-application-recovery-controller/" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-professional">
                <div className="portfolio-img">
                  <img src="/img/portfolio/epotli_logo.png" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>Epotli</h4>
                  <p>My first project, I worked on professionally</p>
                  <a href="/img/portfolio/epotli_logo.png" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 2">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://play.google.com/store/apps/details?id=net.readybytes.onlineshopping.epotli&hl=en_US&gl=US&pli=1" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-img">
                  <img src="/img/portfolio/GitHub-logo.png" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>Github Repository</h4>
                  <p>A link to the github repository should not be missed!</p>
                  <a href="/img/portfolio/GitHub-logo.png" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 2">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://github.com/SiddharthChoudhary?tab=repositories" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-professional">
                <div className="portfolio-img">
                  <img src="/img/portfolio/nextiles_logo.png" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>Nextiles SDK</h4>
                  <p>
                    I built the entire the iOS SDK by myself, and laid the foundation of Software Engineering for this startup, so here is the public link to that.
                  </p>
                  <a href="/img/portfolio/nextiles_logo.png" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 1">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://github.com/nextiles-org/documentation-deprecated" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-professional">
                <div className="portfolio-img">
                  <img src="/img/portfolio/oci-new-logo-scaled.jpeg" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>OCI</h4>
                  <p>Here is a link to my current OCI team and the work I am involved in.</p>
                  <a href="/img/portfolio/oci-new-logo-scaled.jpeg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 3">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="https://www.oracle.com/applications/cloud-apps-on-oci/" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-img">
                  <img src="/img/portfolio/qrng.png" className="img-fluid" alt="" />
                </div>
                <div className="portfolio-info">
                  <h4>QRNG</h4>
                  <p>
                    Built this app and the backend of it as well. Later deployed it in the GCP. Unfortunately don't have the link to the play store app. Looks like they took it off.
                  </p>
                  <a href="/img/portfolio/qrng.png" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 3">
                    <i className="bx bx-plus"></i>
                  </a>{' '}
                  <a href="#" className="details-link" title="More Details">
                    <i className="bx bx-link"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <div className="section-title">
              <span>Contact Me</span>
              <h2>Contact Me</h2>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="info-box">
                      <i className="bx bx-share-alt"></i>
                      <h3>Social Profiles</h3>
                      <div className="social-links">
                        <a href="https://github.com/SiddharthChoudhary" className="github">
                          <i className="bi bi-github"></i>
                        </a>{' '}
                        <a href="https://www.linkedin.com/in/siddharth-choudhary-440102b8/" className="linkedin">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box mt-4">
                      <i className="bx bx-envelope"></i>
                      <h3>Email Me</h3>
                      <p>Please reach out via linkedIn</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box mt-4">
                      <i className="bx bx-phone-call"></i>
                      <h3>Contact</h3>
                      <p>Please use the form here</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <form action="https://formspree.io/f/mgebevoy" method="post" role="form" className="php-email-form">
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input name="name" className="form-control" id="name" placeholder="Your Name" required />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                      <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    <input className="form-control" name="subject" id="subject" placeholder="Subject" required />
                  </div>
                  <div className="form-group mt-3">
                    <textarea className="form-control" name="message" rows="6" placeholder="Message" required></textarea>
                  </div>
                  <div className="my-3">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Your message has been sent. Thank you!</div>
                  </div>
                  <div className="text-center">
                    <button type="submit">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong>
              <span>Siddharth Choudhary</span>
            </strong>
            . All Rights Reserved
          </div>
        </div>
      </footer>

      <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  )
}

export default App
