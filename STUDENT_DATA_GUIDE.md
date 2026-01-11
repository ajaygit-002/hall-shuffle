# Student Data Management Guide 📚

## Overview

The Hall Shuffle Buddy system is designed to manage and allocate exam seats for large numbers of students across multiple standards (1-12) in schools and colleges. This guide explains how student data works in the system.

## Student Data Structure

### School Student Format

```json
{
  "id": "sch-std01-001",
  "name": "Aarav Agarwal",
  "rollNumber": "ROLL00001",
  "standard": 1,
  "section": "A",
  "institutionId": "inst-001"
}
```

**Fields:**
- **id**: Unique identifier for the student
- **name**: Student's full name
- **rollNumber**: School-specific roll number (unique within institution)
- **standard**: Grade/Class level (1-12)
- **section**: Class section (A, B, C, D, or E)
- **institutionId**: Reference to the school institution

### College Student Format

```json
{
  "id": "col-cse-001",
  "name": "Priya Sharma",
  "registerNumber": "REG123456",
  "department": "CSE",
  "year": 3,
  "institutionId": "col-001"
}
```

**Fields:**
- **id**: Unique identifier for the student
- **name**: Student's full name
- **registerNumber**: College-specific register number (unique within institution)
- **department**: Academic department (CSE, ECE, MECH, CIVIL, IT, EEE, AIDS)
- **year**: Year of study (1-4)
- **institutionId**: Reference to the college institution

## Data Standards

### Standard Distribution (Schools)
The system supports standards 1 through 12:

| Standard | Level | Typical Age |
|----------|-------|------------|
| 1-2 | Primary | 6-8 years |
| 3-5 | Upper Primary | 8-11 years |
| 6-8 | Middle School | 11-14 years |
| 9-10 | High School | 14-16 years |
| 11-12 | Senior Secondary | 16-18 years |

### Sections
Five sections available per standard:
- **A** - First section
- **B** - Second section
- **C** - Third section
- **D** - Fourth section
- **E** - Fifth section

### College Departments
Seven departments supported:
- **CSE** - Computer Science & Engineering
- **ECE** - Electronics & Communication Engineering
- **MECH** - Mechanical Engineering
- **CIVIL** - Civil Engineering
- **IT** - Information Technology
- **EEE** - Electrical & Electronics Engineering
- **AIDS** - Artificial Intelligence & Data Science

### College Years
Four years of undergraduate study:
- **Year 1** - First year
- **Year 2** - Second year
- **Year 3** - Third year
- **Year 4** - Fourth year

## Adding Students to the System

### Method 1: Manual Addition via UI

1. Navigate to **Admin Panel → Students**
2. Click **"Add Student"** button
3. Select student type (School or College)
4. Fill in the form:
   - **For School Students**: Name, Roll Number, Standard, Section, Institution
   - **For College Students**: Name, Register Number, Department, Year, Institution
5. Click **"Add Student"** to save

**When to use:** Adding 1-5 students individually

### Method 2: Generate Demo Students (Automated)

#### Generate 100 Students
```
Admin Panel → Students → "Generate 100 Students"
```
- Creates 100 diverse school students
- Distributed across all 12 standards
- Balanced section allocation
- Uses realistic naming patterns
- Generated in <100ms

#### Generate 1000 Students (Optimized)
```
Admin Panel → Students → "Generate 1000 Students"
```
- Creates 1000 unique school students
- Distributed across all 12 standards
- Balanced distribution:
  - ~83 students per standard
  - ~16 students per section
- Unique roll numbers (ROLL00001 - ROLL01000)
- Realistic multi-part Indian names
- Generated in <100ms

**Features:**
- ✅ Deterministic - same input produces same output
- ✅ Collision detection - no duplicate roll numbers
- ✅ Automatic validation - checks data integrity
- ✅ Console logging - shows generation statistics
- ✅ Persistent storage - saved to browser localStorage

#### Generate Mixed Demo (1000)
```
Admin Panel → Students → "Mixed Demo (1000)"
```
- Creates mixed school and college students
- 500 school students + 500 college students
- Useful for testing multi-institution setups
- Same performance as single type generation

**When to use:** Testing with large datasets (100+ students)

### Method 3: Import from JSON

A sample JSON file is provided at: `public/sample-students-data.json`

**Structure:**
```json
{
  "metadata": {
    "version": "1.0",
    "totalStudents": 1000,
    "standards": 12,
    "sections": ["A", "B", "C", "D", "E"]
  },
  "students": [
    { /* student objects */ }
  ]
}
```

**To use:**
1. Prepare JSON file with student array
2. Parse and add to store via code:
```typescript
import { useDataStore } from '@/store/dataStore';

const { addStudents } = useDataStore();
const response = await fetch('sample-students-data.json');
const data = await response.json();
addStudents(data.students);
```

## Student Statistics

### Understanding the Distribution Overview

The Students page displays a **Distribution Overview** card showing:

#### By Standard (1-12)
- **Count**: Number of students in each standard
- **Percentage**: % of total school students in that standard
- **Visual Grid**: Responsive layout showing all standards

#### Summary Statistics
- **Total School Students**: Count of all school students
- **Total College Students**: Count of all college students
- **Total Students**: Combined count across all types
- **Sections**: Number of available sections

### Example Distribution (1000 Students)

```
Standard Distribution (1000 students across 1-12):
│ Std │ Count │ Percentage │
├─────┼───────┼────────────┤
│  1  │  83   │    8.3%    │
│  2  │  83   │    8.3%    │
│  3  │  83   │    8.3%    │
│  4  │  84   │    8.4%    │
│  5  │  84   │    8.4%    │
│  6  │  84   │    8.4%    │
│  7  │  83   │    8.3%    │
│  8  │  83   │    8.3%    │
│  9  │  83   │    8.3%    │
│ 10  │  83   │    8.3%    │
│ 11  │  84   │    8.4%    │
│ 12  │  84   │    8.4%    │
└─────┴───────┴────────────┘
```

