
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { seedDemoData } from '@/utils/seedData';
import DashboardCard from './DashboardCard';
import DashboardMetric from './DashboardMetric';
import { BarChart4, BookOpen, GraduationCap, Users } from 'lucide-react';
import AttendanceChart from './AttendanceChart';
import ProgressChart from './ProgressChart';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Seed demo data when user is available
    if (user) {
      console.log("Attempting to seed data for user:", user.id);
      seedDemoData(user.id);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your educational statistics and recent activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Total Students"
          value="248"
          trend={{
            value: "+12%",
            direction: "up"
          }}
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardMetric
          title="Average Attendance"
          value="87%"
          trend={{
            value: "+2.3%",
            direction: "up"
          }}
          icon={<BarChart4 className="h-4 w-4" />}
        />
        <DashboardMetric
          title="Active Courses"
          value="12"
          trend={{
            value: "0%",
            direction: "neutral"
          }}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <DashboardMetric
          title="Assignments Due"
          value="8"
          trend={{
            value: "-3",
            direction: "down"
          }}
          icon={<GraduationCap className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardCard title="Student Attendance" className="lg:col-span-4">
          <AttendanceChart />
        </DashboardCard>
        <DashboardCard title="Course Progress" className="lg:col-span-3">
          <ProgressChart />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Upcoming Lessons" className="lg:col-span-1">
          <div className="space-y-4">
            {['Introduction to Algorithms', 'Data Structures', 'Database Design'].map((lesson, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{lesson}</p>
                  <p className="text-sm text-muted-foreground">
                    {['Today', 'Tomorrow', 'May 21'][i]} • {['10:00 AM', '2:30 PM', '9:00 AM'][i]}
                  </p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/lessons">View All Lessons</Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard title="Recent Assignments" className="lg:col-span-1">
          <div className="space-y-4">
            {['Data Analysis Project', 'Algorithm Implementation', 'UI Design Exercise'].map((assignment, i) => (
              <div key={i} className="flex justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{assignment}</p>
                  <p className="text-sm text-muted-foreground">Due {['Yesterday', 'Today', 'May 25'][i]}</p>
                </div>
                <div className="flex items-center">
                  <div className={`rounded-full px-2 py-1 text-xs ${
                    i === 0 ? 'bg-red-100 text-red-800' : 
                    i === 1 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {['Late', 'Due', 'On Track'][i]}
                  </div>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/assignments">View All Assignments</Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard title="Top Students" className="lg:col-span-1">
          <div className="space-y-4">
            {['Alex Johnson', 'Maya Patel', 'Sam Wilson'].map((student, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <span className="text-sm font-medium">{student.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-medium">{student}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Grade: A{i === 0 ? '+' : ''}</span>
                    <span className="mx-1">•</span>
                    <span>Attendance: {[98, 95, 92][i]}%</span>
                  </div>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/students">View All Students</Link>
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
