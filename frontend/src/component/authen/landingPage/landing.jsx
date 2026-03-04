import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, ShieldCheck, PieChart, Zap, ArrowRight, 
  Globe, Lock, Mail, Phone, MessageSquare, Send ,Star,
} from "lucide-react";
import "./landing.css";
import heroImage from "../../../assets/bg.jpg";
import dashboardImage from "../../../assets/money2.jpg";
import { testimonialData, contactDetails,footerLinks } from "../../../assets/assets";

const LandingPage = () => {
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animateOnScroll').forEach(el => observer.observe(el));
  }, []);
   const currentYear = new Date().getFullYear();
  
  const renderStars = (count) => {
  return [...Array(5)].map((_, i) => (
    <Star 
      key={i} 
      size={14} 
      fill={i < count ? "#FFD700" : "none"} 
      stroke={i < count ? "#FFD700" : "#cbd5e1"} 
      strokeWidth={2}
    />
  ));
 
};
  return (
    <div className="landingRoot">
      <nav className="navbar">
        <h2 className="logo">
          <Zap className="brandIcon" fill="#4f46e5" size={24} />
          FinGuard
        </h2>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#overview">Overview</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </nav>

<section className="modernHero">
  <div className="heroBgImage" style={{ backgroundImage: `url(${heroImage})` }}></div>
  
  <div className="heroOverlay">
    <div className="glassContentCard animateOnScroll">
      <div className="promoBadge">
        <span className="sparkleIcon">✨</span> 
        Trusted by 50,000+ Visionaries
      </div>      
      <h1>Take Control of Your <span className="gradientText">Money</span> <br />
        Build Your Future in FCFA</h1>    
      <p>
        The premium vault for tracking expenses and mastering your budget. 
        Secure, simple, and built for the modern African lifestyle.
      </p>

      <div className="heroActionGroup">
        <Link to="/signup" className="btnPulse">Start Your Journey <ArrowRight size={20} /></Link>
        <a href="#overview" className="btnGlass"> View Demo UI </a>
      </div>

      <div className="heroFooterTags">
        <div className="tag"><ShieldCheck size={16} /> AES-256 Encryption</div>
        <div className="tag"><Zap size={16} /> Instant Sync</div>
      </div>
    </div>
  </div>
</section>

      <section className="overviewSection" id="overview">
        <div className="sectionHeaderCentred animateOnScroll">
          <h2>Everything in <span>One Place</span></h2>
          <p className="mainSubtitle">
            Managing your FCFA shouldn't be a full-time job. 
            FinGuard simplifies your financial life so you can focus on building your legacy.
          </p>
        </div>

        <div className="overviewContainer">
          <div className="overviewVisual animateOnScroll">
            <div className="dashboardFrame">
              <img src={dashboardImage} alt="FinGuard Dashboard" className="previewImg" />
              <div className="floatingCard statusCard">
                <div className="pulseDot"></div> <span>Live System Active</span>
              </div>
            </div>
          </div>
          {/* ---------------text section---------------     */}
          <div className="overviewText animateOnScroll">
            <div className="introContext">
              <h3>Command Your Cashflow</h3>
              <p>
                Our interface is built for speed. Whether you are on the go or 
                planning your month at home, get the clarity you need in seconds.
              </p>
            </div>

            <ul className="benefitList">
              <li>
                <div className="checkIcon"><ShieldCheck size={18} /></div>
                <div>
                  <h4>Secure FCFA Tracking</h4>
                  <p>Encrypted logging for every transaction.</p>
                </div>
              </li>
              <li>
                <div className="checkIcon"><ShieldCheck size={18} /></div>
                <div>
                  <h4>Instant Balance Sync</h4>
                  <p>Your actual wealth, updated in real-time.</p>
                </div>
              </li>
              <li>
                <div className="checkIcon"><ShieldCheck size={18} /></div>
                <div>
                  <h4>Visual Spend History</h4>
                  <p>Clear transaction breakdowns to help you see where your money goes.</p>
                </div>
              </li>
            </ul>

            <Link to="/signup" className="btnLink">
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

{/* --- SECTION 3: FEATURES GRID --- */}
      <section className="featuresGrid" id="features">
        <div className="sectionHeaderCentred animateOnScroll">
          <div className="miniBadge">💎 Core Features</div>
          <h2>Built for the <span>Next Generation</span></h2>
          <p className="mainSubtitle">
            FinGuard isn't just a spreadsheet. It's a high-performance system 
            engineered to give you a competitive edge in your financial life.
          </p>
        </div>

        <div className="cardContainer">
          {/* Card 1: Visual Analytics */}
          <div className="featCard animateOnScroll">
            <div className="cardHeader">
              <div className="iconBox purple"><PieChart size={22} /></div>
              <h3>Visual Analytics</h3>
            </div>
            <p className="cardDescription">
              Stop squinting at rows of numbers. Our system transforms your raw spending data 
              into high-definition charts, giving you an instant visual narrative of your 
              financial health and habits.
            </p>
          </div>

          {/* Card 2: FCFA Native */}
          <div className="featCard animateOnScroll">
            <div className="cardHeader">
              <div className="iconBox green"><Globe size={22} /></div>
              <h3>FCFA Native</h3>
            </div>
            <p className="cardDescription">
              Engineered specifically for the CEMAC region. We handle the unique precision 
              of the Franc CFA, ensuring every calculation respects local financial logic 
              without the errors of dollar-based apps.
            </p>
          </div>

          {/* Card 3: Privacy First */}
          <div className="featCard animateOnScroll">
            <div className="cardHeader">
              <div className="iconBox blue"><Lock size={22} /></div>
              <h3>Privacy First</h3>
            </div>
            <p className="cardDescription">
              Your financial data is your most sensitive asset. We deploy bank-grade 
              encryption protocols so that your vault remains strictly confidential, 
              visible only to the person holding the key—you.
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="testimonialSection" id="testimonials">
        <div className="sectionHeaderCentred animateOnScroll">
          <div className="miniBadge">💬 Social Proof</div>
          <h2>Trusted by <span>Visionaries</span></h2>
          <p className="mainSubtitle">
            Join thousands of ambitious individuals who have already 
            secured their financial future with the FinGuard Vault.
          </p>
        </div>

       <div className="testimonialGrid animateOnScroll">
  {testimonialData.map((item) => (
    <div className="testCard" key={item.id}>
      <div className="testHeader">
        
        {/* PROFILE PICTURE OR INITIALS FALLBACK */}
        <div className={`userAvatar ${item.theme}`}>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="avatarImg" 
              onError={(e) => { e.target.style.display = 'none'; }} // Extra safety
            />
          ) : (
            <span className="avatarInitials">{item.initials}</span>
          )}
        </div>

        <div className="userInfo">
          <h4>{item.name}</h4>
          <div className="starRow">
            {renderStars(item.rating)}
          </div>
        </div>
      </div>
      <p className="testBody">{item.body}</p>
    </div>
  ))}
