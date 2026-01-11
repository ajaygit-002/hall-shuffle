# Hall Shuffle Buddy 🎓

An intelligent exam seat allocation system that uses the Fisher-Yates shuffle algorithm to randomly distribute students across exam halls while preventing same-class clustering.

## Features

### 👨‍💼 Admin Panel
- **Institutions Management**: Add and manage schools and colleges
- **Students Management**: 
  - Add individual students or generate demo data (100 or 1000 students)
  - Support for both school (with roll numbers) and college students (with register numbers)
- **Exams Management**: Schedule exams with automatic demo exam generation
- **Exam Halls Management**: Create and manage exam halls with seating capacity
- **Seat Allocations**: Generate allocations using advanced shuffle algorithm with constraint checking

### 🎯 Student Lookup
- Search students by roll number or register number
- **Interactive Animated Seat Map**: 
  - Visual 30-desk classroom layout
  - Hover effects showing student details in tooltips
  - Your seat highlighted in green with animations
  - Fully responsive design (mobile, tablet, desktop)
- View complete exam details (date, time, hall, institution)
- Important exam day reminders

### 🔄 Advanced Allocation Algorithm
- Fisher-Yates shuffle for randomization
- Constraint-based allocation to avoid same-class seating
- Unique allocation IDs with validation
- Capacity checking and error handling

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v16+) and npm
- [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/ajaygit-002/hall-shuffle.git

# Navigate to the project directory
cd hall-shuffle-buddy-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Sidebar, etc.)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   ├── Index.tsx       # Home page
│   ├── Login.tsx       # Login page
│   ├── StudentLookup.tsx # Student seat lookup
│   └── NotFound.tsx    # 404 page
├── store/              # Zustand store
│   ├── authStore.ts    # Authentication state
│   └── dataStore.ts    # Application data store
├── types/              # TypeScript types
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Admin Panel Workflow

1. **Add Institution**: Create school(s) and/or college(s)
2. **Add Students**: 
   - Manually add students, or
   - Click "Generate 100 School Students" / "Generate 1000 Demo Students"
3. **Add Exam Halls**: Create halls with seating capacity
4. **Create Exam**: 
   - Click "Create Exam" or
   - Click "Generate Demo Exam" for instant exam
5. **Generate Allocations**:
   - Go to Seat Allocations
   - Select exam
   - Check halls to use
   - Click "Generate Allocation"

## Student Lookup Features

- Search by Roll Number (School) or Register Number (College)
- View assigned seat with visual map
- See exam details (date, time, session)
- Interactive seat map with:
  - Hover tooltips showing student details
  - Smooth animations and transitions
  - Responsive grid layout
  - Entrance marker
  - Visual legend

## Recent Updates

✨ **Version 2.0 Enhancements:**
- Added bulk student generation (100 and 1000 students)
- Added demo exam generation button
- Enhanced allocation configuration with validation
- Created interactive animated seat map visualization
- Improved responsive design for all screen sizes
- Added TypeScript 6.x deprecation handling
- Enhanced student detail display on seat hover

## Build & Deploy

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
