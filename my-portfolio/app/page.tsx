// app/page.tsx
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Navbar />

      <main>
        <div className="site-container">
          <Hero />
        </div>

        <div className="site-container section" id="projects">
          <Projects />
        </div>

        <div className="site-container section" id="experience">
          <Experience />
        </div>

        <div className="site-container section" id="contact">
          <Contact />
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
