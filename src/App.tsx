import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Path } from './components/Path';
import { Contact } from './components/Contact';
import { marqueeTop, marqueeBottom } from './content';

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee direction="left" rows={[marqueeTop, marqueeBottom]} />
        <About />
        <Projects />
        <Marquee direction="right" rows={[marqueeBottom, marqueeTop]} />
        <Path />
        <Contact />
      </main>
      <Preloader />
    </>
  );
}