</div>
      </section>

<section className="contactSection" id="contact">
        <div className="sectionHeaderCentred animateOnScroll">
          <div className="miniBadge">📩 Contact Us</div>
          <h2>Get in <span>Touch</span></h2>
          <p className="mainSubtitle">Have questions about your vault? Our team is here to help you secure your future.</p>
        </div>

        <div className="contactGrid animateOnScroll">
          {/* LEFT SIDE: Direct Details */}
          <div className="contactInfoSide">
            <h3>Contact Information</h3>
            <p>Fill out the form or reach out via our official channels.</p>
            
            <div className="infoItemsList">
              {contactDetails.map((info) => (
                <div className="infoItem" key={info.id}>
                  <div className="infoIcon" style={{ backgroundColor: `${info.color}15`, color: info.color }}>
                    <info.icon size={20} />
                  </div>
                  <div className="infoText">
                    <span>{info.label}</span>
                    <h4>{info.value}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="contactFormWrapper">
            <form className="modernForm">
              <div className="inputGroup">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="inputGroup">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="inputGroup">
                <textarea placeholder="How can we help you?" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-primary-huge">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

     <footer className="mainFooter">
        <div className="footerTop">
          <div className="footerBrandSide">
            <div className="footerLogo">
              <Zap fill="#4f46e5" color="#4f46e5" size={24} />
              <span>FinGuard</span>
            </div>
            <p className="brandTagline">
              Empowering the next generation of Africans to master their FCFA 
              and build lasting financial security.
            </p>
          </div>

          <div className="footerLinkGrid">
            <div className="linkColumn">
              <h4>Product</h4>
              {footerLinks.product.map((link, i) => (
                <a key={i} href={link.href}>{link.name}</a>
              ))}
            </div>
            <div className="linkColumn">
              <h4>Legal</h4>
              {footerLinks.company.map((link, i) => (
                <a key={i} href={link.href}>{link.name}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <p>© {currentYear} FinGuard Africa. All rights reserved.</p>
          {/* <div className="socialIcons">
            <Twitter size={20} />
            <Github size={20} />
            <Linkedin size={20} />
          </div> */}
        </div>
      </footer>
    </div>
  );
};

// Helper Icon (Optional based on Lucide imports)
const CheckCircle2 = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default LandingPage;