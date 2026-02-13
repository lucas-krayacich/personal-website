/**
 * Interactive World Map
 * SVG-based map with highlighted visited countries
 */

(function() {
  'use strict';

  const mapContainer = document.getElementById('world-map');
  if (!mapContainer) return;

  // Countries visited (ISO 3166-1 alpha-2 codes)
  const visitedCountries = [
    'AT', // Austria
    'BS', // Bahamas
    'BQ', // Bonaire (Netherlands Caribbean)
    'CA', // Canada
    'US', // USA
    'HR', // Croatia
    'CZ', // Czechia
    'SK', // Slovakia
    'DO', // Dominican Republic
    'EC', // Ecuador
    'FR', // France
    'DE', // Germany
    'GR', // Greece
    'HU', // Hungary
    'IS', // Iceland
    'IE', // Ireland
    'IT', // Italy
    'JP', // Japan
    'LA', // Laos
    'MX', // Mexico
    'NL', // Netherlands
    'PE', // Peru
    'PL', // Poland
    'PT', // Portugal
    'ES', // Spain
    'CH', // Switzerland
    'GB', // UK
    'VN'  // Vietnam
  ];

  // Country names for tooltips
  const countryNames = {
    'AT': 'Austria', 'BS': 'Bahamas', 'BQ': 'Bonaire', 'CA': 'Canada',
    'US': 'United States', 'HR': 'Croatia', 'CZ': 'Czechia', 'SK': 'Slovakia',
    'DO': 'Dominican Republic', 'EC': 'Ecuador', 'FR': 'France', 'DE': 'Germany',
    'GR': 'Greece', 'HU': 'Hungary', 'IS': 'Iceland', 'IE': 'Ireland',
    'IT': 'Italy', 'JP': 'Japan', 'LA': 'Laos', 'MX': 'Mexico',
    'NL': 'Netherlands', 'PE': 'Peru', 'PL': 'Poland', 'PT': 'Portugal',
    'ES': 'Spain', 'CH': 'Switzerland', 'GB': 'United Kingdom', 'VN': 'Vietnam'
  };

  // Simplified world map SVG paths (key regions)
  const worldMapSVG = `
    <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e8e6e2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ddd9d4;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1000" height="500" fill="#faf9f7"/>

      <!-- North America -->
      <path id="CA" class="country" d="M120,50 L280,50 L300,80 L290,120 L250,140 L200,130 L150,100 L120,70 Z" />
      <path id="US" class="country" d="M130,140 L280,140 L290,180 L270,220 L200,230 L140,200 L120,160 Z" />
      <path id="MX" class="country" d="M140,220 L200,230 L210,280 L180,300 L140,280 L130,240 Z" />

      <!-- Caribbean -->
      <path id="BS" class="country" d="M260,200 L275,200 L275,215 L260,215 Z" />
      <path id="DO" class="country" d="M280,230 L300,230 L300,245 L280,245 Z" />
      <path id="BQ" class="country" d="M295,255 L305,255 L305,265 L295,265 Z" />

      <!-- South America -->
      <path id="EC" class="country" d="M200,320 L230,320 L235,360 L205,360 Z" />
      <path id="PE" class="country" d="M205,360 L240,360 L250,420 L210,420 Z" />

      <!-- Europe -->
      <path id="IS" class="country" d="M400,60 L440,60 L445,80 L400,85 Z" />
      <path id="IE" class="country" d="M420,110 L440,105 L445,125 L425,130 Z" />
      <path id="GB" class="country" d="M445,100 L470,95 L475,130 L450,135 Z" />
      <path id="NL" class="country" d="M480,105 L500,105 L500,120 L480,120 Z" />
      <path id="DE" class="country" d="M500,105 L540,105 L545,145 L505,150 Z" />
      <path id="PL" class="country" d="M545,100 L590,100 L595,140 L550,145 Z" />
      <path id="FR" class="country" d="M450,140 L500,135 L510,180 L460,185 Z" />
      <path id="CH" class="country" d="M490,160 L520,155 L525,175 L495,180 Z" />
      <path id="AT" class="country" d="M520,150 L560,145 L565,170 L525,175 Z" />
      <path id="CZ" class="country" d="M530,130 L565,125 L570,145 L535,150 Z" />
      <path id="SK" class="country" d="M565,130 L600,125 L605,145 L570,150 Z" />
      <path id="HU" class="country" d="M555,155 L595,150 L600,175 L560,180 Z" />
      <path id="PT" class="country" d="M415,175 L435,175 L435,210 L415,210 Z" />
      <path id="ES" class="country" d="M435,170 L490,165 L495,210 L440,215 Z" />
      <path id="IT" class="country" d="M505,175 L540,170 L550,230 L515,235 Z" />
      <path id="HR" class="country" d="M545,175 L575,170 L580,195 L550,200 Z" />
      <path id="GR" class="country" d="M570,200 L600,195 L605,240 L575,245 Z" />

      <!-- Asia -->
      <path id="JP" class="country" d="M870,140 L910,130 L920,180 L880,190 Z" />
      <path id="VN" class="country" d="M810,250 L835,245 L845,310 L820,315 Z" />
      <path id="LA" class="country" d="M795,240 L820,235 L825,280 L800,285 Z" />

      <!-- Graticule lines -->
      <g class="graticule" stroke="#ddd9d4" stroke-width="0.5" fill="none" opacity="0.5">
        <line x1="0" y1="125" x2="1000" y2="125" />
        <line x1="0" y1="250" x2="1000" y2="250" />
        <line x1="0" y1="375" x2="1000" y2="375" />
        <line x1="250" y1="0" x2="250" y2="500" />
        <line x1="500" y1="0" x2="500" y2="500" />
        <line x1="750" y1="0" x2="750" y2="500" />
      </g>
    </svg>
  `;

  // Inject SVG
  mapContainer.innerHTML = worldMapSVG;

  // Style countries
  const countries = mapContainer.querySelectorAll('.country');

  countries.forEach(country => {
    const id = country.id;
    const isVisited = visitedCountries.includes(id);

    // Base styles
    country.style.fill = isVisited ? '#5a8a6a' : '#e8e6e2';
    country.style.stroke = isVisited ? '#4a7559' : '#ddd9d4';
    country.style.strokeWidth = '1';
    country.style.cursor = isVisited ? 'pointer' : 'default';
    country.style.transition = 'all 0.3s ease';

    if (isVisited) {
      // Hover effects for visited countries
      country.addEventListener('mouseenter', function() {
        this.style.fill = '#4a7559';
        this.style.filter = 'url(#glow)';
        this.style.transform = 'scale(1.05)';
        this.style.transformOrigin = 'center';
        showTooltip(this, countryNames[id] || id);
      });

      country.addEventListener('mouseleave', function() {
        this.style.fill = '#5a8a6a';
        this.style.filter = 'none';
        this.style.transform = 'scale(1)';
        hideTooltip();
      });
    }
  });

  // Tooltip
  let tooltip = null;

  function showTooltip(element, text) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'map-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: #2d2a26;
        color: #faf9f7;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        pointer-events: none;
        z-index: 100;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateY(-8px);
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
      `;
      mapContainer.appendChild(tooltip);
    }

    tooltip.textContent = text;

    const rect = element.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();

    tooltip.style.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - containerRect.top - 30) + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(0)';
    tooltip.style.opacity = '1';
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
    }
  }

  // Animate countries on scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountries();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(mapContainer);

  function animateCountries() {
    const visitedElements = [];
    countries.forEach(country => {
      if (visitedCountries.includes(country.id)) {
        visitedElements.push(country);
        country.style.fill = '#e8e6e2';
        country.style.stroke = '#ddd9d4';
      }
    });

    // Stagger animation
    visitedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.fill = '#5a8a6a';
        el.style.stroke = '#4a7559';
      }, index * 80);
    });
  }

})();
