# Shuttle Booking App

A modern React application for booking shuttle services between cities in Indonesia. Built with TypeScript, Vite, and modern React ecosystem tools.

## Cara Menjalankan

### Development Server
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test
```

## Struktur Folder

```
shuttle-booking/
├── public/
│   └── data/
│       └── shuttles.json    # Static shuttle schedule data
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LanguageToggleButton.tsx
│   │   ├── PassengerForm.tsx
│   │   ├── SearchForm.tsx
│   │   ├── ShuttleList.tsx
│   │   ├── ShuttleSearchForm.tsx
│   │   └── Sidebar.tsx
│   ├── contexts/            # React contexts
│   │   └── LanguageContext.tsx
│   ├── i18n/                # Internationalization files
│   │   └── index.ts
│   ├── pages/               # Page components
│   │   ├── BookingsPage.tsx
│   │   └── PassengerPage.tsx
│   ├── stores/              # Zustand state stores
│   │   └── shuttleStore.ts
│   ├── test/                # Test setup
│   │   └── setup.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts
│   │   ├── validation.test.ts
│   │   └── validation.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Catatan Keputusan Teknis & Asumsi

### Tech Stack
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Material-UI (MUI)** for pre-built components
- **Zustand** for lightweight state management
- **React Hook Form + Zod** for form handling and validation
- **i18next** for internationalization (English/Indonesian)
- **SWR** for data fetching and caching
- **Vitest** for unit testing

### Data Management
- Shuttle schedule data is stored in `public/data/shuttles.json`
- Data is fetched using SWR for caching and revalidation
- Static JSON file assumption: No backend API required for this demo
- Data is accessible via fetch at `/data/shuttles.json`

### Routing
- React Router DOM for client-side routing
- Two main routes: `/` (PassengerPage) and `/bookings` (BookingsPage)

### Styling
- Tailwind CSS for responsive design
- Material-UI components integrated with Tailwind
- Custom CSS in `src/index.css` and `src/App.css`

### Internationalization
- Support for English and Indonesian languages
- Language toggle button in sidebar
- Translations managed via i18next

### Testing
- Vitest with jsdom environment
- React Testing Library for component testing
- Setup file in `src/test/setup.ts`

### Assumptions
- Shuttle data is static and doesn't change frequently
- No authentication required for booking
- Currency is Indonesian Rupiah (IDR)
- Dates are in YYYY-MM-DD format
- Times are in 24-hour format
- App is designed for desktop and mobile use
