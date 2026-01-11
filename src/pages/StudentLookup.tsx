import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/store/dataStore';
import Navbar from '@/components/layout/Navbar';
import {
  GraduationCap,
  Search,
  MapPin,
  Calendar,
  Clock,
  School,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { SchoolStudent, CollegeStudent } from '@/types';

const StudentLookup = () => {
  const { students, allocations, exams, halls, institutions } = useDataStore();
  const [searchId, setSearchId] = useState('');
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    student?: any;
    allocation?: any;
    exam?: any;
    hall?: any;
    institution?: any;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) return;

    // Find student by roll number or register number
    const student = students.find((s) => {
      if ('rollNumber' in s) {
        return (s as SchoolStudent).rollNumber.toLowerCase() === searchId.toLowerCase();
      } else {
        return (s as CollegeStudent).registerNumber.toLowerCase() === searchId.toLowerCase();
      }
    });

    if (!student) {
      setSearchResult({ found: false });
      return;
    }

    // Find allocation for this student
    const allocation = allocations.find((a) => a.studentId === student.id);
    
    if (!allocation) {
      setSearchResult({
        found: true,
        student,
        institution: institutions.find((i) => i.id === student.institutionId),
      });
      return;
    }

    const exam = exams.find((e) => e.id === allocation.examId);
    const hall = halls.find((h) => h.id === allocation.hallId);
    const institution = institutions.find((i) => i.id === student.institutionId);

    setSearchResult({
      found: true,
      student,
      allocation,
      exam,
      hall,
      institution,
    });
  };

  const isSchoolStudent = (student: any): student is SchoolStudent => {
    return 'rollNumber' in student;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary">
              <Search className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Find Your Seat
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter your roll number or register number to view your exam hall allocation
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="studentId" className="sr-only">
                    Roll / Register Number
                  </Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your Roll Number or Register Number"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResult && (
            <div className="animate-slide-up">
              {searchResult.found ? (
                <Card>
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <CardTitle>{searchResult.student.name}</CardTitle>
                        <CardDescription>
                          {isSchoolStudent(searchResult.student)
                            ? `Roll No: ${searchResult.student.rollNumber}`
                            : `Reg No: ${searchResult.student.registerNumber}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {searchResult.allocation ? (
                      <div className="space-y-6">
                        {/* Seat Information - Visual Display */}
                        <div className="rounded-2xl gradient-primary p-8 text-center shadow-primary">
                          <p className="text-sm text-primary-foreground/80 font-medium">Your Assigned Seat</p>
                          <div className="mt-4 mb-2 inline-block rounded-xl bg-primary-foreground/20 px-6 py-3">
                            <p className="text-5xl font-bold text-primary-foreground tracking-wider">
                              {searchResult.allocation.seatNumber}
                            </p>
                          </div>
                          <p className="text-sm text-primary-foreground/90 mt-3">
                            📍 Hall: <span className="font-semibold">{searchResult.hall?.hallNumber}</span>
                          </p>
                        </div>

                        {/* Visual Seat Map */}
                        <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">
                            Interactive Seat Map - Hover to View Details
                          </p>
                          <div className="flex flex-col items-center">
                            {/* Classroom Grid Visualization */}
                            <div className="relative w-full">
                              {/* Hall entrance marker */}
                              <div className="text-center mb-8">
                                <div className="inline-block bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                  🚪 Entrance
                                </div>
                              </div>
                              
                              {/* Seat visualization - Responsive Grid */}
                              <div className="grid gap-2 sm:gap-3 lg:gap-4 justify-center mx-auto" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))'}}>
                                {Array.from({ length: 30 }).map((_, i) => {
                                  const seatNum = String(i + 1).padStart(3, '0');
                                  const isSeat = searchResult.allocation.seatNumber === `${searchResult.hall?.hallNumber}-${seatNum}`;
                                  const isHovered = hoveredSeat === i;
                                  
                                  return (
                                    <div key={i} className="relative group">
                                      {/* Hover Tooltip Background */}
                                      {isHovered && (
                                        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <div className="bg-black/90 text-white rounded-lg px-4 py-3 text-xs whitespace-nowrap shadow-xl border border-white/20">
                                            {isSeat ? (
                                              <div className="text-center">
                                                <p className="font-bold text-sm">{searchResult.student.name}</p>
                                                <p className="text-white/80 text-[11px]">
                                                  {isSchoolStudent(searchResult.student)
                                                    ? `Roll: ${searchResult.student.rollNumber}`
                                                    : `Reg: ${searchResult.student.registerNumber}`}
                                                </p>
                                                <p className="text-white/70 text-[10px] mt-1">
                                                  {isSchoolStudent(searchResult.student)
                                                    ? `${searchResult.student.standard}th - ${searchResult.student.section}`
                                                    : `${searchResult.student.department} - Y${searchResult.student.year}`}
                                                </p>
                                              </div>
                                            ) : (
                                              <span>Empty Seat {i + 1}</span>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Seat Button */}
                                      <button
                                        onMouseEnter={() => setHoveredSeat(i)}
                                        onMouseLeave={() => setHoveredSeat(null)}
                                        className={`
                                          w-full h-20 sm:h-20 lg:h-24 rounded-lg font-bold transition-all duration-300 ease-out
                                          flex flex-col items-center justify-center text-center px-2 cursor-pointer relative overflow-hidden
                                          ${
                                            isSeat
                                              ? `
                                                bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white shadow-lg ring-4 ring-green-300/50
                                                ${isHovered ? 'scale-125 shadow-2xl ring-green-400 -translate-y-2' : 'scale-100'}
                                              `
                                              : `
                                                bg-slate-200 text-slate-600 border-2 border-slate-300 shadow-sm
                                                ${isHovered ? 'scale-110 shadow-lg border-primary bg-slate-300 text-slate-700' : 'scale-100'}
                                              `
                                          }
                                        `}
                                      >
                                        {isSeat ? (
                                          <>
                                            {/* Animated background pulse for user's seat */}
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            <div className="relative z-10 flex flex-col items-center gap-0.5">
                                              <span className="text-[11px] sm:text-xs font-bold leading-tight truncate w-full">
                                                {searchResult.student.name.split(' ')[0]}
                                              </span>
                                              <span className="text-[8px] sm:text-[9px] leading-tight text-white/90">
                                                {isSchoolStudent(searchResult.student)
                                                  ? searchResult.student.rollNumber
                                                  : searchResult.student.registerNumber}
                                              </span>
                                              <span className="text-[7px] sm:text-[8px] text-white/80 font-semibold mt-0.5">✓ Your Seat</span>
                                            </div>
                                          </>
                                        ) : (
                                          <span className="text-sm sm:text-base font-bold">{i + 1}</span>
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Legend */}
                              <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs sm:text-sm">
                                <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
                                  <div className="w-5 h-5 rounded bg-slate-200 border-2 border-slate-300 animate-pulse"></div>
                                  <span className="text-muted-foreground font-medium">Available</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-green-300">
                                  <div className="w-5 h-5 rounded bg-gradient-to-br from-green-400 to-teal-600 text-white text-[8px] font-bold flex items-center justify-center shadow-md">
                                    ✓
                                  </div>
                                  <span className="text-foreground font-bold">Your Seat</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-primary/5">
                            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Exam Hall</p>
                              <p className="font-bold text-lg mt-1">
                                {searchResult.hall?.hallNumber}
                                {searchResult.hall?.block && ` (${searchResult.hall.block})`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Capacity: {searchResult.hall?.seatingCapacity} seats
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-accent/5">
                            <Calendar className="mt-0.5 h-5 w-5 text-accent" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Exam Date</p>
                              <p className="font-bold text-lg mt-1">
                                {new Date(searchResult.exam?.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(searchResult.exam?.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                            <Clock className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Session Time</p>
                              <p className="font-bold text-lg mt-1 capitalize">
                                {searchResult.exam?.session === 'morning' ? '🌅 Morning' : '🌞 Afternoon'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                            <School className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Institution</p>
                              <p className="font-bold text-lg mt-1">
                                {searchResult.institution?.name || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Exam Name */}
                        <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 text-center">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Examination</p>
                          <p className="mt-2 font-display text-2xl font-bold text-foreground">
                            {searchResult.exam?.name}
                          </p>
                        </div>

                        {/* Important Notes */}
                        <div className="rounded-lg bg-warning/10 border border-warning/30 p-4">
                          <p className="text-sm font-semibold text-warning mb-2">✓ Important Reminders:</p>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>• Arrive at least 15 minutes before the exam time</li>
                            <li>• Check your seat number carefully: <span className="font-bold text-foreground">{searchResult.allocation.seatNumber}</span></li>
                            <li>• Bring your admission card and valid ID</li>
                            <li>• Follow all exam center rules and instructions</li>
                          </ul>
                        </div>

                        {/* Student Details */}
                        <div className="rounded-lg border border-border p-4">
                          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Student Details
                          </p>
                          <div className="grid gap-2 text-sm">
                            {isSchoolStudent(searchResult.student) ? (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Standard</span>
                                  <span className="font-medium">
                                    {searchResult.student.standard}th
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Section</span>
                                  <span className="font-medium">
                                    {searchResult.student.section}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Department</span>
                                  <span className="font-medium">
                                    {searchResult.student.department}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Year</span>
                                  <span className="font-medium">
                                    Year {searchResult.student.year}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-warning" />
                        <p className="mt-4 font-medium">No Allocation Found</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Your seat has not been allocated yet. Please check back later or contact
                          your institution.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <p className="mt-4 font-medium">Student Not Found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No student found with the provided ID. Please check and try again.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Instructions */}
          {!searchResult && (
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  How to find your seat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      1
                    </span>
                    Enter your Roll Number (for school students) or Register Number (for college students)
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      2
                    </span>
                    Click the Search button to find your allocation
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      3
                    </span>
                    Note down your hall number and seat number for the exam day
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentLookup;
