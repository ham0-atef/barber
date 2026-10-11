import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CustomEase } from "gsap/CustomEase"

gsap.registerPlugin(ScrollTrigger, CustomEase)

import {
    Scissors,
    Feather, // For Shaves (Smooth)
    Droplets, // For Facials (Water/Products)
    Sparkles, // For Beard Trim (Clean/Sharp)
    Crown, // For Hair Styling (Premium)
    Palette, // For Hair Color
    ArrowRight,
    Waves
} from 'lucide-react'

import barberImg from '../assets/BARBER.webp'
import Landing from '../assets/Landing.webp'
import About from '../assets/About.webp'
import serviceHaircut from '../assets/services/service-haircut.webp'
import serviceStyling from '../assets/services/service-styling.webp'
import serviceColoring from '../assets/services/service-coloring.webp'
import serviceShaving from '../assets/services/service-shaving.webp'
import serviceTreatment from '../assets/services/service-treatment.webp'
import serviceGrooming from '../assets/services/service-grooming.webp'
import ServiceCard from '../Components/ServiceCard.jsx'
import PriceCard from '../Components/PriceCard.jsx'
import AppointmentForm from '../Components/AppointmentForm.jsx'
import CustomerReview from '../Components/CustomerReview.jsx'
import GalleryItem from '../Components/GalleryItem.jsx'
import { customerReviews } from '../data/reviews.js'
import { sampleImages } from '../data/sample-images.js'
import BrandCarousel from '../Components/BrandCarousel.jsx'
import Header from '../Components/Header.jsx'
import HeroCanvas from '../Components/HeroCanvas.jsx'
import { useMagnetic } from '../hooks/useMagnetic.jsx'
import { Link } from 'react-router-dom'
import { useStaff } from '../Context/StaffContext.jsx'
import { useLanguage } from '../Context/LanguageContext.jsx'

