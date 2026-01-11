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
import { useToast } from '@/hooks/use-toast';
import { Shuffle, Download, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { SchoolStudent, CollegeStudent } from '@/types';

const Allocations = () => {
  const { exams, halls, students, allocations, generateAllocations, clearAllocations } =
    useDataStore();
  const { toast } = useToast();
  
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedHalls, setSelectedHalls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const isSchoolStudent = (student: any): student is SchoolStudent => {
    return 'rollNumber' in student;
  };

  const totalCapacity = selectedHalls.reduce((sum, hallId) => {
    const hall = halls.find((h) => h.id === hallId);
    return sum + (hall?.seatingCapacity || 0);
  }, 0);

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
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seat Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Class/Dept</TableHead>
                    <TableHead>Hall</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examAllocations.map((allocation) => {
                    const student = getStudent(allocation.studentId);
                    const hall = getHall(allocation.hallId);
                    
                    if (!student) return null;
                    
                    return (
                      <TableRow key={allocation.id}>
                        <TableCell className="font-mono font-medium">
                          {allocation.seatNumber}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {isSchoolStudent(student)
                            ? student.rollNumber
                            : (student as CollegeStudent).registerNumber}
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                            {isSchoolStudent(student)
                              ? `${student.standard}th - ${student.section}`
                              : `${(student as CollegeStudent).department} - Y${
                                  (student as CollegeStudent).year
                                }`}
                          </span>
                        </TableCell>
                        <TableCell>{hall?.hallNumber}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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
