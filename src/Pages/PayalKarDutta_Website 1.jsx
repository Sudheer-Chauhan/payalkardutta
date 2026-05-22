import { useState, useEffect, useRef } from "react";

const C = {
  bg:     "#0D1117",
  bg2:    "#111820",
  border: "rgba(255,255,255,0.07)",
  gold:   "#B8956A",
  gold2:  "#9A7A52",
  white:  "#FFFFFF",
  text:   "#C9D4DC",
  muted:  "#6B7C8A",
  dim:    "#3A4A56",
};

/* ── hooks ─────────────────────────────────────────────── */
const useMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
};

const useFade = () => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setOn(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, on];
};

/* ── primitives ─────────────────────────────────────────── */
const F = ({ children, d = 0, style = {} }) => {
  const [ref, on] = useFade();
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? "none" : "translateY(18px)",
      transition: `opacity 0.85s cubic-bezier(.4,0,.2,1) ${d}ms,
                   transform 0.85s cubic-bezier(.4,0,.2,1) ${d}ms`,
      ...style,
    }}>{children}</div>
  );
};

const Line = ({ w = 40 }) => (
  <div style={{ width: w, height: 1, background: C.gold, opacity: 0.7, flexShrink: 0 }} />
);

const Chip = ({ children }) => (
  <span style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: C.gold, fontFamily: "'Inter',sans-serif" }}>
    {children}
  </span>
);

const SectionLabel = ({ children, center }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: center ? "center" : "flex-start" }}>
    <Line w={24} />
    <Chip>{children}</Chip>
    {center && <Line w={24} />}
  </div>
);

