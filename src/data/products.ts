import type { SectionData } from '../types';

export const calzadoSection: SectionData = {
  id: 'calzado',
  title: 'CALZADO',
  accentColor: 'calzado-blush',
  categories: [
    { label: 'Todos', active: true },
    { label: 'Sandalias', active: false },
    { label: 'Zapatillas', active: false },
    { label: 'Botas', active: false },
  ],
  products: [
    {
      id: 'calzado-1',
      name: 'Sandalia Minimalista Blush',
      description: 'Piel sintética premium',
      price: 899.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDuoj4f44Au_VbhaRFIjdhh-485veSTeNBOEOBQD0aYL6oIX8KWjz6PIt_Xir_shyqlKJ8cW1XtP0wgHf4TuXFosS7t8Jr0hPzePtJW9N1-IMp2Caqk6_jHLzy86hLIInNiYsmH4-S-dSdtXKVvnT6a7kLpvU-6Ccty1eRkZ75yPid-oIlXxU6mH41IOy4TAw81WSgHZGsShagm15nc9bZfmg1fu-w95CnroOwPfe-SFdNnJTsBhJxCxUFPiJ-qzRqpwYB6zYrlHq4',
      imageAlt: 'Sandalia Elegante',
      sizes: [
        { label: '23', available: true },
        { label: '24', available: true, highlighted: true },
      ],
      badge: 'nuevo',
      variant: 'standard',
    },
    {
      id: 'calzado-2',
      name: 'Zapatilla Stiletto Nude',
      description: 'Acabado mate',
      price: 1150.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTg4V8S97pUB5LxtEE_THTUJyZvL51SnELhV8isLbpgwcHcNAcRRfD_t-vxKXjqZ4OqSyerDTpspCG3EBaME7nw6fjdIEds6J1Puv3BXj_kxKn6FLu0njHPEnogO15cRFu2hSI6Q5b6-4ID03f4NvJztt8HJMhPTbe6hLgGHrKy6TgNGmwJ1qdDnGkVnYaHrqQO88rjXlbD5HysNNdaAf2o7-mOaKulnJaRnok1utqchuXmueI1ikq2bI9WvDlX8h6AHziUvPE3ZE',
      imageAlt: 'Zapatilla Clásica',
      sizes: [
        { label: '24', available: true },
        { label: '25', available: true, highlighted: true },
      ],
      badge: null,
      variant: 'standard',
    },
    {
      id: 'calzado-3',
      name: 'Botín Chelsea Suede Arena',
      description:
        'Comodidad absoluta con un toque de altura. Diseño atemporal para cualquier ocasión.',
      price: 1450.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAN7TsNcT7iQfBd9JbFTbLmvuUJ9daO2eXQzAo3cdXD6bBKBoj_xhM_trmlX1YtQUSdHqWo6ygapSWaaAxwIdVeYHPj448o92O7BTDH8MTSnzAYNwG6Jd32czDs9g-7VyIn6JLUSMeJ9nlrUWP3O_SzJI4cxYRUViWfQMkHjTWoW6NyemF55hTYgJHh13HpAww4FWEThdU3sZ-ZZuLUs_rrvTs0nJgYGJOg2hgWx4k2t5o2J7E-CZevm6Pt0unUAVM8p6JwLE2fYE0',
      imageAlt: 'Botas Modernas',
      sizes: [],
      badge: 'tendencia',
      variant: 'wide',
    },
  ],
};

