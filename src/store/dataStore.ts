import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Institution, Student, Exam, ExamHall, SeatAllocation, SchoolStudent, CollegeStudent } from '@/types';

interface DataState {
  institutions: Institution[];
  students: Student[];
  exams: Exam[];
  halls: ExamHall[];
  allocations: SeatAllocation[];
  
  // Institution actions
  addInstitution: (institution: Institution) => void;
  updateInstitution: (id: string, updates: Partial<Institution>) => void;
  deleteInstitution: (id: string) => void;
  
  // Student actions
  addStudent: (student: Student) => void;
  addStudents: (students: Student[]) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Exam actions
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  // Hall actions
  addHall: (hall: ExamHall) => void;
  updateHall: (id: string, updates: Partial<ExamHall>) => void;
  deleteHall: (id: string) => void;
  
  // Allocation actions
  generateAllocations: (examId: string, hallIds: string[]) => void;
  clearAllocations: (examId: string) => void;
}

// Fisher-Yates shuffle
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if student is a school student
const isSchoolStudent = (student: Student): student is SchoolStudent => {
  return 'rollNumber' in student;
};

// Advanced allocation algorithm
const allocateStudents = (
  students: Student[],
  halls: ExamHall[],
  examId: string
): SeatAllocation[] => {
  if (students.length === 0 || halls.length === 0) {
    return [];
  }

  const shuffled = shuffleArray(students);
  const allocations: SeatAllocation[] = [];
  let studentIndex = 0;
  let allocationCounter = 0;

  for (const hall of halls) {
    for (let seat = 1; seat <= hall.seatingCapacity && studentIndex < shuffled.length; seat++) {
      // Try to find a student that doesn't violate constraints
      let allocated = false;
      
      for (let attempt = 0; attempt < shuffled.length - studentIndex && !allocated; attempt++) {
        const candidateIndex = studentIndex + attempt;
        if (candidateIndex >= shuffled.length) break;
        
        const candidate = shuffled[candidateIndex];
        
        // Check if placing this student violates constraints
        const lastAllocation = allocations.filter(a => a.hallId === hall.id).slice(-1)[0];
        
        if (lastAllocation) {
          const lastStudent = students.find(s => s.id === lastAllocation.studentId);
          
          if (lastStudent && candidate) {
            const sameGroup = isSchoolStudent(candidate) && isSchoolStudent(lastStudent)
              ? (candidate as SchoolStudent).standard === (lastStudent as SchoolStudent).standard
              : !isSchoolStudent(candidate) && !isSchoolStudent(lastStudent)
                ? (candidate as CollegeStudent).department === (lastStudent as CollegeStudent).department
                : false;
            
            if (sameGroup && attempt < shuffled.length - studentIndex - 1) {
              continue; // Try another student
            }
          }
        }
        
        // Swap candidate to current position and allocate
        [shuffled[studentIndex], shuffled[candidateIndex]] = [shuffled[candidateIndex], shuffled[studentIndex]];
        
        allocations.push({
          id: `alloc-${examId}-${hall.id}-${allocationCounter++}`,
          examId,
          hallId: hall.id,
          studentId: candidate.id,
          seatNumber: `${hall.hallNumber}-${String(seat).padStart(3, '0')}`,
          allocatedAt: new Date(),
        });
        
        studentIndex++;
        allocated = true;
      }
      
      if (!allocated && studentIndex < shuffled.length) {
        // Fallback: just allocate the next student
        allocations.push({
          id: `alloc-${examId}-${hall.id}-${allocationCounter++}`,
          examId,
          hallId: hall.id,
          studentId: shuffled[studentIndex].id,
          seatNumber: `${hall.hallNumber}-${String(seat).padStart(3, '0')}`,
          allocatedAt: new Date(),
        });
        studentIndex++;
      }
    }
  }

  return allocations;
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      institutions: [],
      students: [],
      exams: [],
      halls: [],
      allocations: [],

      addInstitution: (institution) =>
        set((state) => ({ institutions: [...state.institutions, institution] })),
      updateInstitution: (id, updates) =>
        set((state) => ({
          institutions: state.institutions.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      deleteInstitution: (id) =>
        set((state) => ({
          institutions: state.institutions.filter((i) => i.id !== id),
        })),

      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),
      addStudents: (newStudents) =>
        set((state) => ({ students: [...state.students, ...newStudents] })),
      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      addExam: (exam) =>
        set((state) => ({ exams: [...state.exams, exam] })),
      updateExam: (id, updates) =>
        set((state) => ({
          exams: state.exams.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
        })),

      addHall: (hall) =>
        set((state) => ({ halls: [...state.halls, hall] })),
      updateHall: (id, updates) =>
        set((state) => ({
          halls: state.halls.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),
      deleteHall: (id) =>
        set((state) => ({
          halls: state.halls.filter((h) => h.id !== id),
        })),

      generateAllocations: (examId, hallIds) => {
        const { students, halls } = get();
        const selectedHalls = halls.filter((h) => hallIds.includes(h.id));
        const newAllocations = allocateStudents(students, selectedHalls, examId);
        
        set((state) => ({
          allocations: [
            ...state.allocations.filter((a) => a.examId !== examId),
            ...newAllocations,
          ],
        }));
      },
      clearAllocations: (examId) =>
        set((state) => ({
          allocations: state.allocations.filter((a) => a.examId !== examId),
        })),
    }),
    {
      name: 'exam-data-storage',
    }
  )
);