/* ── nav ────────────────────────────────────────────────── */
const Nav = () => {
  const mobile = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const px = mobile ? "20px" : "56px";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? `14px ${px}` : `26px ${px}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled || open ? "rgba(13,17,23,0.97)" : "transparent",
        borderBottom: scrolled || open ? `1px solid ${C.border}` : "none",
        backdropFilter: scrolled || open ? "blur(16px)" : "none",
        transition: "padding 0.4s ease, background 0.4s ease",
      }}>
        <button onClick={() => go("hero")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 16 : 18, color: C.white, letterSpacing: 1 }}>
            Payal Kar Dutta
          </div>
          <div style={{ fontSize: 7, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginTop: 2 }}>
            Founder & CEO · Veva Realty
          </div>
        </button>

        {mobile ? (
          <button onClick={() => setOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 5, padding: 4,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: open ? (i === 1 ? 0 : 22) : 22,
                height: 1.5,
                background: C.gold,
                transform: open ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none") : "none",
                transition: "all 0.3s ease",
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["About","Services","Connect"].map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, letterSpacing: 4, textTransform: "uppercase",
                color: C.muted, fontFamily: "'Inter',sans-serif", transition: "color 0.25s", padding: 0,
              }}
                onMouseEnter={e => e.target.style.color = C.text}
                onMouseLeave={e => e.target.style.color = C.muted}
              >{l}</button>
            ))}
            <button onClick={() => go("connect")} style={{
              background: "none", border: `1px solid rgba(184,149,106,0.5)`,
              color: C.gold, fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
              padding: "9px 20px", cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = C.gold; e.target.style.color = "#0D1117"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = C.gold; }}
            >Book a Meeting</button>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {mobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 190,
          background: "rgba(13,17,23,0.98)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}>
          {["About","Services","Journey","Connect"].map(l => (
            <button key={l} onClick={() => go(l.toLowerCase())} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300,
              color: C.white, letterSpacing: 2,
            }}>{l}</button>
          ))}
          <button onClick={() => go("connect")} style={{
            marginTop: 12,
            background: C.gold, border: "none", color: "#0D1117",
            fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
            padding: "13px 32px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 500,
          }}>Book a Meeting</button>
        </div>
      )}
    </>
  );
};

/* ── main ────────────────────────────────────────────────── */
export default function PayalKarDutta() {
  const mobile = useMobile();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const px    = mobile ? "24px" : "56px";
  const secPy = mobile ? "72px" : "100px";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(184,149,106,0.2); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #9A7A52; }
        ::-webkit-scrollbar-track { background: #0D1117; }
        @keyframes heroUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
        @keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:.85} }
        input::placeholder, textarea::placeholder { color: #3A4A56; }
      `}</style>

      <Nav />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section id="hero" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: `120px ${px} 80px`,
        position: "relative",
      }}>
        <div style={{ animation: "heroUp 0.8s ease 0.1s both" }}>
          <SectionLabel center>Personal Authority Platform</SectionLabel>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: mobile ? "clamp(56px,14vw,76px)" : "clamp(72px,9vw,108px)",
          fontWeight: 300, lineHeight: 0.95, color: C.white,
          letterSpacing: -1,
          animation: "heroUp 1s ease 0.25s both",
        }}>
          Payal<br />
          <span style={{ color: C.gold }}>Kar Dutta</span>
        </h1>

        <div style={{
          display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
          margin: "28px 0 28px",
          animation: "heroUp 0.8s ease 0.45s both",
        }}>
          <div style={{ width: 48, height: 1.5, background: C.gold }} />
          <div style={{ width: 14, height: 1, background: C.dim }} />
        </div>

        <p style={{
          fontSize: mobile ? 14 : 15, lineHeight: 2, color: C.muted, fontWeight: 300,
          maxWidth: 440,
          animation: "heroUp 0.9s ease 0.6s both",
        }}>
          Founder & CEO of Veva Realty. Real estate strategist,
          entrepreneur, and mentor building legacies across
          Hyderabad, Bengaluru & Kolkata.
        </p>

        <div style={{
          display: "flex", gap: 16, marginTop: 44, alignItems: "center",
          flexWrap: "wrap", justifyContent: "center",
          animation: "heroUp 0.9s ease 0.75s both",
        }}>
          <button onClick={() => document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: C.gold, border: "none", color: "#0D1117",
              fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
              padding: "13px 30px", cursor: "pointer",
              fontFamily: "'Inter',sans-serif", fontWeight: 500, transition: "background 0.3s",
            }}
            onMouseEnter={e => e.target.style.background = "#ccaa7a"}
            onMouseLeave={e => e.target.style.background = C.gold}
          >Schedule Consultation</button>

          <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none", border: "none", color: C.muted,
              fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'Inter',sans-serif",
              display: "flex", alignItems: "center", gap: 8, transition: "color 0.25s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >
            Learn More
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* scroll cue */}
        <div style={{
          position: "absolute", bottom: 36,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "heroUp 1s ease 1.2s both",
        }}>
          <div style={{
            width: 1, height: 44,
            background: `linear-gradient(${C.gold}, transparent)`,
            animation: "scrollPulse 2.4s ease infinite",
          }} />
          <span style={{ fontSize: 7, letterSpacing: 5, color: C.dim, textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
        <F>
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
            maxWidth: 900, margin: "0 auto",
          }}>
            {[["10+","Years Experience"],["500+","Properties Delivered"],["3","City Presence"],["₹500Cr+","Assets Advised"]].map(([n,l],i) => (
              <div key={l} style={{
                padding: mobile ? "24px 16px" : "32px 20px",
                textAlign: "center",
                borderRight: (mobile ? i % 2 !== 1 : i < 3) ? `1px solid ${C.border}` : "none",
                borderBottom: mobile && i < 2 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 32 : 40, fontWeight: 300, color: C.white, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 3, color: C.muted, marginTop: 8, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </F>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <section id="about" style={{ padding: `${secPy} ${px}`, maxWidth: 1060, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 48 : 72, alignItems: "center",
        }}>
          <F d={0}>
            <div style={{ position: "relative", maxWidth: mobile ? 320 : "100%", margin: mobile ? "0 auto" : "0" }}>
              <div style={{
                paddingBottom: "118%", background: C.bg2,
                border: `1px solid ${C.border}`, position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                }}>
                  <div style={{
                    width: 76, height: 76, borderRadius: "50%",
                    border: `1px solid rgba(184,149,106,0.35)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold, fontWeight: 300,
                  }}>PKD</div>
                  <div style={{ fontSize: 7, color: C.dim, letterSpacing: 4 }}>PORTRAIT</div>
                </div>
              </div>
              <div style={{ position: "absolute", top: -1, left: -1, width: 26, height: 26, borderTop: `1.5px solid ${C.gold}`, borderLeft: `1.5px solid ${C.gold}` }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 26, height: 26, borderBottom: `1.5px solid ${C.gold}`, borderRight: `1.5px solid ${C.gold}` }} />
              <div style={{
                position: "absolute", bottom: 24, left: 0,
                background: C.gold, color: "#0D1117",
                padding: "8px 16px", fontSize: 7, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500,
              }}>Founder & CEO · Veva Realty</div>
            </div>
          </F>

          <F d={mobile ? 0 : 120}>
            <SectionLabel>About</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.white, marginBottom: 4 }}>
              A Visionary Leader
            </h2>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.gold, marginBottom: 24 }}>
              in Real Estate
            </h2>
            <div style={{ width: 40, height: 1, background: C.border, marginBottom: 24 }} />
            <p style={{ fontSize: 13, lineHeight: 1.95, color: C.muted, fontWeight: 300, marginBottom: 16 }}>
              Payal Kar Dutta is the driving force behind Veva Realty — a Hyderabad-based real estate firm that has redefined how investors and families approach property decisions across India's fastest-growing cities.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.95, color: C.muted, fontWeight: 300, marginBottom: 28 }}>
              Her belief: every property transaction is a life-altering moment that deserves wisdom, trust, and precision.
            </p>
            <div style={{ display: "flex", gap: 28, paddingTop: 24, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              {[["Hyderabad","HQ"],["Bengaluru","Office"],["Kolkata","Office"]].map(([c,t]) => (
                <div key={c}>
                  <div style={{ fontSize: 13, color: C.white, fontWeight: 400 }}>{c}</div>
                  <div style={{ fontSize: 7, color: C.gold, letterSpacing: 3, marginTop: 4, textTransform: "uppercase" }}>{t}</div>
                </div>
              ))}
            </div>
          </F>
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────────── */}
      <section style={{ padding: `${secPy} ${px}`, background: C.bg2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <F style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel center>Philosophy</SectionLabel>
          <blockquote style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: mobile ? "clamp(20px,5vw,28px)" : "clamp(22px,3vw,34px)",
            fontWeight: 300, fontStyle: "italic",
            lineHeight: 1.55, color: C.white, marginBottom: 32,
          }}>
            "Real estate is not just about bricks and mortar — it's about building futures, creating legacies, and transforming aspirations into addresses."
          </blockquote>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 40 }}>
            <Line w={28} />
            <Chip>Payal Kar Dutta</Chip>
            <Line w={28} />
          </div>
        </F>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)",
          gap: 1, background: C.border, maxWidth: 1060, margin: "0 auto",
        }}>
          {[
            { title: "Trust",      desc: "Every relationship built on complete transparency and integrity." },
            { title: "Excellence", desc: "Setting benchmarks that redefine real estate advisory in India." },
            { title: "Legacy",     desc: "Creating value engineered to endure across generations." },
          ].map((v, i) => (
            <F key={v.title} d={mobile ? 0 : i * 80}>
              <div style={{ background: C.bg2, padding: mobile ? "36px 28px" : "44px 32px", textAlign: "center" }}>
                <div style={{ width: 20, height: 1, background: C.gold, opacity: 0.6, margin: "0 auto 18px" }} />
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.white, fontWeight: 400, marginBottom: 10 }}>{v.title}</div>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: C.muted }}>{v.desc}</div>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ── JOURNEY ───────────────────────────────────────── */}
      <section id="journey" style={{ padding: `${secPy} ${px}`, maxWidth: 1060, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 48 : 80, alignItems: "start",
        }}>
          <div style={mobile ? {} : { position: "sticky", top: 110 }}>
            <F>
              <SectionLabel>Leadership Journey</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.white, marginBottom: 4 }}>A Decade of</h2>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.gold, marginBottom: 28 }}>Distinction</h2>
              <div style={{ padding: "18px 20px", borderLeft: `1.5px solid ${C.gold}`, background: "rgba(184,149,106,0.04)" }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: C.text, fontStyle: "italic", lineHeight: 1.8 }}>
                  "The most powerful investment is understanding the market before the market understands itself."
                </p>
                <div style={{ fontSize: 8, color: C.gold, letterSpacing: 4, marginTop: 10, textTransform: "uppercase" }}>— Payal Kar Dutta</div>
              </div>
            </F>
          </div>

          <div style={{ paddingTop: 4 }}>
            {[
              { year: "2014", title: "Entering the Arena",   desc: "Began her real estate career in Hyderabad, building a reputation for market acumen and a client-first approach." },
              { year: "2018", title: "Founding Veva Realty", desc: "Launched Veva Realty to bring world-class advisory standards to Indian real estate. Expanded rapidly across Hyderabad's premium corridors." },
              { year: "2020", title: "VSpaces by Veva",      desc: "Launched VSpaces — a curated platform for ultra-premium residential and commercial clients." },
              { year: "2022", title: "Multi-City Expansion", desc: "Expanded to Bengaluru and Kolkata. Partnered with Godrej Properties, Sattva Group, and TVS Emerald." },
              { year: "2024", title: "Industry Recognition", desc: "Recognised as one of India's most influential real estate leaders and a mentor shaping the next generation.", last: true },
            ].map((item, i) => {
              const [ref, on] = useFade();
              return (
                <div ref={ref} key={item.year} style={{ display: "flex", gap: 22, marginBottom: item.last ? 0 : 40 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 16 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      border: `1.5px solid ${on ? C.gold : C.dim}`,
                      background: on ? C.gold : "transparent",
                      flexShrink: 0, marginTop: 5,
                      transition: "all 0.5s ease",
                    }} />
                    {!item.last && <div style={{ width: 1, flex: 1, background: `linear-gradient(${C.border}, transparent)`, marginTop: 8 }} />}
                  </div>
                  <div style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "none" : "translateY(10px)",
                    transition: `opacity 0.7s ease ${i * 60}ms, transform 0.7s ease ${i * 60}ms`,
                    paddingBottom: 8,
                  }}>
                    <div style={{ fontSize: 8, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 6 }}>{item.year}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.white, fontWeight: 400, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.85, color: C.muted }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section id="services" style={{ padding: `${secPy} ${px}`, background: C.bg2, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <F style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel center>Expertise</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, color: C.white }}>Strategic Services</h2>
          </F>

          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)",
            gap: 1, background: C.border,
          }}>
            {[
              ["🏛","Residential Advisory","Curated homes across Hyderabad's most prestigious addresses — Jubilee Hills, Kokapet, and beyond."],
              ["📐","Commercial Strategy","Data-driven advisory for premium office spaces and high-yield assets in India's top IT corridors."],
              ["📈","Investment Advisory","Portfolio-level strategy for HNIs building diversified real estate assets with strong returns."],
              ["🌐","NRI Services","Specialised guidance for the Indian diaspora navigating regulatory frameworks and prime opportunities."],
              ["🤝","Developer Partnerships","Alliance with Godrej, Sattva, TVS Emerald — clients access the finest inventory before public launch."],
              ["🎓","Mentorship","Empowering aspiring real estate professionals through structured guidance and thought leadership."],
            ].map(([icon, title, desc], i) => {
              const [hov, setHov] = useState(false);
              return (
                <F key={title} d={mobile ? 0 : i * 55}>
                  <div
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      padding: mobile ? "28px 24px" : "34px 28px",
                      background: hov ? C.bg : C.bg2,
                      borderBottom: `1.5px solid ${hov ? C.gold : "transparent"}`,
                      transition: "all 0.3s ease",

                      height: "100%", // ADD THIS
                      display: "flex", // ADD THIS
                      flexDirection: "column", // ADD THIS
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 14 }}>{icon}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: C.white, fontWeight: 400, marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: C.muted }}>{desc}</div>
                  </div>
                </F>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section style={{ padding: `${secPy} ${px}`, maxWidth: 1060, margin: "0 auto" }}>
        <F style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel center>Testimonials</SectionLabel>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, color: C.white }}>Words of Trust</h2>
        </F>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)",
          gap: mobile ? 16 : 12,
        }}>
          {[
            ["Payal's guidance transformed my investment approach. Her market insights are unparalleled.", "Rahul Mehta", "Entrepreneur, Hyderabad"],
            ["Working with Veva Realty was a masterclass in professionalism. Exceeded every expectation.", "Priya Shankar", "Tech Executive, Bengaluru"],
            ["Her strategic vision helped our family make the best financial decision of our lives.", "Vikram Das", "NRI Investor, Dubai"],
          ].map(([q,n,r], i) => (
            <F key={n} d={mobile ? 0 : i * 80}>
              <div style={{
                padding: "28px 24px",
                border: `1px solid ${C.border}`,
                borderTop: `1.5px solid ${C.gold}`,
                background: C.bg2,
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[...Array(5)].map((_,j) => (
                    <svg key={j} width="10" height="10" viewBox="0 0 10 10">
                      <polygon points="5,1 6.2,3.8 9,4.1 7,6 7.6,9 5,7.5 2.4,9 3,6 1,4.1 3.8,3.8" fill={C.gold} />
                    </svg>
                  ))}
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontStyle: "italic", lineHeight: 1.9, color: C.text, marginBottom: 20 }}>"{q}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(184,149,106,0.1)", border: `1px solid rgba(184,149,106,0.25)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: C.gold, fontWeight: 500,
                  }}>{n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div>
                    <div style={{ fontSize: 12, color: C.white, fontWeight: 400 }}>{n}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{r}</div>
                  </div>
                </div>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ── CONNECT ───────────────────────────────────────── */}
      <section id="connect" style={{ padding: `${secPy} ${px}`, background: C.bg2, borderTop: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 1060, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 52 : 80, alignItems: "start",
        }}>
          <F>
            <SectionLabel>Connect</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.white, marginBottom: 4 }}>Begin Your</h2>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 36 : 42, fontWeight: 300, lineHeight: 1.1, color: C.gold, marginBottom: 24 }}>Property Journey</h2>
            <div style={{ width: 40, height: 1, background: C.border, marginBottom: 24 }} />
            <p style={{ fontSize: 13, lineHeight: 1.95, color: C.muted, fontWeight: 300, marginBottom: 36 }}>
              Whether seeking a dream home, a high-yield investment, or strategic commercial space — Payal and the Veva Realty team are ready to guide you.
            </p>
            {[["Location","Hyderabad, Telangana, India"],["Email","payal@vevarealty.com"],["Company","Veva Realty · VSpaces by Veva"]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 1.5, minHeight: 34, background: `linear-gradient(${C.gold}, transparent)`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 12, color: C.text }}>{v}</div>
                </div>
              </div>
            ))}
          </F>

          <F d={mobile ? 0 : 120}>
            {sent ? (
              <div style={{ border: `1px solid ${C.border}`, borderTop: `1.5px solid ${C.gold}`, padding: "56px 32px", textAlign: "center", background: C.bg }}>
                <div style={{ color: C.gold, fontSize: 26, marginBottom: 14 }}>✦</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: C.white, marginBottom: 10 }}>Message Received</h3>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>Payal's team will reach out within 24 hours.</p>
              </div>
            ) : (
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderTop: `1.5px solid ${C.gold}`, padding: mobile ? "32px 24px" : "36px 32px" }}>
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { id: "name",  label: "Full Name",     type: "text",  ph: "Your full name" },
                    { id: "email", label: "Email Address", type: "email", ph: "your@email.com" },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ display: "block", fontSize: 7, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 7 }}>{f.label}</label>
                      <input type={f.type} required placeholder={f.ph}
                        value={form[f.id]}
                        onChange={e => setForm({ ...form, [f.id]: e.target.value })}
                        style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, padding: "10px 13px", color: C.text, fontSize: 12, outline: "none", transition: "border-color 0.25s" }}
                        onFocus={e => e.target.style.borderColor = "rgba(184,149,106,0.5)"}
                        onBlur={e => e.target.style.borderColor = C.border}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 7, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 7 }}>Message</label>
                    <textarea required rows={4} placeholder="How can we assist you?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, padding: "10px 13px", color: C.text, fontSize: 12, outline: "none", resize: "vertical", transition: "border-color 0.25s" }}
                      onFocus={e => e.target.style.borderColor = "rgba(184,149,106,0.5)"}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                  <button type="submit" style={{
                    background: C.gold, border: "none", color: "#0D1117",
                    fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                    padding: "12px 26px", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif", fontWeight: 500,
                    transition: "background 0.3s", alignSelf: "flex-start",
                  }}
                    onMouseEnter={e => e.target.style.background = "#ccaa7a"}
                    onMouseLeave={e => e.target.style.background = C.gold}
                  >Send Message</button>
                  <div style={{ padding: "11px 14px", background: "rgba(184,149,106,0.04)", border: `1px solid rgba(184,149,106,0.1)`, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14 }}>📅</span>
                    <div>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Prefer a direct meeting?</div>
                      <a href="https://calendly.com" target="_blank" rel="noreferrer"
                        style={{ fontSize: 8, letterSpacing: 3, color: C.gold, textTransform: "uppercase" }}>
                        Book via Calendly →
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </F>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{
        padding: mobile ? "28px 24px" : "28px 56px",
        borderTop: `1px solid ${C.border}`, background: C.bg,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: C.text, letterSpacing: 1 }}>Payal Kar Dutta</div>
          <div style={{ fontSize: 7, color: C.dim, letterSpacing: 3, marginTop: 3, textTransform: "uppercase" }}>© 2025 · All Rights Reserved</div>
        </div>
        <div style={{ display: "flex", gap: mobile ? 20 : 28, flexWrap: "wrap" }}>
          {[["Veva Realty","https://vevarealty.com"],["VSpaces","https://vspacesbyveva.com"],["LinkedIn","#"],["Instagram","#"]].map(([l,u]) => (
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontSize: 8, color: C.dim, letterSpacing: 3, textTransform: "uppercase", transition: "color 0.25s" }}
              onMouseEnter={e => e.target.style.color = C.gold}
              onMouseLeave={e => e.target.style.color = C.dim}
            >{l}</a>
          ))}
        </div>
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Line w={18} />
            <span style={{ fontSize: 7, color: C.dim, letterSpacing: 4, textTransform: "uppercase" }}>Veva Realty Group</span>
          </div>
        )}
      </footer>
    </div>
  );
}
