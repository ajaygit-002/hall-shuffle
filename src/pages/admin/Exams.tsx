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
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, FileText, Calendar } from 'lucide-react';
import { Exam } from '@/types';

const Exams = () => {
  const { exams, institutions, addExam, updateExam, deleteExam } = useDataStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    session: 'morning' as 'morning' | 'afternoon',
    institutionId: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      session: 'morning',
      institutionId: '',
      status: 'upcoming',
    });
    setEditingId(null);
  };

  const generateDemoExam = () => {
    if (institutions.length === 0) {
      toast({
        title: 'No Institutions',
        description: 'Please add at least one institution first.',
        variant: 'destructive',
      });
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const demoExam: Exam = {
      id: `exam-demo-${Date.now()}`,
      name: `Demo Exam - ${new Date().toLocaleDateString()}`,
      date: tomorrow,
      session: 'morning',
      institutionId: institutions[0].id,
      status: 'upcoming',
    };

    addExam(demoExam);
    toast({
      title: 'Demo Exam Created',
      description: 'A demo exam has been created for testing allocations.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const examData: Exam = {
      id: editingId || `exam-${Date.now()}`,
      name: formData.name,
      date: new Date(formData.date),
      session: formData.session,
      institutionId: formData.institutionId,
      status: formData.status,
    };
    
    if (editingId) {
      updateExam(editingId, examData);
      toast({ title: 'Exam Updated', description: 'Exam details have been updated.' });
    } else {
      addExam(examData);
      toast({ title: 'Exam Created', description: 'New exam has been scheduled.' });
    }
    
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      date: new Date(exam.date).toISOString().split('T')[0],
      session: exam.session,
      institutionId: exam.institutionId,
      status: exam.status,
    });
    setEditingId(exam.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteExam(id);
    toast({
      title: 'Exam Deleted',
      description: 'Exam has been removed from the system.',
      variant: 'destructive',
    });
  };

  const getInstitutionName = (id: string) => {
    return institutions.find((i) => i.id === id)?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-accent/10 text-accent';
      case 'ongoing':
        return 'bg-warning/10 text-warning';
      case 'completed':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Exams</h1>
          <p className="mt-1 text-muted-foreground">
            Schedule and manage examinations
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateDemoExam}>
            Generate Demo Exam
          </Button>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Exam' : 'Create New Exam'}
              </DialogTitle>
              <DialogDescription>
                Schedule a new examination
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Exam Name</Label>
                <Input
                  placeholder="e.g., Mid-term Examination"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session</Label>
                  <Select
                    value={formData.session}
                    onValueChange={(v: 'morning' | 'afternoon') =>
                      setFormData({ ...formData, session: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Institution</Label>
                <Select
                  value={formData.institutionId}
                  onValueChange={(v) => setFormData({ ...formData, institutionId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: 'upcoming' | 'ongoing' | 'completed') =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingId ? 'Update' : 'Create Exam'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter((e) => e.status === 'upcoming').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter((e) => e.status === 'ongoing').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter((e) => e.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
          <CardDescription>A list of all scheduled examinations</CardDescription>
        </CardHeader>
        <CardContent>
          {exams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>
                      {new Date(exam.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{exam.session}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getInstitutionName(exam.institutionId)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(
                          exam.status
                        )}`}
                      >
                        {exam.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(exam)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exam.id)}
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
                No exams scheduled yet. Click "Create Exam" to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Exams;
