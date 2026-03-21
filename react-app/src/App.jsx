import { useEffect, useMemo, useState } from 'react'
import BlogSlider from './components/BlogSlider'

const metrics = [
  { label: 'Years Building', value: '7+' },
  { label: 'Cloud Platforms', value: '3' },
  { label: 'Production Projects', value: '39+' },
  { label: 'Teams Mentored', value: '4' },
]

const stack = [
  'OCI',
  'AWS',
  'Kubernetes',
  'Terraform',
  'React',
  'TypeScript',
  'Python',
  'Java',
  'Jenkins',
  'GraphQL',
]

const filters = ['All', 'AI', 'Cloud', 'Mobile']

const projects = [
  {
    title: 'Fusion Apps AI Workflow Automation',
    tag: 'AI Agents + Developer Productivity',
    category: 'AI',
    summary:
      'Designed AI agent workflows for Fusion Apps that translate natural-language chat requests into validated CLI operations, reducing manual command execution and improving operational consistency.',
    impact: 'Accelerated workflow execution with safer, more intuitive developer interactions',
  },
  {
    title: 'FusionApps Cloud Migration',
    tag: 'Cloud Infrastructure',
    category: 'Cloud',
    summary:
      'Led and shipped multiple FusionApps migration initiatives with Terraform-driven infrastructure and resilient deployment patterns.',
    impact: 'Improved migration velocity and customer adoption',
  },
  {
    title: 'Mobile SDK Platform at Nextiles',
    tag: 'Mobile + IoT',
    category: 'Mobile',
    summary:
      'Designed and shipped iOS/Android SDK foundations in Swift and Kotlin for BLE-enabled sports wearables integrated with AWS.',
    impact: 'Unlocked partner integrations and product growth',
  },
]

const experiences = [
  {
    company: 'Oracle',
    role: 'Senior Software Engineer',
    period: 'Sep 2024 - Present',
    highlights: [
      'Led Fusion Apps initiatives from design through production rollout to improve customer adoption and usability.',
      'Mentored junior engineers and improved operational reliability through better incident response and ownership.',
      'Drove AI-agent based workflow automation so teams can trigger validated CLI workflows through natural language chat.',
    ],
  },
  {
    company: 'Oracle',
    role: 'Software Developer 2',
    period: 'Jan 2022 - Sep 2024',
    highlights: [
      'Built and deployed Terraform-based infrastructure in OCI to improve migration capacity and scalability.',
      'Partnered across teams to deliver DevOps UX enhancements with React and Node.js for internal platform users.',
      'Provided on-call support and resiliency improvements for distributed production services.',
    ],
  },
  {
    company: 'Nextiles',
    role: 'Lead Software Engineer',
    period: 'Jan 2021 - Jan 2022',
    highlights: [
      'Built mobile SDK foundations in Swift and Kotlin for BLE-enabled products integrated with AWS services.',
      'Established engineering processes and CI/CD practices for faster and more reliable delivery.',
    ],
  },
  {
    company: 'AWS',
    role: 'Software Development Engineer',
    period: 'Jul 2020 - Jan 2021',
    highlights: [
      'Contributed to service integrations and API/platform reliability work for large-scale cloud systems.',
      'Built infrastructure pipelines and integration testing patterns for service launch readiness.',
    ],
  },
  {
    company: 'ADP',
    role: 'Associate Application Developer',
    period: 'Feb 2020 - Jul 2020',
    highlights: [
      'Delivered product modules and test automation across GraphQL/Express backends and React frontends.',
    ],
  },
  {
    company: 'Samy Web Technologies',
    role: 'Full Stack Developer',
    period: 'Jan 2018 - Jul 2018',
    highlights: [
      'Implemented checkout, cart, and payment modules including PayPal integration for production ecommerce flows.',
    ],
  },
  {
    company: 'ReadyBytes Software Labs',
    role: 'Full Stack Developer',
    period: 'Jan 2017 - Jan 2018',
    highlights: [
      'Contributed to CMS and cloud-backed platform features that improved user engagement and overall sales.',
    ],
  },
]

const keyHighlights = [
  'AI-agent powered chat-to-CLI automation for Fusion Apps workflows with validation and execution guardrails.',
  'Full-stack cloud engineering across OCI and AWS with strong Terraform, Kubernetes, and CI/CD foundations.',
  'Cross-team technical leadership, mentoring, and ownership for high-impact product and platform initiatives.',
]

