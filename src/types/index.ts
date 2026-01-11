export type UserRole = 'admin' | 'student';

export type InstitutionType = 'school' | 'college';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  address?: string;
  createdAt: Date;
}

export interface SchoolStudent {
  id: string;
  name: string;
  rollNumber: string;
  standard: number; // 1-12
  section: string;
  institutionId: string;
}

export interface CollegeStudent {
  id: string;
  name: string;
  registerNumber: string;
  department: 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'IT' | 'EEE' | 'AIDS';
  year: 1 | 2 | 3 | 4;
  institutionId: string;
}

export type Student = SchoolStudent | CollegeStudent;

export interface Exam {
  id: string;
  name: string;
  date: Date;
  session: 'morning' | 'afternoon';
  institutionId: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ExamHall {
  id: string;
  hallNumber: string;
  seatingCapacity: number;
  institutionId: string;
  block?: string;
}

export interface SeatAllocation {
  id: string;
  examId: string;
  hallId: string;
  studentId: string;
  seatNumber: string;
  allocatedAt: Date;
}

export interface HallAllocation {
  hall: ExamHall;
  allocations: Array<{
    seatNumber: string;
    student: Student;
  }>;
}
