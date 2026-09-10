import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  Minus,
  Phone,
  MapPin,
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  MessageCircle,
  Share2
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES, RESTAURANT_INFO as info } from './data/restaurantData';
import type { MenuItem } from './types';

const dishes: MenuItem[] = MENU_ITEMS;

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    title: 'Mesquite-Fired Rib-Eye & Clay Pot Beans',
    alt: 'Grilled steak and traditional Mexican clay pottery charro beans'
  },
  {
    src: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    title: '$5 Tacos al Carbón',
    alt: 'Hand-pressed tacos al carbón with fresh cilantro, onions, and lime'
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    title: 'Covered Pergola & Lawn Patio',
    alt: 'Outdoor covered pergola patio with green lawn and string festoon lights'
  },
  {
    src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    title: 'Craft Margarita Flight & Cantina',
    alt: 'Artisan agave margarita flight served with fresh citrus'
  }
];

type Choice = {
  id: string;
  name: string;
  price: number;
  option: string;
  note: string;
  quantity: number;
};

type Panel = 'reserve' | 'cart' | 'dish' | 'gallery' | 'catering' | null;

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

function Brand() {
  return (
    <span className="brand-name">
      EL ASADOR
      <small>MARGARITA RANCH GRILL</small>
    </span>
  );
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [category, setCategory] = useState('asador');
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<MenuItem>(dishes[0]);
  const [option, setOption] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(0);
  const [cart, setCart] = useState<Choice[]>([]);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const dialog = useRef<HTMLDialogElement>(null);

  const count = cart.reduce((sum, x) => sum + x.quantity, 0);
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  const visible = dishes.filter(
    (x) =>
      (query ? true : x.category === category) &&
      (x.name + ' ' + x.description + ' ' + (x.spanishName || ''))
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el || !panel) return;
    const previous = document.activeElement as HTMLElement;
    el.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      el.close();
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [panel]);

  useEffect(() => {
    if (!navOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
        document.getElementById('nav-toggle')?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [navOpen]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  function choose(dish: MenuItem) {
    setSelected(dish);
    setOption(dish.options?.[0] || '');
    setNote('');
    setPanel('dish');
  }

  function add() {
    const key = selected.id + '|' + option + '|' + note.trim();
    setCart((prev) =>
      prev.some((x) => x.id === key)
        ? prev.map((x) => (x.id === key ? { ...x, quantity: x.quantity + 1 } : x))
        : [
            ...prev,
            {
              id: key,
              name: selected.name,
              price: selected.price,
              option,
              note: note.trim(),
              quantity: 1,
            },
          ]
    );
    setCopied(false);
    setPanel(null);
    setMessage('Added to your pickup list. Call to place your order.');
  }

  function quantity(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, quantity: x.quantity + delta } : x))
        .filter((x) => x.quantity > 0)
    );
    setCopied(false);
  }

  async function copyList() {
    try {
      await navigator.clipboard.writeText(
        cart
          .map(
            (x) =>
              x.quantity +
              ' × ' +
              x.name +
              (x.option ? ' — ' + x.option : '') +
              (x.note ? ' (' + x.note + ')' : '')
          )
          .join('\n') +
          '\nEstimated subtotal: ' +
          money(subtotal) +
          '\nOrder for El Asador Margarita Ranch Grill'
      );
      setCopied(true);
    } catch {
      setMessage('Copy is unavailable here. Your list is displayed for your call.');
    }
  }

  const closeNav = () => setNavOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* HEADER */}
      <header className="site-header">
        <a href="#home" className="brand" aria-label="El Asador home" onClick={closeNav}>
          <Brand />
        </a>

        <nav
          aria-label="Main navigation"
          className={navOpen ? 'main-nav expanded' : 'main-nav'}
          id="main-nav"
        >
          <a href="#menu" onClick={closeNav}>
            The menu
          </a>
          <a href="#story" onClick={closeNav}>
            Our story
          </a>
          <a href="#experience" onClick={closeNav}>
            The experience
          </a>
          <a href="#visit" onClick={closeNav}>
            Find us
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="bag-button"
            aria-label={'Pickup list, ' + count + ' items'}
            onClick={() => setPanel('cart')}
          >
            <ShoppingBag size={20} />
            <span>{count}</span>
          </button>
          <button
            className="button small header-book"
            onClick={() => setPanel('reserve')}
          >
            Plan a visit <ArrowUpRight size={16} />
          </button>
          <button
            className="nav-toggle"
            id="nav-toggle"
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={navOpen}
            aria-controls="main-nav"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-image"
            srcSet="/images/grill-mobile.webp 800w, /images/grill.webp 1800w"
            sizes="100vw"
            src="/images/grill.webp"
            alt="Mesquite wood-fired grill with sizzled steaks and charro beans"
            fetchPriority="high"
            width="1800"
            height="1200"
          />
          <div className="hero-shade" />

          <div className="hero-content">
            <p className="eyebrow light">
              <span /> EAST AUSTIN, TEXAS <span />
            </p>
            <h1 id="hero-title">
              True Mesquite Fire.
              <br />
              <em>Authentic Ranch Grill.</em>
            </h1>
            <p className="hero-description">
              Tamaulipas-style wood-fired barbecue, $5 tacos al carbón,
              <br />
              and handcrafted margaritas beneath our covered pergola patio.
            </p>
            <div className="hero-buttons">
              <a className="button" href="#menu">
                Explore the menu <ArrowUpRight size={18} />
              </a>
              <button
                className="button outline-button"
                onClick={() => setPanel('reserve')}
              >
                Reservations & visits
              </button>
            </div>
          </div>

          <div className="hero-bottom">
            <span>EL ASADOR · MARGARITA RANCH GRILL</span>
            <a href="#signatures">
              PULL UP A CHAIR <ArrowDown size={17} />
            </a>
            <span>2617 E 7TH ST, AUSTIN</span>
          </div>
        </section>

        {/* BRAND RIBBON */}
        <div className="ribbon">
          <span>DEL ASADOR A TU MESA</span>
          <span aria-hidden="true">✳</span>
          <span>FROM THE GRILL TO YOUR TABLE</span>
          <span aria-hidden="true">✳</span>
          <span>EAST AUSTIN, TEXAS</span>
        </div>

        {/* 01 / SIGNATURES */}
        <section className="section signatures" id="signatures">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / A TASTE OF EL ASADOR</p>
              <h2>
                Start with
                <br />
                <em>something smoky.</em>
              </h2>
            </div>
            <div className="heading-aside">
              <p>
                Generous mesquite platters, $5 tacos al carbón,
                <br />
                and complimentary clay pot charro beans.
              </p>
              <a className="text-link" href="#menu">
                See the full menu <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="signature-grid">
            <article className="signature-card" key="sig-1">
              <button
                className="dish-photo"
                aria-label="View Rib-Eye Steak Premium Platter"
                onClick={() => choose(dishes[0])}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
                  alt="Mesquite-grilled Rib-Eye Steak Platter"
                  width="900"
                  height="700"
                  loading="lazy"
                />
                <span className="photo-number">01</span>
                <span className="photo-action">
                  <ArrowUpRight />
                </span>
              </button>
              <div className="dish-title">
                <h3>Rib-Eye Steak Premium</h3>
                <span>$25.00</span>
              </div>
              <p>
                Prime cut rib-eye charbroiled over Texas mesquite hardwood. Served in traditional Mexican clay pottery with charro beans, rice, and cebollitas.
              </p>
            </article>

            <article className="signature-card" key="sig-2">
              <button
                className="dish-photo"
                aria-label="View Tacos al Carbón"
                onClick={() => choose(dishes.find((d) => d.id === 'taco-ribeye') || dishes[5])}
              >
                <img
                  src="/images/tacos.webp"
                  alt="Fresh tacos al carbón with lime"
                  width="900"
                  height="700"
                  loading="lazy"
                />
                <span className="photo-number">02</span>
                <span className="photo-action">
                  <ArrowUpRight />
                </span>
              </button>
              <div className="dish-title">
                <h3>Tacos al Carbón</h3>
                <span>$5.00 / ea</span>
              </div>
              <p>
                Fresh hand-pressed tortillas loaded with your choice of mesquite rib-eye, skirt steak, or trompo pork with fresh cilantro and charred onions.
              </p>
            </article>

            <article className="signature-card" key="sig-3">
              <button
                className="dish-photo"
                aria-label="View Skirt Steak Platter"
                onClick={() => choose(dishes.find((d) => d.id === 'skirt-steak-platter') || dishes[2])}
              >
                <img
                  src="/images/platter.webp"
                  alt="Skirt steak platter with grilled cebollitas"
                  width="900"
                  height="700"
                  loading="lazy"
                />
                <span className="photo-number">03</span>
                <span className="photo-action">
                  <ArrowUpRight />
                </span>
              </button>
              <div className="dish-title">
                <h3>Skirt Steak Platter (Arrachera)</h3>
                <span>$22.00</span>
              </div>
              <p>
                Citrus-marinated skirt steak seared over glowing Texas mesquite coals. Served with hot frijoles charros, rice, and roasted chiles toreados.
              </p>
            </article>
          </div>
        </section>

        {/* 02 / OUR STORY */}
        <section className="story section" id="story">
          <div className="story-title">
            <p className="eyebrow">02 / ROOTED IN THE ASADOR</p>
            <h2>
              Mexican soul.
              <br />
              <em>Austin spirit.</em>
            </h2>
          </div>
          <div className="story-copy">
            <p className="large-copy">
              There’s something extraordinary about a meal gathered around live embers.
            </p>
            <p>
              El Asador Margarita Ranch Grill brings true Tamaulipas-style wood-fired barbecue to East Austin. The name puts the asador—the live mesquite hearth—at the center of every cut of steak, taco, and sizzling platter.
            </p>
            <p>
              Find us on East 7th Street. Pull up a chair under our covered pergola patio, enjoy an ice-cold margarita flight, and experience genuine ranch hospitality.
            </p>
            <a className="text-link" href="#visit">
              Come find us <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        {/* 03 / THE MENU */}
        <section className="menu-section section" id="menu">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / BUEN PROVECHO</p>
              <h2>
                Find your
                <br />
                <em>next favorite.</em>
              </h2>
            </div>
            <p className="menu-intro">
              Browse our complete wood-fired menu and build your pickup list.
              <br />
              Call the restaurant directly to order.
            </p>
          </div>

          <div className="menu-controls">
            <div className="category-list" aria-label="Menu categories">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  aria-pressed={category === cat.id && !query}
                  onClick={() => {
                    setCategory(cat.id);
                    setQuery('');
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <label className="search">
              <Search size={18} />
              <span className="sr-only">Search menu</span>
              <input
                type="search"
                placeholder="Search steaks, tacos, drinks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="menu-list" aria-live="polite">
            {visible.map((dish) => (
              <article className="menu-item" key={dish.id}>
                <div>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                </div>
                <div className="menu-price">
                  <span>{money(dish.price)}</span>
                  <button
                    aria-label={'Add ' + dish.name + ' to pickup list'}
                    onClick={() => choose(dish)}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </article>
            ))}

            {visible.length === 0 && (
              <div className="empty">
                <h3>No dishes found.</h3>
                <p>Try searching for “ribeye”, “tacos”, or “margarita”.</p>
                <button className="text-link" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            )}
          </div>

          <div className="menu-foot">
            <p>
              Complimentary 12-hour clay pot charro beans and warm tortillas included with all entrée platters.
            </p>
            <button className="text-link" onClick={() => setPanel('cart')}>
              Your pickup list ({count}) <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* 04 / THE EXPERIENCE (ATMOSPHERE INSPIRATION) */}
        <section className="experience" id="experience">
          <div className="experience-photo">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Outdoor covered pergola patio with green artificial turf lawn and warm string lights"
              loading="lazy"
              width="1200"
              height="900"
            />
            <span>OUTDOOR PERGOLA PATIO · EAST AUSTIN VIBE</span>
          </div>

          <div className="experience-copy">
            <p className="eyebrow light">04 / STAY A LITTLE LONGER</p>
            <h2>
              For the food.
              <br />
              <em>For the company.</em>
            </h2>
            <p>
              Dine outdoors beneath our covered cedar pergola patio set over lush green turf lawn with rustic wooden picnic tables and warm evening festoon lighting.
            </p>
            <p>
              Sizzling carnes asadas served in artisanal Mexican clay pottery (<em>platos y cazuelas de barro</em>), cold margarita flights, and genuine ranch spirit on East 7th Street.
            </p>
            <button className="button cream" onClick={() => setPanel('reserve')}>
              Plan your visit <ArrowUpRight size={18} />
            </button>
            <button
              className="text-link light-link"
              onClick={() => setPanel('catering')}
            >
              Groups & parrillada catering <ArrowUpRight size={18} />
            </button>
          </div>
        </section>

        {/* 05 / GALLERY */}
        <section className="section gallery-section" id="gallery">
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 / A LITTLE APPETITE INSPIRATION</p>
              <h2>
                Fire. Flavor. <em>Feeling.</em>
              </h2>
            </div>
            <p className="heading-aside">
              Explore the gallery.
              <br />A visual taste of our grill and cantina.
            </p>
          </div>

          <div className="gallery-grid">
            {photos.map((p, i) => (
              <button
                key={p.src}
                onClick={() => {
                  setPhoto(i);
                  setPanel('gallery');
                }}
                aria-label={'Open photo: ' + p.title}
              >
                <img src={p.src} alt={p.alt} loading="lazy" width="800" height="700" />
                <span>
                  {p.title}
                  <Plus size={18} />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 06 / VISIT SECTION */}
        <section className="visit section" id="visit">
          <div className="visit-intro">
            <p className="eyebrow">06 / YOUR TABLE STARTS HERE</p>
            <h2>
              Come hungry.
              <br />
              <em>Find us on 7th.</em>
            </h2>
            <address>
              {info.address}
              <br />
              {info.city}, {info.state} {info.zip}
            </address>
            <a
              className="button"
              href={info.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowUpRight size={18} />
            </a>
            <a className="phone-link" href={'tel:' + info.rawPhone}>
              <Phone size={17} />
              {info.phone}
            </a>
          </div>

          <div className="hours">
            <h3>Make time for a good meal.</h3>
            <p className="caption">Austin, TX · Central Time</p>
            <dl>
              {info.hours.map((h) => (
                <div key={h.day}>
                  <dt>{h.day}</dt>
                  <dd className={h.closed ? 'text-red-700 font-bold' : ''}>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="visit-note">
            <MapPin size={26} />
            <h3>
              East Austin,
              <br />
              through and through.
            </h3>
            <p>
              2617 East 7th Street.
              <br />
              Free on-site parking available.
            </p>
            <a
              className="text-link"
              href={info.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Google Maps <ArrowUpRight size={18} />
            </a>
            <hr />
            <p>Planning a gathering or picking up your order?</p>
            <button className="text-link" onClick={() => setPanel('reserve')}>
              Talk to the restaurant <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <a href="#home" className="brand">
            <Brand />
          </a>
          <p>Authentic Tamaulipas-style mesquite firewood barbecue & cantina.</p>
          <a href="#home" className="text-link">
            Back to top <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} El Asador Margarita Ranch Grill</span>
          <nav aria-label="Footer navigation">
            <a href="#menu">Menu</a>
            <a href="#visit">Hours & contact</a>
            <a href="#gallery">Gallery</a>
            <a href={info.socials?.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={info.socials?.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          </nav>
          <span>EAST AUSTIN, TEXAS</span>
        </div>
      </footer>

      {/* MOBILE FLOATING ACTIONS */}
      <div className="mobile-actions">
        <a href="#menu">View menu</a>
        <button onClick={() => setPanel('reserve')}>
          Plan a visit <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="toast" role="status">
        {message}
      </div>

      {/* INTERACTIVE MODAL DIALOGS */}
      <dialog
        ref={dialog}
        className={panel === 'gallery' ? 'modal photo-modal' : 'modal'}
        aria-labelledby="dialog-title"
        onCancel={() => setPanel(null)}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.target === e.currentTarget &&
            (e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom)
          )
            setPanel(null);
        }}
        onKeyDown={(e) => {
          if (panel === 'gallery' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            e.preventDefault();
            setPhoto((i) =>
              (i + (e.key === 'ArrowRight' ? 1 : photos.length - 1)) % photos.length
            );
          }
        }}
      >
        <button
          className="close-modal"
          aria-label="Close dialog"
          onClick={() => setPanel(null)}
        >
          <X />
        </button>

        {/* RESERVE / CATERING MODAL */}
        {(panel === 'reserve' || panel === 'catering') && (
          <>
            <p className="eyebrow">LET’S GET TOGETHER</p>
            <h2 id="dialog-title">
              {panel === 'catering' ? 'Bring your people.' : 'Pull up a chair.'}
            </h2>
            <p>
              {panel === 'catering'
                ? 'Call us to arrange group visits, custom parrillada catering setups, and table reservations.'
                : 'Call the restaurant directly to inquire about seating, patio availability, and today’s specials.'}
            </p>
            <div className="call-card">
              <Phone />
              <a href={'tel:' + info.rawPhone}>{info.phone}</a>
              <span>{info.fullAddress}</span>
            </div>
            <a className="button" href={'tel:' + info.rawPhone}>
              Call the restaurant <ArrowUpRight size={18} />
            </a>
            <a
              className="text-link"
              href={info.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Google Maps Location <ArrowUpRight size={16} />
            </a>
          </>
        )}

        {/* ADD DISH TO PICKUP LIST MODAL */}
        {panel === 'dish' && (
          <>
            <p className="eyebrow">ADD TO YOUR PICKUP LIST</p>
            <h2 id="dialog-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
            >
              {selected.options && (
                <label className="field">
                  Your preference
                  <select
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                  >
                    {selected.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="field">
                Notes for your order <span className="caption">Optional</span>
                <textarea
                  maxLength={250}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any preferences or dietary requests?"
                />
              </label>
              <button className="button" type="submit">
                Add to list · {money(selected.price)} <Plus size={18} />
              </button>
            </form>
          </>
        )}

        {/* PICKUP CART MODAL */}
        {panel === 'cart' && (
          <>
            <p className="eyebrow">GOOD THINGS TO TAKE HOME</p>
            <h2 id="dialog-title">Your pickup list.</h2>
            {cart.length === 0 ? (
              <div className="empty">
                <ShoppingBag size={36} />
                <p>Your list is waiting for something delicious.</p>
                <a
                  className="button"
                  href="#menu"
                  onClick={() => setPanel(null)}
                >
                  Explore the menu <ArrowRight size={18} />
                </a>
              </div>
            ) : (
              <>
                <p>
                  Your list is ready for your call to El Asador.
                </p>
                <div className="cart-items">
                  {cart.map((x) => (
                    <div className="cart-item" key={x.id}>
                      <h3>{x.name}</h3>
                      <p>{x.option}{x.note ? ' · ' + x.note : ''}</p>
                      <div className="cart-row">
                        <div className="quantity">
                          <button
                            aria-label={'Decrease ' + x.name}
                            onClick={() => quantity(x.id, -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{x.quantity}</span>
                          <button
                            aria-label={'Increase ' + x.name}
                            onClick={() => quantity(x.id, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span>{money(x.price * x.quantity)}</span>
                        <button
                          className="remove"
                          onClick={() => {
                            setCart((prev) => prev.filter((y) => y.id !== x.id));
                            setCopied(false);
                          }}
                        >
                          Remove<span className="sr-only"> {x.name}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="subtotal">
                  <span>Estimated subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <div className="dialog-actions">
                  <a className="button" href={'tel:' + info.rawPhone}>
                    Call to order <Phone size={18} />
                  </a>
                  <button
                    className="button secondary"
                    onClick={copyList}
                  >
                    {copied ? 'List copied!' : 'Copy my list'}
                  </button>
                </div>
                <p className="caption">
                  {info.phone} · 2617 E 7th St, Austin, TX
                </p>
              </>
            )}
          </>
        )}

        {/* GALLERY LIGHTBOX MODAL */}
        {panel === 'gallery' && (
          <>
            <h2 id="dialog-title" className="sr-only">
              {photos[photo].title}
            </h2>
            <img
              className="lightbox-image"
              src={photos[photo].src}
              alt={photos[photo].alt}
            />
            <div className="gallery-caption">
              <button
                aria-label="Previous photo"
                onClick={() =>
                  setPhoto((photo + photos.length - 1) % photos.length)
                }
              >
                <ChevronLeft />
              </button>
              <div>
                <strong>{photos[photo].title}</strong>
                <p>
                  {photo + 1} / {photos.length}
                </p>
              </div>
              <button
                aria-label="Next photo"
                onClick={() => setPhoto((photo + 1) % photos.length)}
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