const education = [
  {
    degree: 'Masters in Computer Science',
    school: 'Stevens Institute of Technology, Hoboken, NJ',
    period: 'Aug 2018 - May 2020',
    detail:
      'Graduated with 3.8 GPA. Coursework: NLP, Distributed Systems, Advanced Algorithms, Advanced Programming in Unix.',
  },
  {
    degree: 'Bachelor of Information Technology',
    school: 'Rajasthan Technical University, Bhilwara, India',
    period: '2013 - 2017',
    detail:
      'Coursework: Networking, Data Structures and Algorithms, Computer Networks, Principles of Programming Languages.',
  },
]

const portfolioItems = [
  {
    title: 'OCI Team Work',
    kind: 'Professional',
    image: '/img/portfolio/oci-new-logo-scaled.jpeg',
    href: 'https://www.oracle.com/applications/cloud-apps-on-oci/',
    summary: 'Current Oracle team focus and shipped platform outcomes.',
  },
  {
    title: 'AWS Work',
    kind: 'Professional',
    image: '/img/portfolio/aws_logo.jpeg',
    href: 'https://aws.amazon.com/blogs/aws/amazon-route-53-application-recovery-controller/',
    summary: 'Public-facing reference to work in cloud infrastructure.',
  },
  {
    title: 'Nextiles SDK',
    kind: 'Professional',
    image: '/img/portfolio/nextiles_logo.png',
    href: 'https://github.com/nextiles-org/documentation-deprecated',
    summary: 'Foundation work for SDK and engineering standards.',
  },
  {
    title: 'Epotli',
    kind: 'Professional',
    image: '/img/portfolio/epotli_logo.png',
    href: 'https://play.google.com/store/apps/details?id=net.readybytes.onlineshopping.epotli&hl=en_US&gl=US&pli=1',
    summary: 'One of my first professional projects.',
  },
  {
    title: 'Quest Website',
    kind: 'Website',
    image: '/img/portfolio/quest_web.png',
    href: 'http://www.questlab.us/',
    summary: 'QUEST website built and deployed on GCP Kubernetes.',
  },
  {
    title: 'GitHub Repositories',
    kind: 'Personal',
    image: '/img/portfolio/GitHub-logo.png',
    href: 'https://github.com/SiddharthChoudhary?tab=repositories',
    summary: 'Open source and personal projects.',
  },
  {
    title: 'QRNG App',
    kind: 'Website',
    image: '/img/portfolio/qrng.png',
    href: '#',
    summary: 'App and backend built and deployed in GCP.',
  },
]