export const boutiqueSection: SectionData = {
  id: 'boutique',
  title: 'BOUTIQUE',
  accentColor: 'boutique-sand',
  categories: [
    { label: 'Todos', active: true },
    { label: 'Vestidos', active: false },
    { label: 'Blusas', active: false },
    { label: 'Pantalones', active: false },
  ],
  aspectRatio: '3/4',
  products: [
    {
      id: 'boutique-1',
      name: 'Vestido Midi Lino Crudo',
      price: 1299.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC9mLaTHEeu_UtI1ApfJjbBboKDzy4u2ewip6jONYKs4Q3dq16roDn2fvA3eTHo7zeSMleIsmAZbFO0lAHMftlVovYugGfki3lCZQV0fJhE0rUExnEWY6DCUnhMIpYhcge63tLJZXokQoZRvYgoOiVqclU4Fg8iHEH-unBlFDjqIcuiNqYMDtuJ233tPDJKK4rjiqwOwwx7nZ-OHh6NifoQz0ClO064nND8C476JtBCPFGc-gbBV8QpebEUbUX6tV9zP9DnPBGbe_g',
      imageAlt: 'Vestido Lino',
      sizes: [
        { label: 'S', available: true },
        { label: 'M', available: true, highlighted: true },
      ],
      badge: null,
      variant: 'standard',
    },
    {
      id: 'boutique-2',
      name: 'Blusa Seda Cuello V',
      price: 850.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbyNav3pTk5mRb6wum-omkZF27AEh5vf7aIweJF9QWcI2UWue8tSnjrSupaU7os6S-LDof9ynqo6D-uI1jPl8s2LgJnZKdEMi3ieT4HbHM-VSPX8J4kBWk9C0K3rm1St1OOB6_5f2JRCNeuzDdN8qxUufYeh6F3DiJnQ8v_OBtZjTqFGBjNxeK3Q8WwWNVDx-xn1R_XYAJAHuSGHN3iGn-virBk0wj5jzTMInFBcwyCKqEh0hj1QNSIo3bbTMCehz69viPvCRFjjw',
      imageAlt: 'Blusa Seda',
      sizes: [
        { label: 'CH', available: true, highlighted: true },
        { label: 'M', available: true },
      ],
      badge: null,
      variant: 'standard',
    },
    {
      id: 'boutique-3',
      name: 'Pantalón Sastre Wide-Leg',
      price: 950.0,
      originalPrice: 1200.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDx33FPhX0s9cDIWj7fJaMzwXwkZ7gE17ZAx9divPS2p8xtFz2ezHWrhgJ9X586yO3FNyn2THsHLgr_Sr5YrWeLTw715DmAqz7KISqm2W1F93yr1dMupW0ZGehs7WeBDlfPmOara6hAypd8TrghxVpsoefydf5hWkCJTo_iTjuJqJHXhVtwSh7JvmxzaI49hkb_e3usUKdtaY1HeGNjUwq0kIe6stBYj98rmJTCyP8WHDdcs2D8PTqnnucGAa6ST2HRXO8qbRwr2fc',
      imageAlt: 'Pantalón Sastre',
      sizes: [{ label: '28', available: true }],
      badge: 'oferta',
      variant: 'standard',
    },
    {
      id: 'boutique-4',
      name: 'Vestido Asimétrico Drapedo',
      price: 1699.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCdd-R281RUsxDhAPq75CcmzZe_ugtHp9UPLE9H0apDvZCU1PFjRzxH_dkreaHgc69hqMfNA7BtqwyeJghwqVknyWVUWiARyDKtunSdx_of-yPxN30v75hmF6XW2NijrU1cGOeq8x5TtsGZvm-OGUf3jeAfhJoLOdbvpImcmS39wnf2GiZ6hHR1bp2cCke_-p_EojmAV_5PokVPLRRFtWPM3w1FSPcsY1GKsgg7IpV-QTKjhMUn-SMND93gSDgYKJ6xeps8C-kdzBI',
      imageAlt: 'Vestido Noche',
      sizes: [
        { label: 'S', available: false },
        { label: 'M', available: true },
      ],
      badge: null,
      variant: 'standard',
    },
  ],
};

export const joyeriaSection: SectionData = {
  id: 'atenea',
  title: 'JOYERÍA',
  accentColor: 'atenea-lilac',
  categories: [
    { label: 'Todo', active: true },
    { label: 'Aretes', active: false },
    { label: 'Collares', active: false },
    { label: 'Anillos', active: false },
  ],
  products: [
    {
      id: 'atenea-1',
      name: 'Set Collar Capas Estrella Brillante',
      price: 450.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2map157lEXDj8mpVTeh1uK1qbiGup4nG1015YRu9WRc6ocX01aIjiYQ3cKEsb19iuLI0-nvhYefXlhWnwYTgWI44HrTeLFbBbrPjPnP2YXPDsdgj9Ap8wCMol-gJdCIAFi8nR-j-90AbFGbLDZl739hQGRzWdK-a6S0hVFlnOjsI9wNyDDFG_kenpeM-RIqFtUQLUtorKAhT9aFSOOJ3_p2TZb6bYNIzmc-v8UA11CZiRVQxl-Tux-Ee89ocfrb7WGt23PjR4AUs',
      imageAlt: 'Collar Capas',
      sizes: [],
      badge: null,
      variant: 'large-highlight',
    },
    {
      id: 'atenea-2',
      name: 'Arracadas Chunky Oro',
      price: 299.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDAxpY7DMjwpWypunapd4SNzYao6laXh8rNGd04JjsuFrh0j9N3BmfhfhWVPcg0YQZx92OhBZteVLu4d-R_N1liG1918699RAhHJv4CYFSILuUJz0OCiccOzfYYa447blJqKsoPqgA2MU0DKqz891s5hO6SqOw7MhipgQ31t3V9LzMM85g0Y6iMQtKPIxTBexT452AgY6uzW_FpVAAVRqk28d9G1eKPr-UfCIUXpp3VHhhKmbqZzv7B8FYm8zjPXf1MKf0me9K-j6c',
      imageAlt: 'Aretes Aro',
      sizes: [],
      badge: null,
      variant: 'standard',
    },
    {
      id: 'atenea-3',
      name: 'Anillo Zirconia Solitario',
      price: 180.0,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1U14lJ2E8NEpokiklFD851-8Xyp_f_UUQvug_IyCDNX6uXpGvuMauxdYP8lEYJji4cCyhFlfnMhRQvMxpsbiqSFhNCk_u1ek-F9oNGCTxBqh1-1-nTt1YwSBqO-33q4lmXbrIykU8W34FAE8Xs4eLL2nh0FElaN5MxLv0m2XS-yQQJCDOj54CLlLxjtPp66XW32I0DkNFtGO4uZbuKfP3P9DFHGRlsjVPZgIwUUtTIRpPj9nt4HDYt-4lGkhpMz5PirTSUldWZiY',
      imageAlt: 'Anillo Minimalista',
      sizes: [],
      badge: null,
      variant: 'standard',
    },
  ],
};
