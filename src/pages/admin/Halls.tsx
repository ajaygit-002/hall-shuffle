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
import { Plus, Pencil, Trash2, DoorOpen, Users } from 'lucide-react';
import { ExamHall } from '@/types';

const Halls = () => {
  const { halls, institutions, addHall, updateHall, deleteHall } = useDataStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hallNumber: '',
    seatingCapacity: 30,
    block: '',
    institutionId: '',
  });

  const resetForm = () => {
    setFormData({
      hallNumber: '',
      seatingCapacity: 30,
      block: '',
      institutionId: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hallData: ExamHall = {
      id: editingId || `hall-${Date.now()}`,
      ...formData,
    };
    
    if (editingId) {
      updateHall(editingId, hallData);
      toast({ title: 'Hall Updated', description: 'Hall details have been updated.' });
    } else {
      addHall(hallData);
      toast({ title: 'Hall Added', description: 'New exam hall has been added.' });
    }
    
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (hall: ExamHall) => {
    setFormData({
      hallNumber: hall.hallNumber,
      seatingCapacity: hall.seatingCapacity,
      block: hall.block || '',
      institutionId: hall.institutionId,
    });
    setEditingId(hall.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteHall(id);
    toast({
      title: 'Hall Deleted',
      description: 'Hall has been removed from the system.',
      variant: 'destructive',
    });
  };

  const getInstitutionName = (id: string) => {
    return institutions.find((i) => i.id === id)?.name || 'Unknown';
  };

  const totalCapacity = halls.reduce((sum, h) => sum + h.seatingCapacity, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Exam Halls</h1>
          <p className="mt-1 text-muted-foreground">
            Manage exam halls and seating capacity
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Hall
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Hall' : 'Add New Hall'}
              </DialogTitle>
              <DialogDescription>
                Configure exam hall details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hall Number</Label>
                  <Input
                    placeholder="e.g., H101"
                    value={formData.hallNumber}
                    onChange={(e) => setFormData({ ...formData, hallNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Block (Optional)</Label>
                  <Input
                    placeholder="e.g., Block A"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Seating Capacity</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.seatingCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) || 1 })
                  }
                  required
                />
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingId ? 'Update' : 'Add Hall'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Halls</CardTitle>
            <DoorOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{halls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity} seats</div>
          </CardContent>
        </Card>
      </div>

      {/* Halls Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Exam Halls</CardTitle>
          <CardDescription>A list of all available exam halls</CardDescription>
        </CardHeader>
        <CardContent>
          {halls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hall Number</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {halls.map((hall) => (
                  <TableRow key={hall.id}>
                    <TableCell className="font-medium">{hall.hallNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {hall.block || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        <Users className="h-3 w-3" />
                        {hall.seatingCapacity} seats
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getInstitutionName(hall.institutionId)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(hall)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(hall.id)}
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
                No halls added yet. Click "Add Hall" to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Halls;
