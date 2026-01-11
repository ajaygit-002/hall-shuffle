import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shuffle, Download, Trash2, CheckCircle, AlertCircle, Building2, Users, Grid3x3, List } from 'lucide-react';
import { SchoolStudent, CollegeStudent } from '@/types';

const Allocations = () => {
  const { exams, halls, students, allocations, generateAllocations, clearAllocations, institutions } =
    useDataStore();
  const { toast } = useToast();
  
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedHalls, setSelectedHalls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'visual'>('visual');

  const examAllocations = selectedExam
    ? allocations.filter((a) => a.examId === selectedExam)
    : [];

  const handleHallToggle = (hallId: string, checked: boolean) => {
    if (checked) {
      setSelectedHalls([...selectedHalls, hallId]);
    } else {
      setSelectedHalls(selectedHalls.filter((id) => id !== hallId));
    }
  };

  const handleGenerate = () => {
    if (!selectedExam) {
      toast({
        title: 'Select an Exam',
        description: 'Please select an exam first.',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedHalls.length === 0) {
      toast({
        title: 'Select Halls',
        description: 'Please select at least one hall.',
        variant: 'destructive',
      });
      return;
    }
    
    if (students.length === 0) {
      toast({
        title: 'No Students',
        description: 'Please add students before generating allocations.',
        variant: 'destructive',
      });
      return;
    }

    const hallCapacity = selectedHalls.reduce((sum, hallId) => {
      const hall = halls.find((h) => h.id === hallId);
      return sum + (hall?.seatingCapacity || 0);
    }, 0);

    if (students.length > hallCapacity) {
      toast({
        title: 'Insufficient Seats',
        description: `You have ${students.length} students but only ${hallCapacity} seats. Add more halls or remove students.`,
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      generateAllocations(selectedExam, selectedHalls);
      setIsGenerating(false);
      toast({
        title: 'Allocation Complete',
        description: `Successfully allocated ${students.length} students using Fisher-Yates shuffle.`,
      });
    }, 1500);
  };

  const handleClear = () => {
    if (selectedExam) {
      clearAllocations(selectedExam);
      toast({
        title: 'Allocations Cleared',
        description: 'All seat allocations for this exam have been removed.',
      });
    }
  };

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  const getHall = (hallId: string) => {
    return halls.find((h) => h.id === hallId);
  };

  const getInstitution = (institutionId: string) => {
    return institutions.find((i) => i.id === institutionId);
  };

  const isSchoolStudent = (student: any): student is SchoolStudent => {
    return 'rollNumber' in student;
  };

  const totalCapacity = selectedHalls.reduce((sum, hallId) => {
    const hall = halls.find((h) => h.id === hallId);
    return sum + (hall?.seatingCapacity || 0);
  }, 0);

  // Group allocations by hall for hall-wise view
  const allocationsByHall = examAllocations.reduce((acc, allocation) => {
    const hallId = allocation.hallId;
    if (!acc[hallId]) {
      acc[hallId] = [];
    }
    acc[hallId].push(allocation);
    return acc;
  }, {} as Record<string, typeof examAllocations>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Seat Allocations</h1>
        <p className="mt-1 text-muted-foreground">
          Generate and manage exam seat allocations using shuffle algorithm
        </p>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-primary" />
            Allocation Configuration
          </CardTitle>
          <CardDescription>
            Select exam and halls to generate seat allocations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prerequisites Check */}
          {(exams.length === 0 || halls.length === 0 || students.length === 0) && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Prerequisites not met:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {exams.length === 0 && <li>No exams created</li>}
                    {halls.length === 0 && <li>No exam halls created</li>}
                    {students.length === 0 && <li>No students added</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Exam Selection */}
          <div className="space-y-2">
            <Label>Select Exam</Label>
            {exams.length > 0 ? (
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Choose an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name} - {new Date(exam.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                No exams available. Create an exam first.
              </p>
            )}
          </div>

          {/* Hall Selection */}
          <div className="space-y-3">
            <Label>Select Halls</Label>
            {halls.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {halls.map((hall) => (
                  <label
                    key={hall.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                      selectedHalls.includes(hall.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={selectedHalls.includes(hall.id)}
                      onCheckedChange={(checked) =>
                        handleHallToggle(hall.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <p className="font-medium">{hall.hallNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Capacity: {hall.seatingCapacity} seats
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No halls available. Add exam halls first.
              </p>
            )}
          </div>

          {/* Summary & Actions */}
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Allocation Summary</p>
              <div className="flex gap-6">
                <span className="text-sm">
                  <strong>{students.length}</strong> students
                </span>
                <span className="text-sm">
                  <strong>{selectedHalls.length}</strong> halls
                </span>
                <span className="text-sm">
                  <strong>{totalCapacity}</strong> total seats
                </span>
              </div>
              {students.length > totalCapacity && selectedHalls.length > 0 && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  Not enough seats for all students
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              {examAllocations.length > 0 && (
                <Button variant="outline" onClick={handleClear}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
              <Button
                variant="hero"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedExam || selectedHalls.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Shuffle className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Generate Allocation
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Results */}
      {examAllocations.length > 0 && (
        <>
          {/* Statistics Overview */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Allocation Statistics
              </CardTitle>
              <CardDescription>Overview of seat allocation distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                  <div className="text-sm text-muted-foreground">Total Allocated</div>
                  <div className="mt-1 text-2xl font-bold text-primary">{examAllocations.length}</div>
                  <div className="text-xs text-muted-foreground">students</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                  <div className="text-sm text-muted-foreground">Halls Used</div>
                  <div className="mt-1 text-2xl font-bold text-accent">
                    {Object.keys(allocationsByHall).length}
                  </div>
                  <div className="text-xs text-muted-foreground">exam halls</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                  <div className="text-sm text-muted-foreground">Avg per Hall</div>
                  <div className="mt-1 text-2xl font-bold">
                    {Math.round(examAllocations.length / Object.keys(allocationsByHall).length)}
                  </div>
                  <div className="text-xs text-muted-foreground">students/hall</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                  <div className="text-sm text-muted-foreground">Utilization</div>
                  <div className="mt-1 text-2xl font-bold text-success">
                    {Math.round((examAllocations.length / totalCapacity) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">of total capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hall-wise Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Hall-wise Distribution
              </CardTitle>
              <CardDescription>Student allocation breakdown by exam hall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(allocationsByHall).map(([hallId, hallAllocations]) => {
                  const hall = getHall(hallId);
                  const utilization = hall
                    ? Math.round((hallAllocations.length / hall.seatingCapacity) * 100)
                    : 0;
                  
                  return (
                    <div
                      key={hallId}
                      className="rounded-lg border border-primary/20 bg-gradient-to-br from-accent/5 to-transparent p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{hall?.hallNumber || 'Unknown'}</h3>
                          <p className="text-xs text-muted-foreground">{hall?.block || 'Main Block'}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {utilization}%
                        </span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{hallAllocations.length}</span>
                        <span className="text-sm text-muted-foreground">
                          / {hall?.seatingCapacity || 0} seats
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Allocation Results
              </CardTitle>
              <CardDescription>
                {examAllocations.length} seats allocated
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-lg border bg-secondary/50 p-1">
                <Button
                  variant={viewMode === 'visual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('visual')}
                  className="h-8"
                >
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  Visual
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8"
                >
                  <List className="mr-2 h-4 w-4" />
                  Table
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'visual' ? (
              /* Visual Seat Map View */
              <div className="space-y-6">
                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg bg-muted/50 p-4">
                  <span className="text-sm font-medium text-muted-foreground">Legend:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-blue-300 bg-blue-50 dark:bg-blue-950/30"></div>
                    <span className="text-sm">School Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-purple-300 bg-purple-50 dark:bg-purple-950/30"></div>
                    <span className="text-sm">College Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      #
                    </div>
                    <span className="text-sm">Seat Number</span>
                  </div>
                </div>
                
                {Object.entries(allocationsByHall).map(([hallId, hallAllocations]) => {
                  const hall = getHall(hallId);
                  
                  return (
                    <div key={hallId} className="rounded-lg border bg-gradient-to-br from-accent/5 to-transparent p-6">
                      <div className="mb-4 flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {hall?.hallNumber || 'Unknown Hall'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {hall?.block || 'Main Block'} • {hallAllocations.length} / {hall?.seatingCapacity || 0} seats
                          </p>
                        </div>
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          {Math.round((hallAllocations.length / (hall?.seatingCapacity || 1)) * 100)}% Full
                        </div>
                      </div>
                      
                      {/* Seat Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {hallAllocations.map((allocation) => {
                          const student = getStudent(allocation.studentId);
                          const institution = student ? getInstitution(student.institutionId) : null;
                          
                          if (!student) return null;
                          
                          const isSchool = isSchoolStudent(student);
                          const bgColor = isSchool 
                            ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800' 
                            : 'bg-purple-50 hover:bg-purple-100 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800';
                          
                          return (
                            <div
                              key={allocation.id}
                              className={`group relative rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${bgColor}`}
                              title={`${student.name} - ${isSchool ? student.rollNumber : (student as CollegeStudent).registerNumber}`}
                            >
                              {/* Seat Number Badge */}
                              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                                {allocation.seatNumber}
                              </div>
                              
                              {/* Student Info */}
                              <div className="space-y-2">
                                <div className="pr-6">
                                  <p className="text-sm font-bold leading-tight line-clamp-2" title={student.name}>
                                    {student.name}
                                  </p>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-xs font-mono text-muted-foreground">
                                    {isSchool ? student.rollNumber : (student as CollegeStudent).registerNumber}
                                  </p>
                                  
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="inline-flex items-center rounded-md bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 text-xs font-semibold">
                                      {isSchool
                                        ? `${student.standard}-${student.section}`
                                        : `${(student as CollegeStudent).department}`}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground line-clamp-1" title={institution?.name}>
                                    {institution?.name || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl group-hover:block dark:bg-slate-100 dark:text-slate-900">
                                <div className="space-y-1 whitespace-nowrap">
                                  <p className="font-bold">{student.name}</p>
                                  <p>{isSchool ? student.rollNumber : (student as CollegeStudent).registerNumber}</p>
                                  <p>{institution?.name}</p>
                                  {isSchool ? (
                                    <p>Standard {student.standard} - Section {student.section}</p>
                                  ) : (
                                    <p>{(student as CollegeStudent).department} - Year {(student as CollegeStudent).year}</p>
                                  )}
                                </div>
                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Seat No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll/Reg No.</TableHead>
                    <TableHead>Class/Dept</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Hall</TableHead>
                    <TableHead>Block</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examAllocations.map((allocation) => {
                    const student = getStudent(allocation.studentId);
                    const hall = getHall(allocation.hallId);
                    const institution = student ? getInstitution(student.institutionId) : null;
                    
                    if (!student) return null;
                    
                    return (
                      <TableRow key={allocation.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-bold text-primary">
                          {allocation.seatNumber}
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {isSchoolStudent(student)
                            ? student.rollNumber
                            : (student as CollegeStudent).registerNumber}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {isSchoolStudent(student)
                              ? `Std ${student.standard} - Sec ${student.section}`
                              : `${(student as CollegeStudent).department} - Year ${
                                  (student as CollegeStudent).year
                                }`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {institution?.name || 'N/A'}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {institution?.type || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                            {hall?.hallNumber || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {hall?.block || 'Main Block'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
        </>
      )}

      {/* Empty State */}
      {selectedExam && examAllocations.length === 0 && (
        <Card>
          <CardContent className="flex h-48 items-center justify-center">
            <div className="text-center">
              <Shuffle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                No allocations generated yet. Configure settings above and click "Generate Allocation".
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Allocations;
