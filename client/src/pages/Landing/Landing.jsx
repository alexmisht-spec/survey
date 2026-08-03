import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./LandingPage.css";

export default function LandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    // SEO: Update document title & meta on mount
    useEffect(() => {
        document.title = "SurveyHub Kenya | Paid Online Surveys & Tasks — Earn Money via M-Pesa";

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = "Join SurveyHub Kenya and earn real money doing paid online surveys and simple tasks. Withdraw instantly to M-Pesa. Trusted by 10,000+ Kenyans. Sign up free.";
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = "Join SurveyHub Kenya and earn real money doing paid online surveys and simple tasks. Withdraw instantly to M-Pesa. Trusted by 10,000+ Kenyans. Sign up free.";
            document.head.appendChild(meta);
        }

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = "https://surveyhub.co.ke/";
    }, []);

    const faqs = [
        {
            q: "How do I earn money with online surveys in Kenya?",
            a: "Sign up on SurveyHub, complete your profile, and start taking paid surveys matched to your demographics. Each survey pays between KSh 50 and KSh 500, and your earnings are sent directly to your M-Pesa number.",
        },
        {
            q: "Is SurveyHub a legitimate online job platform in Kenya?",
            a: "Yes. SurveyHub is a registered Kenyan platform connecting local residents with genuine market research companies. We have paid out over KSh 50 million to more than 10,000 active earners across Nairobi, Mombasa, Nakuru, and beyond.",
        },
        {
            q: "What is the minimum withdrawal amount?",
            a: "You can withdraw as little as KSh 100. There are no hidden fees or transaction charges — what you earn is exactly what you receive on M-Pesa.",
        },
        {
            q: "Do I need to pay anything to join?",
            a: "Never. SurveyHub is 100% free to join. If anyone asks you for money to access surveys or tasks, it is a scam. We will never ask for registration fees.",
        },
        {
            q: "How long does KYC verification take?",
            a: "Identity verification typically takes less than 24 hours. You will need a valid Kenyan National ID and a KRA PIN certificate. Once approved, you get full access to high-paying surveys.",
        },
        {
            q: "Who can join and do these online tasks?",
            a: "Any Kenyan resident aged 18 and above with a valid National ID and an active M-Pesa line. Whether you are a student looking for part-time online jobs, a stay-at-home parent, or anyone with spare time, you can earn.",
        },
    ];

    const toggleFaq = (i) => {
        setOpenFaq(openFaq === i ? null : i);
    };

    // JSON-LD Structured Data
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SurveyHub Kenya",
        url: "https://surveyhub.co.ke",
        logo: "https://surveyhub.co.ke/logo.png",
        sameAs: [
            "https://twitter.com/surveyhubke",
            "https://facebook.com/surveyhubke",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+254-712-345-678",
            contactType: "Customer Support",
            areaServed: "KE",
            availableLanguage: ["English", "Swahili"],
        },
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SurveyHub Kenya",
        url: "https://surveyhub.co.ke",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://surveyhub.co.ke/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
            },
        })),
    };

    return (
        <div className="landing-page">
            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>

            {/* ================= NAV ================= */}
            <header className="landing-nav" role="banner">
                <div className="nav-inner">
                    <Link to="/" className="nav-logo" aria-label="SurveyHub Kenya Home">
                        Survey<span>Pool</span>
                    </Link>

                    <nav className={`nav-links ${mobileOpen ? "open" : ""}`} role="navigation" aria-label="Main navigation">
                        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</a>
                        <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
                        <a href="#testimonials" onClick={() => setMobileOpen(false)}>Reviews</a>
                        <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
                        <Link to="/login" className="nav-cta">Get Started</Link>
                    </nav>

                    <button
                        className="nav-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </header>

            <main>
                {/* ================= HERO ================= */}
                <section className="hero" aria-labelledby="hero-heading">
                    <div className="hero-inner">
                        <div className="hero-content">
                            <span className="hero-tag">Trusted by 10,000+ Kenyans</span>
                            <h1 id="hero-heading">
                                Earn Real Money Doing
                                <br />
                                <span className="accent">Online Surveys & Tasks</span>
                                <br />
                                in Kenya
                            </h1>
                            <p>
                                Join the leading platform for <strong>paid online surveys and micro tasks in Kenya</strong>. 
                                Share your opinion with top brands, complete simple digital tasks, and get paid 
                                instantly via <strong>M-Pesa</strong>. No fees, no experience needed — just your phone and spare time.
                            </p>
                            <div className="hero-actions">
                                <Link to="/register" className="btn-primary">
                                    Start Earning Free
                                </Link>
                                <a href="#how-it-works" className="btn-ghost">
                                    See how it works
                                </a>
                            </div>
                            <div className="hero-trust">
                                <div className="trust-pills">
                                    <span>✓ Instant M-Pesa Payouts</span>
                                    <span>✓ KSh 50M+ Paid Out</span>
                                    <span>✓ 4.8★ Rating</span>
                                </div>
                            </div>
                        </div>

                        <aside className="hero-visual" aria-hidden="true">
                            <div className="phone-mockup">
                                <div className="phone-screen">
                                    <div className="mock-header">
                                        <div className="mock-dot" />
                                        <div className="mock-line short" />
                                    </div>
                                    <div className="mock-card">
                                        <div className="mock-icon" />
                                        <div className="mock-text">
                                            <div className="mock-line" />
                                            <div className="mock-line short" />
                                        </div>
                                        <div className="mock-amount">+KSh 250</div>
                                    </div>
                                    <div className="mock-card">
                                        <div className="mock-icon green" />
                                        <div className="mock-text">
                                            <div className="mock-line" />
                                            <div className="mock-line short" />
                                        </div>
                                        <div className="mock-amount">+KSh 180</div>
                                    </div>
                                    <div className="mock-card">
                                        <div className="mock-icon purple" />
                                        <div className="mock-text">
                                            <div className="mock-line" />
                                            <div className="mock-line short" />
                                        </div>
                                        <div className="mock-amount">+KSh 320</div>
                                    </div>
                                    <div className="mock-balance">
                                        <span>Available Balance</span>
                                        <strong>KSh 4,250</strong>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* ================= STATS BAR ================= */}
                <section className="stats-bar" aria-label="Platform statistics">
                    <div className="stats-inner">
                        <div className="stat-item">
                            <strong>50M+</strong>
                            <span>KSh Paid to Earners</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <strong>10,000+</strong>
                            <span>Active Online Workers</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <strong>200+</strong>
                            <span>Survey & Task Partners</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <strong>4.8</strong>
                            <span>User Rating</span>
                        </div>
                    </div>
                </section>

                {/* ================= HOW IT WORKS ================= */}
                <section className="how-section" id="how-it-works" aria-labelledby="how-heading">
                    <div className="section-inner">
                        <header className="section-header">
                            <span className="section-tag">Simple Process</span>
                            <h2 id="how-heading">How to Start Earning Money Online in Kenya</h2>
                            <p>
                                No complex setup. No waiting weeks. Just sign up, verify your identity, 
                                and start completing paid surveys and online tasks from your phone or computer.
                            </p>
                        </header>

                        <div className="steps-grid">
                            <article className="step-card">
                                <div className="step-num">01</div>
                                <h3>Create Your Free Account</h3>
                                <p>
                                    Register with your email and phone number in under 2 minutes. 
                                    No upfront payment or credit card required to access online jobs.
                                </p>
                            </article>
                            <div className="step-connector" />
                            <article className="step-card">
                                <div className="step-num">02</div>
                                <h3>Complete Quick KYC Verification</h3>
                                <p>
                                    Upload your National ID and KRA PIN for verification. 
                                    Our team approves most accounts within 24 hours so you can start earning fast.
                                </p>
                            </article>
                            <div className="step-connector" />
                            <article className="step-card">
                                <div className="step-num">03</div>
                                <h3>Take Surveys & Get Paid</h3>
                                <p>
                                    Browse available surveys and tasks, complete them at your own pace, 
                                    and withdraw your earnings instantly to M-Pesa — Kenya's most trusted mobile money service.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                {/* ================= FEATURES ================= */}
                <section className="features-section" id="features" aria-labelledby="features-heading">
                    <div className="section-inner">
                        <header className="section-header">
                            <span className="section-tag">Why SurveyHub</span>
                            <h2 id="features-heading">The Best Platform for Online Jobs & Paid Tasks in Kenya</h2>
                            <p>
                                We built SurveyHub specifically for the Kenyan market. 
                                Local payouts, local support, and real opportunities that fit your schedule.
                            </p>
                        </header>

                        <div className="features-grid">
                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
                                </div>
                                <h3>Instant M-Pesa Payouts</h3>
                                <p>
                                    Your survey earnings go straight to your phone. No bank accounts, 
                                    no lengthy waits, no paperwork. Request a withdrawal and receive your money in minutes.
                                </p>
                            </article>

                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <h3>Bank-Grade Security</h3>
                                <p>
                                    Your personal data and KYC documents are encrypted and never sold. 
                                    Verification is handled by trained agents who respect your privacy.
                                </p>
                            </article>

                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                </div>
                                <h3>Flexible Online Work</h3>
                                <p>
                                    Surveys and tasks are available 24/7. Complete them during your commute, 
                                    lunch break, or whenever you have free time. You control your schedule.
                                </p>
                            </article>

                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <h3>Real Research Partners</h3>
                                <p>
                                    We partner with universities, NGOs, and global brands who genuinely 
                                    need Kenyan consumer insights. Your opinion shapes real products and policies.
                                </p>
                            </article>

                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                                <h3>Transparent Earnings</h3>
                                <p>
                                    Every survey and task shows the exact reward before you start. 
                                    No surprises, no hidden deductions, no confusing point systems. What you see is what you earn.
                                </p>
                            </article>

                            <article className="feature-card">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <h3>Support in English & Swahili</h3>
                                <p>
                                    Our Kenyan support team speaks your language. Reach out anytime 
                                    via email or WhatsApp and get real help from real people based in Nairobi.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                {/* ================= TESTIMONIALS ================= */}
                <section className="testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
                    <div className="section-inner">
                        <header className="section-header">
                            <span className="section-tag">Real Stories</span>
                            <h2 id="testimonials-heading">Kenyans Earning Real Money from Online Surveys</h2>
                            <p>
                                From university students to business owners, people across Kenya are turning 
                                spare time into reliable income with remote survey jobs and digital tasks.
                            </p>
                        </header>

                        <div className="testimonials-grid">
                            <article className="testimonial-card">
                                <div className="testimonial-stars" aria-label="5 star rating">★★★★★</div>
                                <p>
                                    "I make about KSh 3,000 a week doing paid surveys between classes at UoN. 
                                    The M-Pesa payout is instant — no stories. This is the best online job for students in Kenya."
                                </p>
                                <footer className="testimonial-author">
                                    <div className="author-avatar">CW</div>
                                    <div>
                                        <strong>Charles W.</strong>
                                        <span>Student, Nairobi</span>
                                    </div>
                                </footer>
                            </article>

                            <article className="testimonial-card">
                                <div className="testimonial-stars" aria-label="5 star rating">★★★★★</div>
                                <p>
                                    "At first I thought online survey jobs were a scam, but I got my first KSh 500 
                                    within 2 days. Now it helps with groceries every month. Legit work from home opportunity."
                                </p>
                                <footer className="testimonial-author">
                                    <div className="author-avatar">AM</div>
                                    <div>
                                        <strong>Amina M.</strong>
                                        <span>Shop Owner, Mombasa</span>
                                    </div>
                                </footer>
                            </article>

                            <article className="testimonial-card">
                                <div className="testimonial-stars" aria-label="5 star rating">★★★★★</div>
                                <p>
                                    "The verification was quick and the surveys are actually interesting. 
                                    I have earned over KSh 12,000 in three months doing part-time online tasks. Highly recommend."
                                </p>
                                <footer className="testimonial-author">
                                    <div className="author-avatar">DK</div>
                                    <div>
                                        <strong>David K.</strong>
                                        <span>Teacher, Nakuru</span>
                                    </div>
                                </footer>
                            </article>
                        </div>
                    </div>
                </section>

                {/* ================= FAQ ================= */}
                <section className="faq-section" id="faq" aria-labelledby="faq-heading">
                    <div className="section-inner">
                        <header className="section-header">
                            <span className="section-tag">Questions</span>
                            <h2 id="faq-heading">Frequently Asked Questions About Online Surveys in Kenya</h2>
                            <p>
                                Everything you need to know before starting your first paid survey 
                                or online task on SurveyHub.
                            </p>
                        </header>

                        <div className="faq-list" role="list">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`faq-item ${openFaq === i ? "open" : ""}`}
                                    role="listitem"
                                >
                                    <button
                                        className="faq-question"
                                        onClick={() => toggleFaq(i)}
                                        aria-expanded={openFaq === i}
                                    >
                                        <span>{faq.q}</span>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p>{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= CTA ================= */}
                <section className="cta-section" aria-labelledby="cta-heading">
                    <div className="cta-inner">
                        <h2 id="cta-heading">Ready to Start Your Online Earning Journey?</h2>
                        <p>
                            Join thousands of Kenyans already making money from paid surveys and remote tasks. 
                            Registration is free and takes less than 2 minutes.
                        </p>
                        <Link to="/register" className="btn-primary large">
                            Create Free Account
                        </Link>
                        <span className="cta-note">No credit card required. No hidden fees. Cancel anytime.</span>
                    </div>
                </section>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="landing-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <h3>Survey<span>Hub</span></h3>
                        <p>
                            Kenya's trusted platform for paid online surveys, micro tasks, and remote work. 
                            Earn real money and withdraw instantly to M-Pesa.
                        </p>
                    </div>
                    <nav className="footer-links" aria-label="Footer navigation">
                        <div>
                            <h4>Platform</h4>
                            <a href="#how-it-works">How it Works</a>
                            <a href="#features">Features</a>
                            <a href="#faq">FAQ</a>
                            <Link to="/register">Sign Up Free</Link>
                        </div>
                        <div>
                            <h4>Legal</h4>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/cookies">Cookie Policy</Link>
                        </div>
                        <div>
                            <h4>Contact</h4>
                            <a href="mailto:hello@surveyhub.co.ke">hello@surveyhub.co.ke</a>
                            <span>WhatsApp: +254 712 345 678</span>
                            <span>Nairobi, Kenya</span>
                        </div>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 SurveyHub Kenya. All rights reserved. Made in Nairobi.</p>
                </div>
            </footer>
        </div>
    );
}