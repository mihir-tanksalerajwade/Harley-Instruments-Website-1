import { WebsiteData } from "./types";

// Reference the generated hero image straight as a standard string to resolve typescript types error
const heroImgSrc = "/src/assets/images/scientific_chamber_hero_1781258885977.jpg";

export const defaultWebsiteData: WebsiteData = {
  hero: {
    badge: "Established 1987 · Precision Scientific Instrumentation",
    title: "Elite Research Systems For Global Scientific Breakthroughs",
    subtitle: "For nearly four decades, Harley has supplied and serviced high-end research equipment, micro-machining systems, and specialized active magnetic cancellations to premier research laboratories and advanced B2B manufacturers worldwide.",
    ctaText: "Request Technical Consultation",
    imageSrc: heroImgSrc,
    statistics: [
      { value: "1987", label: "Year Founded" },
      { value: "40+", label: "Years of specialized expertise" },
      { value: "500+", label: "Research labs equipped" },
      { value: "99.8%", label: "Uptime guarantee" }
    ]
  },
  about: {
    badge: "Four Decades of Specialized Physics & Materials Science Support",
    title: "Pioneering Sci-Tech Equipment Engineering Since 1987",
    storyHeading: "Empowering Next-Gen Material Science, Nanotechnology, & Physics Research Labs",
    paragraphs: [
      "Founded in Pune, India, Harley originally emerged as a specialized scientific representation and engineering team. Nearly forty years later, we have grown into one of the region's elite suppliers and technical service providers for advanced research systems, microscopy specimen preparation, and environmental magnetic interference surveys.",
      "We provide end-to-end support for scientific institutions, national labs, defense research divisions, and top-tier industrial semiconductor foundries. Our highly trained domain engineers manage not only delivery but full system integration, calibration, routine servicing, and custom system retrofitting.",
      "Through decades of relationships with leading global developers of material-science apparatus, we have earned the complete trust of extreme-precision research labs across India and Asia."
    ],
    milestones: [
      {
        year: "1987",
        title: "Inception & First Agency",
        desc: "Initially formed as a precision vacuum and thin-film servicing team in Pune."
      },
      {
        year: "1998",
        title: "Active Magnetic Field Systems",
        desc: "Pioneered active cancellation surveys and systems for high-resolution electron microscopes (TEM/SEM) in India."
      },
      {
        year: "2010",
        title: "Micro-machining and Plasma Core",
        desc: "Expanded into high-grade ultra-fast laser micro-machining and advanced plasma de-contamination solutions."
      },
      {
        year: "2023",
        title: "Next-Gen Facility Integration",
        desc: "Completed supply and calibration of 50+ materials research systems for national science campuses within a single year."
      }
    ]
  },
  products: [
    {
      id: "prod-1",
      title: "Thin Film Deposition Machines",
      category: "equipment",
      shortDesc: "Extreme-precision physical vapor deposition (PVD) and atomic layer deposition (ALD) systems for sub-nanometer coatings.",
      fullDesc: "Harley delivers premium atomic layer deposition (ALD) and magnetron sputtering machines meant for materials science, organic electronics, and semiconductor trials. Capable of handling ultra-high vacuum (UHV) conditions with automated multi-gas control systems.",
      specifications: [
        "Base Pressure: < 10^-8 Torr for high-purity coatings",
        "Deposition Modes: RF / DC Sputtering, Evaporation, and ALD cycles",
        "Substrate Heating: Integrated heaters up to 800°C with uniform rotation",
        "Customizations: Custom chamber configurations with multi-target sources"
      ],
      iconName: "Layers"
    },
    {
      id: "prod-2",
      title: "Precision Wire Saws",
      category: "equipment",
      shortDesc: "High-tension reciprocating wire saws for non-destructive cutting of fragile crystals, glass, and metal substrates.",
      fullDesc: "Designed to handle fragile monocrystalline specimens, semiconductors, and exotic alloys with near-zero heat dissipation and minimum kerf loss. Features automated digital tensioning controls and diamond-impregnated or slurry wires.",
      specifications: [
        "Wire Tension: 5N to 50N precisely monitored by digital sensors",
        "Feed Rate: Sub-micron increments for hyper-precise sectioning",
        "Coolant Integration: Closed-loop lubrication preventing thermal crack micro-fractures",
        "Operation: Visual PLC touchscreen dashboard with preset crystal recipes"
      ],
      iconName: "Maximize-2"
    },
    {
      id: "prod-3",
      title: "Plasma De-Contaminators",
      category: "equipment",
      shortDesc: "Advanced plasma downstream cleaning systems to remove organic hydrocarbons from TEM and SEM holders prior to scanning.",
      fullDesc: "Our downstream plasma cleaners prevent specimen drift and image carbon-deposition in high-resolution transmission electron microscopes. Eliminates specimen chamber contamination without modifying specimen surface properties.",
      specifications: [
        "Plasma Source: Low-temperature, high-efficiency digital RF plasma generator",
        "Gases Supported: Pure Oxygen (O2), Argon (Ar), and specialized Hydrogen mixes",
        "Specimen Interface: Dedicated ports custom-fitted for JEOL, Thermo Fischer (FEI), and Hitachi holders",
        "Cycle Time: Complete automated decontamination in less than 2 minutes"
      ],
      iconName: "Zap"
    },
    {
      id: "prod-4",
      title: "Laser Micromachining Machines",
      category: "equipment",
      shortDesc: "Pico-second and femto-second ultra-fast pulse laser structuring stations with sub-micron resolution.",
      fullDesc: "Designed for micro-drilling, stencil-cutting, scribing, and high-aspect-ratio milling on materials ranging from polymer sheets to synthetic diamonds. Cold laser ablation guarantees no thermal structural boundaries.",
      specifications: [
        "Laser Pulse Width: Femto-second (< 290fs) / Pico-second models",
        "Positioning Accuracy: Direct-drive air-bearing stage with ±0.5 μm repeatability",
        "Applications: Biomedical stents, MEMS substrates, microfluidics, solar cells",
        "Safety: Class 1 laser enclosures with comprehensive toxic fumes filtration"
      ],
      iconName: "Zap-off"
    },
    {
      id: "prod-5",
      title: "Magnetic Field Cancellation Systems & Surveys",
      category: "equipment",
      shortDesc: "Active spatial magnetic field cancellation chambers and ultra-low noise site assessments in physical labs.",
      fullDesc: "High-magnification microscopes (TEM/STEM) and electron-beam lithography systems operate poorly in noisy magnetic environments. Harley conducts specialized 3-axis electromagnetic surveys and installs extreme active isolation systems containing Helmholtz coils.",
      specifications: [
        "Cancellation Attenuation: Up to 40dB suppression dynamically in DC to 10kHz",
        "Active Sensor: High-resolution sub-nanotesla fluxgate magnetometer probes",
        "Survey Deliverables: Multi-day continuous logging reports and interference zoning layouts",
        "Scope: Customized room-sized cable lines and customized multi-axis framework setup"
      ],
      iconName: "Magnet"
    },
    {
      id: "prod-6",
      title: "Contract Plasma De-Contamination",
      category: "service",
      shortDesc: "White-glove, cleanroom-based hydrocarbon cleaning and chemical etching service for client-provided samples.",
      fullDesc: "For universities and research institutions without integrated plasma machines, Harley offers reliable sample preparation services. Ship your TEM grids or semiconductor wafers to our Pune headquarters; our certified specialists handle decontamination in Class 100/1000 cleanrooms and ship them back using inert vacuum carriers.",
      specifications: [
        "Facility Environment: ISO Class 5 cleanrooms with electrostatic discharge (ESD) security",
        "Specimen Carriers: Nitrogen-purged shipping cases for absolute isolation",
        "Verification: Detailed pre-and-post surface diagnostics and scanning feedback",
        "Turnaround: Express 24-48 hours processing options"
      ],
      iconName: "Sparkles"
    },
    {
      id: "prod-7",
      title: "TEM Specimen Preparation Systems",
      category: "equipment",
      shortDesc: "Ion-milling, sectioning, and mechanical dimpling apparatus to achieve electron transparency in Material samples.",
      fullDesc: "Essential for producing top-grade TEM cross-sections. Fully manual and digital polishing lathes, ultra-microtomes, and targeted low-angle argon ion-milling setups designed to achieve thin foils under 10 nanometers.",
      specifications: [
        "Ion Source: Focusable dual gas-discharge ion guns with angle tuning down to -10°",
        "Sample Cooling: Liquid Nitrogen stage holding systems to protect polymer grids",
        "Precision Dimpling: Sub-micron depth stopping sensors",
        "Observation: Built-in 80x zoom optical monitoring lens for direct processing views"
      ],
      iconName: "Tv"
    },
    {
      id: "prod-8",
      title: "Technical Calibration, Servicing & Consultation",
      category: "service",
      shortDesc: "Strategic maintenance contracts, system overhaul, and expert physical laboratory acoustics/vibration surveys.",
      fullDesc: "Harley's legacy relies on support. We offer comprehensive service Level Agreements (SLA), preventative recalibrations, custom system retrofitting, vacuum pump rebuilding, and site assessments for greenfield laboratories.",
      specifications: [
        "Engineers: OEM-certified material physics specialists with 10+ average experience",
        "Response: 24-hour phone support and 48-hour on-site mobilization across technology estates",
        "Calibration standard: Traceable NABL / ISO certifications",
        "Overhaul Capacity: Turbo-molecular and helium dry cryopump rebuilds"
      ],
      iconName: "ShieldCheck"
    }
  ],
  trustPoints: [
    {
      id: "trust-1",
      title: "Operating Since 1987",
      description: "With nearly forty years of continuous field operations, we are a deeply rooted and trusted technical pillar for institutions across South Asia and globally.",
      iconName: "Calendar"
    },
    {
      id: "trust-2",
      title: "Deep Domain-Expertise Team",
      description: "Our core engineers hold advanced degrees in applied physics, materials science, and electronics. We are scientists supporting scientists.",
      iconName: "Award"
    },
    {
      id: "trust-3",
      title: "Premium OEM Global Partners",
      description: "We work directly with world-class component suppliers from the US, UK, Germany, and Japan to guarantee absolutely robust B2B system chains.",
      iconName: "Globe"
    },
    {
      id: "trust-4",
      title: "Comprehensive SLA Servicing",
      description: "We do not merely supply boxes; we provide complete calibration, installation, rapid maintenance services, and lifecycle upgrades.",
      iconName: "Wrench"
    }
  ],
  contact: {
    email: "technical.sales@harleyinstruments.com",
    phone: "+91 (20) 2421-4087",
    linkedin: "https://www.linkedin.com/company/harley-scientific-pune",
    address: "Electronic Estate, off Satara Road, Pune – 411009, India",
    workingHoursWeekdays: "Monday to Friday: 9:00 AM – 6:30 PM",
    workingHoursSaturday: "Saturday: Available / Reachable"
  }
};