## Data Validation

The system automatically validates student data:

### Validation Checks
- ✅ Unique roll/register numbers within institution
- ✅ Valid standard values (1-12 for school)
- ✅ Valid section values (A-E)
- ✅ Valid department values for college
- ✅ Valid year values (1-4 for college)
- ✅ Required fields not empty
- ✅ Institution reference exists

### Error Handling
If validation fails:
- ❌ UI shows error toast notification
- ❌ Console logs detailed error messages
- ❌ Data is not added to store
- ❌ User prompted to correct input

## Search & Filtering

### Search by Multiple Criteria

The **Search** field on the Students page searches:

**For School Students:**
- Student name
- Roll number
- Both school and college students can be filtered

**For College Students:**
- Student name
- Register number

### Search Features
- **Real-time filtering** - updates as you type
- **Case-insensitive** - matches any case
- **Partial matching** - finds partial names/numbers
- **Separate tabs** - School and College students in different tabs

**Example Searches:**
```
"Aarav" → finds students named Aarav
"ROLL000" → finds roll numbers starting with ROLL000
"CSE" → finds college students (department visible in table)
```

## Data Storage

### localStorage Integration

All student data is persisted using browser localStorage:

**Storage Details:**
- **Location**: Browser's Application Storage
- **Size**: ~500KB for 1000 students
- **Persistence**: Survives page refresh and browser close
- **Format**: JSON (serialized by Zustand)

**To clear data:**
```javascript
// In browser console
localStorage.clear(); // Clears ALL local storage
```

### Data Backup

To backup student data:

```javascript
// In browser console - Export to JSON
const { dataStore } = window;
const students = dataStore.getState().students;
console.log(JSON.stringify(students, null, 2));

// Copy output and save as JSON file
```

## Performance Metrics

### Generation Performance

| Operation | Count | Time | Memory |
|-----------|-------|------|--------|
| Generate Students | 100 | <50ms | ~50KB |
| Generate Students | 1000 | <100ms | ~500KB |
| Search/Filter | 1000 | <10ms | Negligible |
| Add Single Student | 1 | <5ms | ~1KB |
| Add Bulk Students | 1000 | ~20ms | ~500KB |

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Common Tasks

### Task 1: Setup Initial Demo Data

```
1. Admin Panel → Institutions → Add School "St. Xavier's School"
2. Admin Panel → Students → Generate 1000 Students
3. Admin Panel → Exams → Generate Demo Exam
4. Admin Panel → Halls → Add Hall "Main Hall" (500 capacity)
5. Admin Panel → Seat Allocations → Generate Allocation
```

### Task 2: Add Students from Multiple Schools

```
1. Admin Panel → Institutions → Add School "School A"
2. Admin Panel → Institutions → Add School "School B"
3. Admin Panel → Students → Generate 500 Students (repeat for School B)
4. Or manually add students selecting different institutions
```

### Task 3: Export Student Data

```javascript
// In browser console
const students = JSON.parse(localStorage.getItem('data-store'));
console.log(JSON.stringify(students.students, null, 2));
// Copy and save to file
```

### Task 4: Check Data Statistics

```
1. Go to Admin Panel → Students
2. View "Student Distribution Overview" card
3. Shows breakdown by standard 1-12
4. Displays total counts and percentages
5. Check console for detailed statistics after generation
```

## Best Practices

### ✅ Do's
- Use demo data generation for testing large datasets
- Check validation errors in console logs
- Backup data regularly via export
- Use realistic names for production data
- Keep unique roll numbers unique per institution

### ❌ Don'ts
- Don't add duplicate roll numbers in same institution
- Don't manually edit localStorage (use UI instead)
- Don't add students without selecting institution
- Don't use special characters in names/roll numbers
- Don't clear browser cache without backing up

## Troubleshooting

### Issue: Duplicate Roll Numbers

**Symptom:** Cannot add student with existing roll number

**Solution:**
- Edit the roll number to be unique
- Or check existing students for the number
- Search page shows existing roll numbers

### Issue: Data Lost After Browser Close

**Symptom:** Students disappear after closing browser

**Solution:**
- Check if localStorage is enabled
- Browser → Settings → Cookies and Cache
- Enable "Remember site data"
- Try again in incognito mode

### Issue: Slow Performance with 1000+ Students

**Symptom:** Page slow to load or search is delayed

**Solution:**
- Use filtering/search to reduce visible rows
- Check browser memory usage
- Try different browser
- Consider backend database integration

### Issue: Console Shows Generation Errors

**Symptom:** Error message in console during generation

**Solution:**
1. Check if institutions are created first
2. Check browser console for error details
3. Try smaller generation (100 vs 1000)
4. Refresh page and retry

## Advanced Usage

### Custom Name Data

Edit `src/lib/demoDataGenerator.ts` to modify:
- `FIRST_NAMES` array - first names
- `LAST_NAMES` array - family names
- Name generation logic

### Custom Distribution

Modify `getBalancedStandard()` function to:
- Change standard distribution (currently uniform)
- Adjust section allocation
- Add weighted probabilities

### Database Integration

To replace localStorage with database:
1. Modify `src/store/dataStore.ts`
2. Replace localStorage with API calls
3. Update Student components to use async data
4. See documentation for implementation details

## Support & Questions

For issues or questions:
- Check this guide first
- Review code comments in `src/lib/demoDataGenerator.ts`
- Check browser console for errors
- Create GitHub issue with details

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Compatibility:** Hall Shuffle Buddy v2.0+
