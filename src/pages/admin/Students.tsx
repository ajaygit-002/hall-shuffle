import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import { SchoolStudent, CollegeStudent } from '@/types';

const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'AIDS'] as const;
const standards = Array.from({ length: 12 }, (_, i) => i + 1);
const sections = ['A', 'B', 'C', 'D', 'E'];
const years = [1, 2, 3, 4] as const;

const Students = () => {
  const { students, institutions, addStudent, addStudents, updateStudent, deleteStudent } = useDataStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [studentType, setStudentType] = useState<'school' | 'college'>('school');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    rollNumber: '',
    standard: 1,
    section: 'A',
    institutionId: '',
  });
  
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    registerNumber: '',
    department: 'CSE' as typeof departments[number],
    year: 1 as typeof years[number],
    institutionId: '',
  });

  const resetForm = () => {
    setSchoolForm({ name: '', rollNumber: '', standard: 1, section: 'A', institutionId: '' });
    setCollegeForm({ name: '', registerNumber: '', department: 'CSE', year: 1, institutionId: '' });
    setEditingId(null);
  };

  const schoolStudents = students.filter((s): s is SchoolStudent => 'rollNumber' in s);
  const collegeStudents = students.filter((s): s is CollegeStudent => 'registerNumber' in s);

  const filteredSchoolStudents = schoolStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCollegeStudents = collegeStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentType === 'school') {
      const newStudent: SchoolStudent = {
        id: editingId || `sch-${Date.now()}`,
        ...schoolForm,
      };
      
      if (editingId) {
        updateStudent(editingId, newStudent);
        toast({ title: 'Student Updated', description: 'Student record has been updated.' });
      } else {
        addStudent(newStudent);
        toast({ title: 'Student Added', description: 'New student has been added.' });
      }
    } else {
      const newStudent: CollegeStudent = {
        id: editingId || `col-${Date.now()}`,
        ...collegeForm,
      };
      
      if (editingId) {
        updateStudent(editingId, newStudent);
        toast({ title: 'Student Updated', description: 'Student record has been updated.' });
      } else {
        addStudent(newStudent);
        toast({ title: 'Student Added', description: 'New student has been added.' });
      }
    }
    
    setIsOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    toast({
      title: 'Student Deleted',
      description: 'Student has been removed from the system.',
      variant: 'destructive',
    });
  };

  const generateDemoStudents = () => {
    if (institutions.length === 0) {
      toast({
        title: 'No Institutions',
        description: 'Please add at least one institution first.',
        variant: 'destructive',
      });
      return;
    }

    const schoolInstitutions = institutions.filter((i) => i.type === 'school');
    const collegeInstitutions = institutions.filter((i) => i.type === 'college');
    const demoStudents: Student[] = [];

    // Generate 500 school students
    for (let i = 0; i < 500; i++) {
      const institution = schoolInstitutions[i % schoolInstitutions.length];
      const standard = (i % 12) + 1;
      const section = sections[i % sections.length];
      const rollNumber = `ROLL${String(i + 1).padStart(5, '0')}`;
      
      demoStudents.push({
        id: `sch-demo-${Date.now()}-${i}`,
        name: `School Student ${i + 1}`,
        rollNumber,
        standard,
        section,
        institutionId: institution.id,
      } as SchoolStudent);
    }

    // Generate 500 college students
    if (collegeInstitutions.length > 0) {
      for (let i = 0; i < 500; i++) {
        const institution = collegeInstitutions[i % collegeInstitutions.length];
        const department = departments[i % departments.length];
        const year = ((i % 4) + 1) as typeof years[number];
        const registerNumber = `REG${String(i + 1).padStart(5, '0')}`;
        
        demoStudents.push({
          id: `col-demo-${Date.now()}-${i}`,
          name: `College Student ${i + 1}`,
          registerNumber,
          department,
          year,
          institutionId: institution.id,
        } as CollegeStudent);
      }
    } else {
      // If no college institutions, add remaining 500 as school students
      for (let i = 500; i < 1000; i++) {
        const institution = schoolInstitutions[i % schoolInstitutions.length];
        const standard = (i % 12) + 1;
        const section = sections[i % sections.length];
        const rollNumber = `ROLL${String(i + 1).padStart(5, '0')}`;
        
        demoStudents.push({
          id: `sch-demo-${Date.now()}-${i}`,
          name: `School Student ${i + 1}`,
          rollNumber,
          standard,
          section,
          institutionId: institution.id,
        } as SchoolStudent);
      }
    }

    addStudents(demoStudents);
    toast({
      title: 'Demo Students Generated',
      description: `Added ${demoStudents.length} demo students successfully!`,
    });
  };

  const generateSchoolStudents = () => {
    const schoolInstitutions = institutions.filter((i) => i.type === 'school');
    
    if (schoolInstitutions.length === 0) {
      toast({
        title: 'No Schools',
        description: 'Please add at least one school institution first.',
        variant: 'destructive',
      });
      return;
    }

    const schoolStudents: SchoolStudent[] = [];

    // Generate 100 school students
    for (let i = 0; i < 100; i++) {
      const institution = schoolInstitutions[i % schoolInstitutions.length];
      const standard = (i % 12) + 1;
      const section = sections[i % sections.length];
      const rollNumber = `ROLL${String(i + 1).padStart(5, '0')}`;
      
      schoolStudents.push({
        id: `sch-school-${Date.now()}-${i}`,
        name: `School Student ${i + 1}`,
        rollNumber,
        standard,
        section,
        institutionId: institution.id,
      });
    }

    addStudents(schoolStudents);
    toast({
      title: 'School Students Generated',
      description: `Added ${schoolStudents.length} school students successfully!`,
    });
  };

  const getInstitutionName = (id: string) => {
    return institutions.find((i) => i.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">
            Manage student records for schools and colleges
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateSchoolStudents}>
            Generate 100 School Students
          </Button>
          <Button variant="outline" onClick={generateDemoStudents}>
            Generate 1000 Demo Students
          </Button>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
              <DialogDescription>
                Enter student details below
              </DialogDescription>
            </DialogHeader>

            {/* Student Type Toggle */}
            <div className="flex rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => setStudentType('school')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  studentType === 'school'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                School
              </button>
              <button
                type="button"
                onClick={() => setStudentType('college')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  studentType === 'college'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                College
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {studentType === 'school' ? (
                <>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Student name"
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Roll Number</Label>
                    <Input
                      placeholder="Roll number"
                      value={schoolForm.rollNumber}
                      onChange={(e) => setSchoolForm({ ...schoolForm, rollNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standard</Label>
                      <Select
                        value={String(schoolForm.standard)}
                        onValueChange={(v) => setSchoolForm({ ...schoolForm, standard: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {standards.map((s) => (
                            <SelectItem key={s} value={String(s)}>
                              {s}th
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select
                        value={schoolForm.section}
                        onValueChange={(v) => setSchoolForm({ ...schoolForm, section: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Select
                      value={schoolForm.institutionId}
                      onValueChange={(v) => setSchoolForm({ ...schoolForm, institutionId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions
                          .filter((i) => i.type === 'school')
                          .map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Student name"
                      value={collegeForm.name}
                      onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Register Number</Label>
                    <Input
                      placeholder="Register number"
                      value={collegeForm.registerNumber}
                      onChange={(e) => setCollegeForm({ ...collegeForm, registerNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        value={collegeForm.department}
                        onValueChange={(v: typeof departments[number]) =>
                          setCollegeForm({ ...collegeForm, department: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Select
                        value={String(collegeForm.year)}
                        onValueChange={(v) =>
                          setCollegeForm({ ...collegeForm, year: parseInt(v) as typeof years[number] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              Year {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Select
                      value={collegeForm.institutionId}
                      onValueChange={(v) => setCollegeForm({ ...collegeForm, institutionId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions
                          .filter((i) => i.type === 'college')
                          .map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingId ? 'Update' : 'Add Student'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {schoolStudents.length} School Students
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2">
            <Users className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">
              {collegeStudents.length} College Students
            </span>
          </div>
        </div>
      </div>

      {/* Students Tables */}
      <Tabs defaultValue="school" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school">School Students</TabsTrigger>
          <TabsTrigger value="college">College Students</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Students</CardTitle>
              <CardDescription>Students enrolled in schools</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSchoolStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchoolStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.standard}th</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {getInstitutionName(student.institutionId)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No school students found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college">
          <Card>
            <CardHeader>
              <CardTitle>College Students</CardTitle>
              <CardDescription>Students enrolled in colleges</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCollegeStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Register Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollegeStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.registerNumber}</TableCell>
                        <TableCell>
                          <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                            {student.department}
                          </span>
                        </TableCell>
                        <TableCell>Year {student.year}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {getInstitutionName(student.institutionId)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No college students found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