function Home() {
    const heroRef = useRef(null)
    const aboutRef = useRef(null)
    const { dict, isItalian } = useLanguage()

    // Initialize Magnetic interaction engine
    useMagnetic();

    // Load Artisans data
    const { staff } = useStaff()
    const featuredArtisans = staff.slice(0, 4)

    const servicesData = [
        {
            icon: <Scissors size={24} strokeWidth={1} />,
            title: dict.services.haircut.title,
            description: dict.services.haircut.desc,
            price: "$30.00",
            image: serviceHaircut
        },
        {
            icon: <Feather size={24} strokeWidth={1} />,
            title: dict.services.shave.title,
            description: dict.services.shave.desc,
            price: "$20.00",
            image: serviceStyling
        },
        {
            icon: <Droplets size={24} strokeWidth={1} />,
            title: dict.services.facial.title,
            description: dict.services.facial.desc,
            price: "$30.00",
            image: serviceColoring
        },
        {
            icon: <Sparkles size={24} strokeWidth={1} />,
            title: dict.services.beard.title,
            description: dict.services.beard.desc,
            price: "$15.00",
            image: serviceShaving
        },
        {
            icon: <Crown size={24} strokeWidth={1} />,
            title: dict.services.styling.title,
            description: dict.services.styling.desc,
            price: "$60.00",
            image: serviceTreatment
        },
        {
            icon: <Palette size={24} strokeWidth={1} />,
            title: dict.services.color.title,
            description: dict.services.color.desc,
            price: "$60.00",
            image: serviceGrooming
        }
    ]

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useGSAP(() => {
        // Register the CustomEase for the exact luxury curve mapping
        if (!CustomEase.get("luxury")) {
            CustomEase.create("luxury", "0.23, 1, 0.32, 1");
        }

        // ──────── GALLERY CINEMATIC REVEAL (PHASE 4.2) ────────
        const galleryItems = gsap.utils.toArray('.gallery-reveal-item');
        if (galleryItems.length > 0) {
            // Initial state - hidden below clip path point with subtle y offset
            gsap.set(galleryItems, {
                clipPath: 'inset(100% 0 0 0)',
                y: 40
            });

            ScrollTrigger.create({
                trigger: ".sample-images",
                start: "top 80%",
                onEnter: () => {
                    gsap.to(galleryItems, {
                        clipPath: 'inset(0% 0 0 0)',
                        y: 0,
                        duration: 1.4,
                        stagger: 0.1, // Progressive rendering delay
                        ease: "luxury", // Matches --ease-luxury token per instructions
                        force3D: true // Hardware acceleration for WebGL feel
                    });
                }
            });
        }

        // ──────── SERVICE CARDS — Batched reveal (single ScrollTrigger) ────────
        const serviceCards = gsap.utils.toArray('.service-card-marker');
        if (serviceCards.length > 0) {
            // Pre-set initial state in one pass (no per-card ScrollTrigger)
            gsap.set(serviceCards, { y: 60, opacity: 0, willChange: 'transform, opacity' });

            ScrollTrigger.batch(serviceCards, {
                start: 'top 92%',
                once: true,               // Fire once — no reverse recalculation
                onEnter: (batch) => {
                    gsap.to(batch, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.12,     // Progressive per-batch stagger
                        ease: 'power3.out',
                        force3D: true,
                        overwrite: 'auto',
                        onComplete: function () {
                            // Remove will-change after animation to free GPU layers
                            batch.forEach(el => el.style.willChange = 'auto');
                        }
                    });
                }
            });
        }

        // ──────── MASTERS OF THE RITUAL (ARTISANS) ────────
        const artisanCards = gsap.utils.toArray('.artisan-card-marker');
        if (artisanCards.length > 0) {
            gsap.set(artisanCards, { y: 60, opacity: 0 });

            ScrollTrigger.batch(artisanCards, {
                start: 'top 85%',
                once: true,
                onEnter: (batch) => {
                    gsap.to(batch, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.2, // requested 0.2s stagger
                        ease: 'luxury',
                        force3D: true,
                        overwrite: 'auto'
                    });
                }
            });

            // Touch-device disabled hover animations
            let mm = gsap.matchMedia();
            mm.add("(hover: hover)", () => {
                artisanCards.forEach(card => {
                    const svg = card.querySelector('.artisan-tool-svg');
                    const img = card.querySelector('.artisan-portrait');

                    if (svg && img) {
                        card.addEventListener('mouseenter', () => {
                            gsap.to(svg, { scale: 1.2, opacity: 0.2, duration: 0.6, ease: 'luxury' });
                            gsap.to(img, { filter: 'grayscale(0%)', duration: 0.6, ease: 'luxury' });
                        });
                        card.addEventListener('mouseleave', () => {
                            gsap.to(svg, { scale: 0.8, opacity: 0, duration: 0.6, ease: 'luxury' });
                            gsap.to(img, { filter: 'grayscale(100%)', duration: 0.6, ease: 'luxury' });
                        });
                    }
                });
            });
        }

        // ──────── ABOUT SECTION ANIMATIONS ────────
        if (aboutRef.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top 75%",
                    toggleActions: "play reverse play reverse",
                }
            });

            // Image Reveal (Mask sliding away)
            tl.to('.about-image-mask', {
                yPercent: -100,
                duration: 1.5,
                ease: "power4.inOut"
            }, 0);

            // Large ELEGANCE text parallax via ScrollTrigger scrub directly on the element
            gsap.to('.about-bg-text', {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5, // Parallax roughly 1.5x
                }
            });

            // Manifesto Line-by-Line Reveal
            tl.fromTo('.manifesto-line',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power4.out" // Closest standard GSAP to var(--ease-luxury)
                }, 0.2
            );



            // Floating Heritage Card entrance
            tl.fromTo('.heritage-card',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
                1.0
            );
        }

        // ──────── TESTIMONIAL THEATER (UNIVERSAL HORIZONTAL SCROLL) ────────
        // No matchMedia — pin + horizontal scroll forced on ALL screen sizes
        const trackWrapper = document.querySelector('.testimonial-track-wrapper');
        const slides = gsap.utils.toArray('.testimonial-slide');

        if (trackWrapper && slides.length > 0) {
            // Force flex-nowrap on the track to guarantee filmstrip layout
            trackWrapper.style.display = 'flex';
            trackWrapper.style.flexWrap = 'nowrap';

            // Pin the entire theater section and scroll horizontally
            const scrollTween = gsap.to(slides, {
                xPercent: -100 * (slides.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".testimonial-theater-container",
                    pin: true,
                    start: "top 80px", // Header offset
                    scrub: 1, // Smooth dragging tied to Lenis
                    snap: {
                        snapTo: 1 / (slides.length - 1),
                        duration: 0.5,
                        ease: "power1.inOut"
                    },
                    end: () => "+=" + trackWrapper.offsetWidth, // Scroll distance equals track width
                    onUpdate: (self) => {
                        const index = Math.min(
                            slides.length - 1,
                            Math.max(0, Math.round(self.progress * (slides.length - 1)))
                        );

                        // Update fractional counter dynamically
                        const counter = document.querySelector('.testimonial-counter');
                        if (counter) {
                            counter.innerText = `${(index + 1).toString().padStart(2, '0')} / ${slides.length.toString().padStart(2, '0')}`;
                        }
                    }
                }
            });

            // Set up internal parallax and reveal animations PER slide
            slides.forEach((slide) => {
                const image = slide.querySelector('.portrait-image');
                const words = slide.querySelectorAll('.quote-word');
                const meta = slide.querySelector('.review-meta');

                // 1. Subtle image parallax (moves counter to scroll direction)
                if (image) {
                    gsap.fromTo(image,
                        { xPercent: -15 },
                        {
                            xPercent: 15,
                            ease: "none",
                            scrollTrigger: {
                                trigger: slide,
                                containerAnimation: scrollTween, // Hook into the horizontal scroll tween
                                start: "left right",
                                end: "right left",
                                scrub: true
                            }
                        }
                    );
                }

                // 2. Text Reveal Content (Triggers when slide comes into center view)
                if (words.length > 0) {
                    const tlReveal = gsap.timeline({
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: scrollTween,
                            start: "left center", // Trigger when left edge of slide hits center of viewport
                            toggleActions: "play reverse play reverse"
                        }
                    });

                    tlReveal.to(words, {
                        y: "0%",
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.03, // Fast machine-gun stagger
                        ease: "power3.out"
                    })
                        .to(meta, {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power3.out"
                        }, "-=0.4"); // Overlap with text reveal
                }
            });

            // Force recalculation after setup to ensure tracking lengths are accurate
            ScrollTrigger.refresh();
        }

    }) // Removed { scope: heroRef } so it can find elements in the Services section

    return (
        <>
            <Header bgImage="bg-transparent" />

            {/* ═══════════════════════════════════════════════════════
                HERO — Cinematic Editorial Layout
                data-scroll-section: Lenis integration point
                ref={heroRef}: GSAP scope container
                ═══════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                data-scroll-section
                className="relative min-h-fit overflow-hidden bg-[#F7F3EA] pt-6 md:pt-0"
                id="main-hero"
            >
                {/* Background Image Layer (Base) with warm cinematic tone */}
                <div
                    className="absolute inset-0 z-0 opacity-15 mix-blend-multiply"
                    style={{
                        backgroundImage: `url(${Landing})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* 3D WebGL Background Layer (Chrome, dark metallic, gold & burgundy tools) */}
                <HeroCanvas />

                {/* Cinematic Editorial Gradient Overlay — Ivory wash */}
                <div className="absolute inset-0 z-2 pointer-events-none" style={{
                    background: 'linear-gradient(105deg, rgba(247,243,234,0.96) 0%, rgba(247,243,234,0.85) 45%, rgba(247,243,234,0.35) 75%, rgba(247,243,234,0.1) 100%)'
                }}></div>

                {/* ── Hero Content Grid ── */}
                <div className="relative z-10 container mx-auto px-4 sm:pl-6 lg:pl-13 pt-18 md:pt-16 pb-0">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-4 sm:gap-6 lg:gap-0 min-h-0">

                        {/* ── Left Content — Bold Masculine Typography ── */}
                        <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start pt-4 lg:pt-14 mb-2 z-10">

                            {/* Tagline — horizontal line + text */}
                            <div data-hero-tagline className="flex items-center gap-4 mb-6 sm:mb-8 lg:mb-10">
                                <div className="w-8 sm:w-12 hidden md:flex h-px bg-gold"></div>
                                <p className="font-sans text-burgundy text-[8px] sm:text-[10px] md:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase font-semibold">
                                    {dict.hero.badge}
                                </p>
                            </div>

                            {/* Main Heading — Bold, aggressive spacing */}
                            <div data-hero-heading className="heading-text text-center lg:text-left mb-4">
                                {/* Line 1 */}
                                <h1 className="font-serif font-bold text-near-black text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1] uppercase">
                                    {dict.hero.headingPrefix}
                                </h1>

                                {/* Line 2: Massive, dominant */}
                                <h2 className="font-sans font-black text-burgundy text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] 2xl:text-[7rem] uppercase leading-[0.9] -tracking-[0.02em] my-2 sm:my-3 md:my-4">
                                    {dict.hero.headingAccent}
                                </h2>

                                {/* Line 3 */}
                                <h3 className="font-serif font-bold text-near-black text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1] uppercase">
                                    {dict.hero.headingSuffix}
                                </h3>
                            </div>

                            {/* Description */}
                            <p
                                data-hero-description
                                className="font-sans font-light text-warm-gray text-xs sm:text-sm md:text-base max-w-sm leading-relaxed tracking-wide text-center lg:text-left mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0"
                            >
                                {dict.hero.description}
                            </p>

                            {/* CTA Row */}
                            <div data-hero-cta className="flex flex-row items-center gap-4 sm:gap-6 mb-7 md:mb-12">
                                <a href="#appointment">
                                    <div data-magnetic className="group relative">
                                        <button className="btn-primary-luxury relative px-7 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 border border-transparent shadow-md">
                                            <span data-magnetic-text className="relative z-10 inline-flex items-center gap-2 sm:gap-3">
                                                {dict.hero.bookButton}
                                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ease-luxury group-hover:translate-x-1" strokeWidth={2} />
                                            </span>
                                        </button>
                                    </div>
                                </a>

                                <a href="#services" className="btn-secondary-luxury px-6 py-3 sm:px-8 sm:py-4 group inline-flex items-center gap-2 text-[10px] sm:text-xs">
                                    {dict.hero.exploreButton}
                                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-500 ease-luxury group-hover:translate-x-1.5" strokeWidth={2} />
                                </a>
                            </div>
                        </div>

                        {/* ── Right Visual — Large Editorial Image ── */}
                        <div className="w-full lg:w-[50%] relative hidden md:flex justify-center lg:justify-end items-end self-end">
                            <div
                                data-hero-image
                                data-scroll
                                data-scroll-speed="0.5"
                                data-parallax
                                className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl"
                            >
                                {/* Image with soft top clip */}
                                <div className="overflow-hidden rounded-t-3xl">
                                    <img
                                        src={barberImg}
                                        alt="Professional Barber"
                                        className="w-full h-auto object-contain transition-transform duration-1200 ease-luxury hover:scale-[1.03]"
                                    />
                                </div>

                                {/* Glassmorphism floating badge */}
                                <div
                                    data-hero-badge
                                    data-magnetic
                                    className="absolute bottom-6 -left-6 lg:-left-14 backdrop-blur-xl bg-white/95 border border-soft-border rounded-lg px-5 py-3 shadow-xl"
                                >
                                    <p data-magnetic-text className="font-sans text-burgundy text-xl font-black leading-tight">
                                        {dict.stats.heritageValue}
                                    </p>
                                    <p data-magnetic-text className="font-sans text-warm-gray text-[8px] uppercase tracking-[0.3em] font-semibold">
                                        {dict.stats.heritageLabel}
                                    </p>
                                </div>

                                {/* Accent line */}
                                <div className="absolute top-12 -right-4 w-px h-20 bg-linear-to-b from-gold/40 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Strip — Aligned with hero container ── */}
                <div className="relative z-10 bg-white border-y border-soft-border shadow-xs">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="grid grid-cols-4 divide-x divide-soft-border">
                            {[
                                { value: dict.stats.heritageValue, label: dict.stats.heritageLabel },
                                { value: dict.stats.craftValue, label: dict.stats.craftLabel },
                                { value: dict.stats.gentlemenValue, label: dict.stats.gentlemenLabel },
                                { value: dict.stats.ratingValue, label: dict.stats.ratingLabel }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    data-stats-item
                                    className="flex flex-col sm:flex-row items-center sm:items-center px-4 sm:px-2 lg:px-8 py-6 sm:py-8 gap-2 sm:gap-4 text-center sm:text-left"
                                >
                                    <span className="font-sans text-burgundy text-lg sm:text-2xl lg:text-3xl font-black leading-none">{stat.value}</span>
                                    <span className="font-sans text-warm-gray text-[6px] sm:text-[9px] lg:text-[11px] uppercase tracking-tightest sm:tracking-[0.2em] sm:mt-0 font-semibold">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ ABOUT EDITORIAL SPREAD ═══════════════════════ */}
            <section
                ref={aboutRef}
                className='about relative bg-ivory text-near-black overflow-hidden py-20 md:py-28 md:pb-36 border-b border-soft-border'
                id='about'
            >
                {/* Decorative Background Text */}
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none z-0 overflow-hidden">
                    <h2 className="about-bg-text font-serif text-[15vw] leading-none text-near-black/3 font-black uppercase whitespace-nowrap select-none">
                        Elegance
                    </h2>
                </div>

                <div className="container mx-auto px-8 md:px-12 lg:px-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">

                        {/* Left Column: Image Composition */}
                        <div className="md:col-span-12 lg:col-span-6 relative flex justify-center md:justify-start z-20">
                            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-xl overflow-hidden rounded-sm mx-auto md:mx-0 shadow-lg border border-soft-border/50">
                                {/* The Image Mask */}
                                <div className="about-image-mask absolute inset-0 bg-ivory z-10 origin-top"></div>
                                <img
                                    src={About}
                                    alt="Elegance Master Barber"
                                    className="w-full h-auto block object-contain grayscale hover:grayscale-0 transition-all duration-1000 ease-luxury relative"
                                />
                            </div>

                            {/* Tactile Glassmorphism Detail */}
                            <div className="heritage-card absolute -bottom-6 right-0 md:-right-8 lg:-right-12 backdrop-blur-xl bg-white/95 border border-soft-border p-6 shadow-xl z-20 w-48 rounded-sm">
                                <p className="font-sans text-burgundy text-xs tracking-[0.3em] uppercase mb-2 font-bold">{dict.about.tag}</p>
                                <p className="font-serif text-3xl text-near-black font-light">{dict.about.cardTitle}</p>
                                <div className="w-12 h-px bg-gold mt-4"></div>
                            </div>
                        </div>

                        {/* Right Column: Brand Manifesto */}
                        <div className="md:col-span-12 lg:col-span-6 flex flex-col justify-center mt-12 md:mt-0 md:pl-8 lg:pl-16">

                            <h3 className="manifesto-line font-serif italic text-burgundy text-2xl lg:text-3xl font-light mb-6">
                                {dict.about.tag}
                            </h3>

                            <h2 className="manifesto-line font-sans font-black text-near-black text-4xl md:text-5xl lg:text-6xl uppercase mb-10 leading-tight">
                                {dict.about.heading}
                            </h2>

                            {/* Brand Manifesto Text with Drop Cap */}
                            <div className="manifesto-content max-w-xl">
                                <p className="manifesto-line font-sans font-light text-warm-gray text-base md:text-lg leading-[1.8] mb-6 tracking-wide">
                                    <span className="float-left text-6xl font-serif text-burgundy pr-3 pb-2 leading-none mt-1 font-bold">
                                        {dict.about.p1.charAt(0)}
                                    </span>
                                    {dict.about.p1.slice(1)}
                                </p>

                                <p className="manifesto-line font-sans font-light text-near-black/80 text-sm md:text-base leading-[1.8] mb-12 tracking-wide pl-4 border-l-2 border-gold">
                                    {dict.about.p2}
                                </p>
                            </div>

                            {/* Lucide Icons Strip */}
                            <div className="manifesto-line flex justify-between md:justify-start lg:gap-38 mt-3">
                                <div className="flex flex-col items-center group cursor-default">
                                    <Scissors className="text-burgundy mb-3 transition-all duration-500 ease-luxury group-hover:scale-110 group-hover:text-gold" size={40} strokeWidth={1.25} />
                                    <span className="font-sans text-warm-gray text-[9px] tracking-[0.2em] uppercase font-semibold pl-1">{dict.services.haircut.title}</span>
                                </div>
                                <div className="flex flex-col items-center group cursor-default">
                                    <Waves className="text-burgundy mb-3 transition-all duration-500 ease-luxury group-hover:scale-110 group-hover:text-gold" size={40} strokeWidth={1.25} />
                                    <span className="font-sans text-warm-gray text-[10px] tracking-[0.2em] uppercase font-semibold pl-1.5">{dict.services.shave.title}</span>
                                </div>
                                <div className="flex flex-col items-center group cursor-default">
                                    <Sparkles className="text-burgundy mb-3 transition-all duration-500 ease-luxury group-hover:scale-110 group-hover:text-gold" size={40} strokeWidth={1.25} />
                                    <span className="font-sans text-warm-gray text-[10px] tracking-[0.2em] uppercase font-semibold pl-1.5">{dict.services.facial.title}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ SERVICES — Editorial Stagger ═══════════════════════ */}
            <section
                data-scroll-section
                className="service-section bg-ivory text-near-black py-16 md:py-28 relative border-b border-soft-border"
                id='services'
            >
                <div className='mx-auto px-2 lg:px-16 max-w-11/12'>
                    {/* Section Header — Editorial type pairing */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 lg:mb-24 gap-6">
                        <div className="text-center md:text-left">
                            <span className="font-sans text-burgundy tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block font-semibold">{dict.services.tag}</span>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-near-black uppercase tracking-tight leading-none font-sans">
                                {dict.services.heading}
                            </h2>
                        </div>
                        <p className="font-sans font-light text-warm-gray max-w-sm text-right hidden md:block text-sm tracking-wide leading-relaxed">
                            {dict.services.subheading}
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 lg:gap-6">
                        {/* Row 1: Full-width feature card */}
                        <div className="w-full service-card-marker">
                            <ServiceCard {...servicesData[0]} index={0} variant="featured" />
                        </div>

                        {/* Row 2: Two cards, offset */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
                            <div className="w-full lg:w-[55%] service-card-marker">
                                <ServiceCard {...servicesData[1]} index={1} />
                            </div>
                            <div className="w-full lg:w-[45%] lg:mt-12 service-card-marker">
                                <ServiceCard {...servicesData[2]} index={2} />
                            </div>
                        </div>

                        {/* Row 3: Two cards, reverse offset */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
                            <div className="w-full lg:w-[45%] lg:mt-8 service-card-marker">
                                <ServiceCard {...servicesData[3]} index={3} />
                            </div>
                            <div className="w-full lg:w-[55%] service-card-marker">
                                <ServiceCard {...servicesData[4]} index={4} />
                            </div>
                        </div>

                        {/* Row 4: Full-width feature card */}
                        <div className="w-full service-card-marker">
                            <ServiceCard {...servicesData[5]} index={5} variant="featured" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ PRICE LIST ═══════════════════════ */}
            <section className="price-section bg-ivory text-near-black py-10 md:pt-4 md:py-24 border-b border-soft-border">
                <div className='mx-auto flex flex-col'>
                    {/* Section Header — Editorial type pairing (matches Services section) */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 md:mb-18 gap-6 px-4 md:px-6 lg:px-16 max-w-11/12 mx-auto w-full">
                        <div className="text-center md:text-left">
                            <span className="font-sans text-burgundy tracking-[0.5em] text-[9px] sm:text-xs uppercase mb-3 block font-semibold">{dict.pricing.tag}</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-near-black uppercase tracking-tight leading-none font-sans">
                                {dict.pricing.heading}
                            </h2>
                        </div>
                        <p className="font-sans font-light text-warm-gray max-w-sm text-right hidden md:block text-sm tracking-wide leading-relaxed">
                            {dict.pricing.subheading}
                        </p>
                    </div>

                    <PriceCard />
                </div>
            </section>

            {/* ═══════════════════════ APPOINTMENT ═══════════════════════ */}
            <section className="appoinment-section bg-ivory text-near-black py-12 md:py-16 border-b border-soft-border" id='appointment'>
                <div className='pb-8 mx-auto flex flex-col gap-2'>
                    <div className="heading w-full text-center text-3xl lg:text-5xl font-black uppercase">
                        <span className="font-sans text-burgundy tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block font-semibold">{dict.appointment.tag}</span>
                        <h1 className='text-near-black font-serif text-3xl lg:text-5xl'>{dict.appointment.heading}</h1>
                        <p className="font-sans font-light text-warm-gray max-w-md mx-auto text-xs sm:text-sm tracking-wide mt-3 normal-case">{dict.appointment.subheading}</p>
                        <div className='w-24 h-0.5 bg-gold mx-auto mt-5'></div>
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12 mb-8'>
                        <AppointmentForm />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ BRANDS ═══════════════════════ */}
            <section className="brand-images bg-ivory overflow-hidden pt-6 md:pt-16 pb-28 border-b border-soft-border">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="font-sans text-burgundy tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block font-semibold">{dict.brands.tag}</span>
                    <h2 className="text-3xl md:text-5xl font-black text-near-black uppercase tracking-wide mb-2 font-serif">
                        {dict.brands.heading}
                    </h2>
                </div>

                <BrandCarousel />

                {/* Bottom decoration line */}
                <div className="mt-8 flex justify-center">
                    <div className="w-32 h-px bg-linear-to-r from-transparent via-gold to-transparent"></div>
                </div>
            </section>

            {/* ═══════════════════════ TESTIMONIAL THEATER (SOCIAL PROOF) ═══════════════════════ */}
            <section
                ref={heroRef} // For keeping GSAP scope if needed elsewhere, although local refs are better setup
                className="testimonial-theater-container relative z-10 bg-near-black text-ivory w-full overflow-hidden"
                id='reviews'
            >
                {/* Horizontal / Vertical Scroll Track Wrapper */}
                <div
                    className="testimonial-track-wrapper w-[calc(100vw*var(--slide-count))]"
                    style={{ '--slide-count': customerReviews.length, display: 'flex', flexWrap: 'nowrap' }}
                >
                    {customerReviews.map((review) => (
                        <div key={review.id} className="testimonial-slide min-w-screen w-screen h-dvh shrink-0">
                            <CustomerReview
                                name={review.name}
                                image={review.img}
                                review={review.review}
                                service={review.service}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════ MASTERS OF THE RITUAL ═══════════════════════ */}
            <section
                id="artisans"
                className="bg-ivory text-near-black pt-20 md:pt-36 pb-18 md:pb-22 overflow-hidden relative border-b border-soft-border"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-11/12">
                    <div className="text-center mb-20">
                        <span className="font-sans text-burgundy tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block font-semibold">{dict.artisans.tag}</span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-near-black uppercase tracking-tight leading-none font-sans">
                            {dict.artisans.heading}
                        </h2>
                        <p className="font-sans font-light text-warm-gray max-w-md mx-auto text-xs sm:text-sm tracking-wide mt-3">{dict.artisans.subheading}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {featuredArtisans.map((member) => {
                            // Determine tool icon based on role
                            let ToolIcon = Scissors;
                            const roleLower = (member.role || "").toLowerCase();
                            if (roleLower.includes('color')) ToolIcon = Palette;
                            else if (roleLower.includes('barber') || roleLower.includes('shave')) ToolIcon = Feather;
                            else if (roleLower.includes('makeup') || roleLower.includes('facial')) ToolIcon = Droplets;

                            return (
                                <Link
                                    to={`/artisan/${member.id}`}
                                    key={member.id}
                                    className="artisan-card-marker group relative block bg-white border border-soft-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-500 ease-luxury"
                                >
                                    <div className="relative aspect-3/4 w-full overflow-hidden bg-ivory">
                                        {/* Background Tool SVG */}
                                        <div className="artisan-tool-svg absolute inset-0 flex items-center justify-center p-8 text-burgundy opacity-0 group-hover:opacity-40 scale-80 pointer-events-none z-0 transition-all duration-500">
                                            <ToolIcon className="w-full h-full" strokeWidth={1} />
                                        </div>

                                        {/* Image */}
                                        <img
                                            src={member.avatar || barberImg}
                                            alt={member.name}
                                            className="artisan-portrait absolute inset-0 w-full h-full object-cover z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                                        />

                                        {/* Gradient Overlay for Text */}
                                        <div className="absolute inset-0 bg-linear-to-t from-near-black via-near-black/50 to-transparent z-20 pointer-events-none"></div>

                                        {/* Text Info */}
                                        <div className="absolute flex flex-col items-center justify-end bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
                                            <h3 className="font-sans font-black text-xl lg:text-2xl uppercase tracking-wider text-white mb-1 group-hover:text-gold transition-colors duration-500 ease-luxury text-center">
                                                {member.name}
                                            </h3>
                                            <p className="font-serif text-gold text-sm lg:text-base italic tracking-wide text-center">
                                                {member.role || (isItalian ? "Maestro Barbiere" : "Master Artisan")}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ GALLERY (PHASE 4.2 INTERACTIVE) ═══════════════════════ */}
            <section className="sample-images bg-ivory overflow-hidden">
                <div className="mx-auto px-4 sm:px-6 md:px-16 pb-20 md:pb-24">
                    <div className="heading w-full text-center mb-14 mt-12">
                        <span className="font-sans text-burgundy tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block font-semibold">{dict.gallery.tag}</span>
                        <h1 className='text-near-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase font-serif tracking-tight'>{dict.gallery.heading}</h1>
                        <div className='w-20 sm:w-28 h-0.5 bg-gold mx-auto mt-6 md:mt-8 mb-10'></div>
                    </div>
                    {/* Responsive Grid: 3 cols mobile, 6 cols desktop */}
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 lg:gap-4 mt-6">
                        {sampleImages.map((sample) => (
                            <GalleryItem
                                key={sample.id}
                                img={sample.img}
                                title={sample.title}
                                barber={sample.barber}
                                category={sample.category}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
export default Home