const getInitialTheme = () => {
  const storedTheme = window.localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const resumeHref = import.meta.env.BASE_URL + 'pdf/Siddharth_Choudhary_Resume.pdf'
  const [theme, setTheme] = useState(getInitialTheme)
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const sections = ['top', 'about', 'work', 'blogs', 'resume', 'portfolio', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0.05 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('.scroll-highlight'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('in-view', entry.isIntersecting)
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [activeFilter])

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All') return projects
    return projects.filter((project) => project.category === activeFilter)
  }, [activeFilter])

  return (
    <div className={'app-shell theme-' + theme}>
      <div className="ambient ambient-one" aria-hidden="true"></div>
      <div className="ambient ambient-two" aria-hidden="true"></div>
      <div className="grid-overlay" aria-hidden="true"></div>

      <header className="site-header reveal delay-1">
        <a href="#top" className="brand">
          SC
        </a>
        <nav className="top-nav">
          <a href="#about" className={activeSection === 'about' ? 'active' : ''}>
            About
          </a>
          <a href="#work" className={activeSection === 'work' ? 'active' : ''}>
            Work
          </a>
          <a href="#blogs" className={activeSection === 'blogs' ? 'active' : ''}>
            Blogs
          </a>
          <a href="#resume" className={activeSection === 'resume' ? 'active' : ''}>
            Experience
          </a>
          <a href="#portfolio" className={activeSection === 'portfolio' ? 'active' : ''}>
            Portfolio
          </a>
          <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>
            Contact
          </a>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main id="top">
        <section className="hero panel reveal delay-2">
          <p className="eyebrow">Senior Software Engineer</p>
          <h1>
            Building resilient platforms,
            <span> intelligent automation, and high-scale cloud products.</span>
          </h1>
          <p className="hero-copy">
            I am Siddharth Choudhary, a senior software engineer focused on distributed systems,
            cloud operations, and product-minded engineering leadership.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={resumeHref} download target="_blank" rel="noreferrer">
              Download Resume
            </a>
            <a className="btn btn-ghost" href="#work">
              View Projects
            </a>
          </div>
        </section>

        <section id="about" className="stats section-space reveal delay-3">
          {metrics.map((item) => (
            <article key={item.label} className="stat-card panel scroll-highlight">
              <p className="stat-value">{item.value}</p>
              <p className="stat-label">{item.label}</p>
            </article>
          ))}
        </section>

        <section id="work" className="section-space two-col">
          <article className="panel about-card reveal delay-4 scroll-highlight">
            <h2>Tech Focus</h2>
            <p>
              I enjoy bridging product priorities with strong engineering fundamentals: fault tolerance,
              observability, secure delivery pipelines, and practical AI integrations that help teams move
              faster with confidence.
            </p>
            <div className="stack-wrap">
              {stack.map((tool) => (
                <span key={tool} className="chip">
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="panel terminal-card reveal delay-4 scroll-highlight" aria-label="terminal snapshot">
            <p className="terminal-title">terminal://career-highlights.log</p>
            <pre>
              <code>
                {'> uptime: 7+ years in production engineering\n> specialty: OCI / AWS / distributed systems\n> current_mode: senior_ic + team_mentor\n> status: shipping impact continuously'}
              </code>
            </pre>
          </article>
        </section>

        <section className="section-space reveal delay-5">
          <h2 className="section-title">Career Highlights</h2>
          <div className="highlight-grid">
            {keyHighlights.map((item) => (
              <article key={item} className="panel highlight-card scroll-highlight">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-space reveal delay-5">
          <h2 className="section-title">Selected Projects</h2>
          <div className="filter-row" role="tablist" aria-label="Project categories">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={'filter-pill ' + (activeFilter === filter ? 'active' : '')}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="project-grid" key={activeFilter}>
            {visibleProjects.map((project) => (
              <article key={project.title} className="panel project-card scroll-highlight">
                <p className="project-tag">{project.tag}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="impact">Impact: {project.impact}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="blogs" className="section-space reveal delay-7">
          <h2 className="section-title">Blogs</h2>
          <div className="panel blogs-wrap">
            <BlogSlider />
          </div>
        </section>

        <section id="resume" className="section-space reveal delay-8">
          <h2 className="section-title">Experience and Education</h2>
          <div className="resume-grid">
            <div className="resume-column">
              <h3 className="resume-heading">Experience</h3>
              <div className="timeline">
                {experiences.map((item) => (
                  <article key={item.company + item.period} className="timeline-item panel scroll-highlight">
                    <p className="period">{item.period}</p>
                    <h3>{item.company}</h3>
                    <p>{item.role}</p>
                    {item.highlights && (
                      <ul className="timeline-points">
                        {item.highlights.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <div className="resume-column">
              <h3 className="resume-heading">Education</h3>
              <div className="timeline">
                {education.map((item) => (
                  <article key={item.degree} className="timeline-item panel scroll-highlight">
                    <p className="period">{item.period}</p>
                    <h3>{item.degree}</h3>
                    <p>{item.school}</p>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div id="portfolio" className="section-space">
            <h3 className="resume-heading">Portfolio</h3>
            <div className="portfolio-grid">
              {portfolioItems.map((item) => (
                <article key={item.title} className="panel portfolio-card scroll-highlight">
                  <img src={item.image} alt={item.title} />
                  <div className="portfolio-card-body">
                    <p className="project-tag">{item.kind}</p>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <a
                      href={item.href}
                      target={item.href === '#' ? undefined : '_blank'}
                      rel={item.href === '#' ? undefined : 'noreferrer'}
                      className="portfolio-link"
                    >
                      Open Link
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="panel contact section-space reveal delay-9">
          <h2>Let&apos;s Build Something Useful</h2>
          <p>
            Open to senior engineering opportunities, architecture collaborations, and platform reliability
            consulting.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href="https://www.linkedin.com/in/siddharth-choudhary-440102b8/"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn
            </a>
            <a
              className="btn btn-ghost"
              href="https://github.com/SiddharthChoudhary"
              target="_blank"
              rel="noreferrer"
            >
              Explore GitHub
            </a>
            <a
              className="btn btn-ghost"
              href="https://leetcode.com/u/NoobieStillLearning/"
              target="_blank"
              rel="noreferrer"
            >
              LeetCode
            </a>
            <a
              className="btn btn-ghost"
              href="https://stackoverflow.com/users/5972784/siddharth-choudhary"
              target="_blank"
              rel="noreferrer"
            >
              Stack Overflow
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
