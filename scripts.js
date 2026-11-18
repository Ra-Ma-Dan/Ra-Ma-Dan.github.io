document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 2. Mobile Navigation
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = navLinks.querySelectorAll('a');

  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navAnchors.forEach(a => a.addEventListener('click', closeMenu));

  // 3. Active Section Highlighting
  const sections = document.querySelectorAll('main section[id]');
  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach(sec => navObserver.observe(sec));

  // 4. Scroll Reveal
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 5. Project Domain Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      projectCards.forEach(card => {
        const cats = card.dataset.categories.split(' ');
        card.classList.toggle('hidden', !(filter === 'all' || cats.includes(filter)));
      });
    });
  });

  // 6. SVG Block Diagram Helper & Technical Brief Data
  function buildSvgBox(x, y, w, h, title, sub, accent = '#22d3ee') {
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#0f172a" stroke="${accent}" stroke-width="1.4" />
      <text x="${x + w / 2}" y="${y + 24}" fill="#f1f5f9" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" text-anchor="middle">${title}</text>
      <text x="${x + w / 2}" y="${y + 41}" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="9.5" text-anchor="middle">${sub}</text>
    `;
  }

  function buildSvgLink(x1, y1, x2, y2, label, lx, ly) {
    return `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="4 3" />
      <text x="${lx}" y="${ly}" fill="#22d3ee" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">${label}</text>
    `;
  }

  const PROJECT_DATA = {
    rcemr: {
      title: 'Remote Controlled Environmental Monitoring Rover (RCEMR)',
      category: 'Robotics • Embedded Systems • Environmental Monitoring',
      statusText: 'Concept / Development Planning',
      statusClass: 'status-concept',
      diagram: `
        <svg viewBox="0 0 640 155" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RCEMR conceptual system block diagram">
          ${buildSvgBox(16, 46, 130, 56, 'WI-FI ROUTER', 'Remote Internet Link', '#10b981')}
          ${buildSvgLink(146, 74, 214, 74, 'Wi-Fi', 180, 66)}
          ${buildSvgBox(214, 46, 165, 56, 'MOBILE ROVER', 'MCU + Battery + Drive')}
          ${buildSvgLink(379, 64, 468, 64, 'LoRa (Undocked)', 423, 56)}
          ${buildSvgLink(379, 86, 468, 86, 'UART (Docked)', 423, 100)}
          ${buildSvgBox(468, 46, 156, 56, 'SENSOR POD', 'MCU + Battery + Sensors', '#f59e0b')}
        </svg>
      `,
      overview:
        'A land-based rover concept built around a modular split between a mobile carrier and a detachable environmental sensor pod, enabling flexible remote sensing and command handling.',
      highlights: [
        'Independent microcontrollers, batteries, and LoRa radios on both the rover and detachable sensor pod.',
        'Wi-Fi router bridges remote operator control and telemetry access over the internet.',
        'Wired UART link handles direct data/command transfer when the sensor pod is docked.',
        'Core design concerns: modular mechanical/electrical architecture, power management, and wireless link reliability.'
      ],
      boundary: '',
      evidence: '[ADD: Schematic / Block Diagram, Rover Hardware Photos, GitHub Repo & Bench Logs]'
    },
    p2p: {
      title: 'Peer-to-Peer Community Energy Sharing Research',
      category: 'Alternative Energy • Power Systems • IoT',
      statusText: 'Research / Demonstrator Planning',
      statusClass: 'status-research',
      diagram: `
        <svg viewBox="0 0 640 175" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="P2P Community Energy Sharing conceptual diagram">
          ${buildSvgBox(16, 20, 140, 54, 'SOLAR + WIND', 'Shared Generation', '#10b981')}
          ${buildSvgLink(156, 47, 224, 47, 'DC/AC Bus', 190, 39)}
          ${buildSvgBox(224, 20, 172, 54, 'MINI-BUSBARS', 'Controlled Routing')}
          ${buildSvgLink(396, 47, 468, 47, 'LV Power', 432, 39)}
          ${buildSvgBox(468, 20, 156, 54, 'HOUSEHOLD NODES', 'Seller / Buyer + Sim')}
          ${buildSvgLink(546, 74, 546, 108, 'ESP-NOW', 582, 95)}
          ${buildSvgBox(224, 108, 398, 52, 'CENTRAL CONTROL-ROOM NODE', 'SoC / PV / Load Telemetry & Opt-In Export', '#22d3ee')}
        </svg>
      `,
      overview:
        'A community-scale energy architecture researching how shared solar-and-wind generation could route surplus energy across households via controlled mini-busbars with permission-based export.',
      highlights: [
        'Household nodes report state of charge (SoC), PV generation, and load demand to a central control-room node.',
        'Exporting is strictly permission-based: triggered only when a household opts in, surplus exists, and a buyer is active.',
        'Focuses on intelligent power routing, system coordination, and local continuity during grid outages.'
      ],
      boundary:
        'Low-cost student demonstrator scope: two physical household nodes (seller & buyer), a third household simulated in software, ESP-NOW telemetry, and low-voltage DC controls with an isolated small-scale AC demonstration. Not a grid-interconnection product.',
      evidence: '[ADD: Mini-Busbar Switching Schematic, ESP-NOW Test Logs & Research Documentation]'
    },
    wearable: {
      title: 'Personal Safety Wearable / Connected Safety Device',
      category: 'Embedded Systems • Wearables • IoT',
      statusText: 'Product Exploration / Architecture Research',
      statusClass: 'status-concept',
      diagram: `
        <svg viewBox="0 0 640 165" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Personal Safety Wearable conceptual block diagram">
          ${buildSvgBox(16, 20, 146, 52, 'SOS + MOTION', 'Button & IMU Trigger', '#f59e0b')}
          ${buildSvgBox(16, 94, 146, 52, 'BATTERY MGMT', 'Low-Power Supply', '#10b981')}
          ${buildSvgLink(162, 46, 232, 72, 'IRQ', 194, 50)}
          ${buildSvgLink(162, 120, 232, 90, 'PWR', 194, 114)}
          ${buildSvgBox(232, 52, 168, 58, 'LOW-POWER MCU', 'Core Safety Logic')}
          ${buildSvgLink(400, 68, 470, 46, 'UART', 435, 48)}
          ${buildSvgLink(400, 94, 470, 116, 'PWM', 435, 118)}
          ${buildSvgBox(470, 20, 154, 52, 'GPS + CELLULAR', 'Direct Alert & Location')}
          ${buildSvgBox(470, 94, 154, 52, 'HAPTIC MOTOR', 'Tactile Confirmation')}
        </svg>
      `,
      overview:
        'A safety-focused wearable concept exploring standalone emergency alerting, location reporting, and motion sensing without requiring a nearby smartphone.',
      highlights: [
        'Evaluates low-power microcontrollers, cellular modules, GPS receivers, motion sensors, and battery management.',
        'Haptic feedback provides discreet confirmation when SOS alerts are triggered.',
        'Design prioritizes practical affordability and standalone operation.'
      ],
      boundary: '',
      evidence: '[ADD: Power Budget Estimate, Component Selection Matrix & Enclosure Concept]'
    },
    techbridge: {
      title: 'AH TechBridge — PCB Fabrication & Procurement Platform',
      category: 'Engineering Services • PCB Procurement • Digital Platform',
      statusText: 'Website / Platform Initiation',
      statusClass: 'status-initiation',
      diagram: `
        <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AH TechBridge workflow diagram">
          ${buildSvgBox(16, 46, 132, 56, 'CLIENT PORTAL', 'Accounts & Specs')}
          ${buildSvgLink(148, 74, 178, 74, '→', 163, 66)}
          ${buildSvgBox(178, 46, 142, 56, 'GERBER CHECK', 'Drill & Integrity', '#22d3ee')}
          ${buildSvgLink(320, 74, 350, 74, '→', 335, 66)}
          ${buildSvgBox(350, 46, 130, 56, 'DFM REVIEW', 'Human Engineer', '#f59e0b')}
          ${buildSvgLink(480, 74, 510, 74, '→', 495, 66)}
          ${buildSvgBox(510, 46, 114, 56, 'SUPPLIERS', 'Fab & Delivery', '#10b981')}
        </svg>
      `,
      overview:
        'An engineering-focused digital platform helping customers coordinate PCB fabrication and electronics procurement—initially serving Nigeria with longer-term ambitions for broader manufacturing access.',
      highlights: [
        'Combines automated Gerber and drill-file integrity validation with human design-for-manufacturing (DFM) review.',
        'Planned modules: customer accounts, PCB project records, manufacturing specifications, admin review, and supplier coordination.'
      ],
      boundary: '',
      evidence: '[ADD: Platform Wireframes, Gerber Validator Prototype & Live Site URL]'
    }
  };

  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalStatus = document.getElementById('modalStatus');
  const modalDiagram = document.getElementById('modalDiagram');
  const modalOverview = document.getElementById('modalOverview');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalBoundaryWrap = document.getElementById('modalBoundaryWrap');
  const modalBoundary = document.getElementById('modalBoundary');
  const modalEvidence = document.getElementById('modalEvidence');

  function openModal(key) {
    const data = PROJECT_DATA[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalStatus.textContent = data.statusText;
    modalStatus.className = `status-pill ${data.statusClass}`;
    modalDiagram.innerHTML = data.diagram;
    modalOverview.textContent = data.overview;

    modalHighlights.innerHTML = '';
    data.highlights.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      modalHighlights.appendChild(li);
    });

    if (data.boundary) {
      modalBoundaryWrap.style.display = 'block';
      modalBoundary.textContent = data.boundary;
    } else {
      modalBoundaryWrap.style.display = 'none';
    }

    modalEvidence.textContent = data.evidence;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.brief-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (navLinks.classList.contains('open')) closeMenu();
    }
  });

  // 7. Contact Form Handler (Replace YOUR_EMAIL@example.com before publishing)
  const PLACEHOLDER_EMAIL = 'YOUR_EMAIL@example.com';
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in your name, email, and message before submitting.';
      formStatus.classList.add('visible');
      return;
    }

    if (PLACEHOLDER_EMAIL === 'YOUR_EMAIL@example.com') {
      formStatus.textContent =
        'Preview mode: Replace YOUR_EMAIL@example.com in js/script.js (or connect Formspree) before deploying.';
      formStatus.classList.add('visible');
      return;
    }

    const subject = encodeURIComponent(`Engineering Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${PLACEHOLDER_EMAIL}?subject=${subject}&body=${body}`;
    formStatus.textContent = 'Opening your default email client with your prepared message.';
    formStatus.classList.add('visible');
  });
});

// // 7. Contact Form Handler (Real Email Delivery via Web3Forms)
//   const WEB3FORMS_KEY = 'PASTE_YOUR_ACCESS_KEY_HERE';
//   const contactForm = document.getElementById('contactForm');
//   const formStatus = document.getElementById('formStatus');
//   const submitBtn = contactForm.querySelector('button[type="submit"]');

//   contactForm.addEventListener('submit', async e => {
//     e.preventDefault();
//     const name = document.getElementById('senderName').value.trim();
//     const email = document.getElementById('senderEmail').value.trim();
//     const message = document.getElementById('senderMessage').value.trim();

//     if (!name || !email || !message) {
//       formStatus.textContent = 'Please fill in your name, email, and message before submitting.';
//       formStatus.classList.add('visible');
//       return;
//     }

//     if (WEB3FORMS_KEY === 'PASTE_YOUR_ACCESS_KEY_HERE') {
//       formStatus.textContent = 'Form key not set yet: paste your Web3Forms access key in js/script.js.';
//       formStatus.classList.add('visible');
//       return;
//     }

//     submitBtn.disabled = true;
//     submitBtn.textContent = 'Sending...';

//     try {
//       const response = await fetch('https://api.web3forms.com/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json'
//         },
//         body: JSON.stringify({
//           access_key: WEB3FORMS_KEY,
//           subject: `Engineering Portfolio Inquiry from ${name}`,
//           name,
//           email,
//           message
//         })
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         formStatus.textContent = 'Message sent successfully. Thank you for reaching out!';
//         contactForm.reset();
//       } else {
//         formStatus.textContent = result.message || 'Could not send message. Please try again.';
//       }
//     } catch (err) {
//       formStatus.textContent = 'Network error. Please check your connection or use the direct email link.';
//     } finally {
//       formStatus.classList.add('visible');
//       submitBtn.disabled = false;
//       submitBtn.textContent = 'Prepare Message →';
//     }
//   });
