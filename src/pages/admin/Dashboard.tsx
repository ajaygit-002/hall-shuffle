import { useDataStore } from '@/store/dataStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, FileText, DoorOpen, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { institutions, students, exams, halls, allocations } = useDataStore();

  const stats = [
    {
      title: 'Institutions',
      value: institutions.length,
      description: 'Schools & Colleges',
      icon: School,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Students',
      value: students.length,
      description: 'Total enrolled',
      icon: Users,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Exams',
      value: exams.length,
      description: 'Scheduled exams',
      icon: FileText,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Exam Halls',
      value: halls.length,
      description: 'Available halls',
      icon: DoorOpen,
      color: 'bg-warning/10 text-warning',
    },
  ];

  const recentExams = exams.slice(0, 5);
  const totalCapacity = halls.reduce((sum, hall) => sum + hall.seatingCapacity, 0);
  const allocatedSeats = allocations.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your exam allocation system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Allocation Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Allocation Overview
            </CardTitle>
            <CardDescription>Current seating allocation status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Capacity</span>
                <span className="font-semibold">{totalCapacity} seats</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Allocated Seats</span>
                <span className="font-semibold">{allocatedSeats} seats</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Seats</span>
                <span className="font-semibold text-success">
                  {totalCapacity - allocatedSeats} seats
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium">
                    {totalCapacity > 0
                      ? Math.round((allocatedSeats / totalCapacity) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full gradient-primary transition-all duration-500"
                    style={{
                      width: `${
                        totalCapacity > 0
                          ? Math.round((allocatedSeats / totalCapacity) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Exams
            </CardTitle>
            <CardDescription>Latest scheduled examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExams.length > 0 ? (
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{exam.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exam.date).toLocaleDateString()} • {exam.session}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        exam.status === 'upcoming'
                          ? 'bg-accent/10 text-accent'
                          : exam.status === 'ongoing'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No exams scheduled yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: 'Add Institution', href: '/admin/institutions', icon: School },
              { label: 'Add Students', href: '/admin/students', icon: Users },
              { label: 'Create Exam', href: '/admin/exams', icon: FileText },
              { label: 'Generate Allocation', href: '/admin/allocations', icon: DoorOpen },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5"
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
