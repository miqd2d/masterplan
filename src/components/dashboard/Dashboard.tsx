
import React, { useEffect, useState } from 'react';
import { seedDemoData } from '@/utils/seedData';
import { useAuth } from '@/contexts/AuthContext';
import AttendanceChart from './AttendanceChart';
import ProgressChart from './ProgressChart';
import DashboardCard from './DashboardCard';
import DashboardMetric from './DashboardMetric';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, FileText, Users, FolderKanban, GraduationCap, AlertTriangle, Award, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dataSeeded, setDataSeeded] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalLessons: 0,
    assignmentsThisWeek: 0,
    lowAttendanceCount: 0,
    lowMarksCount: 0,
  });
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  useEffect(() => {
    async function initialize() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data: existingStudents, error: checkError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
          
        if (checkError) {
          console.error('Error checking for existing data:', checkError);
        }
        
        if (!existingStudents || existingStudents.length === 0) {
          console.log('No existing data found, seeding demo data...');
          await seedDemoData(user.id);
          setDataSeeded(true);
        } else {
          console.log('Existing data found, skipping seed');
        }
        
        const [studentsResult, assignmentsResult, lessonsResult] = await Promise.all([
          supabase.from('students').select('*').eq('user_id', user.id),
          supabase.from('assignments').select('*').eq('user_id', user.id),
          supabase.from('lessons').select('*').eq('user_id', user.id)
        ]);
        
        const students = studentsResult.data || [];
        const assignments = assignmentsResult.data || [];
        const lessons = lessonsResult.data || [];
        
        const lowAttendance = students.filter(s => s.attendance < 75);
        const lowMarksStudents = students.filter(s => (s.marks || 0) < 60);
        const activeAssignments = assignments.filter(a => a.status === 'Active');
        
        // Sort students by marks to get top performers
        const sortedByMarks = [...students].sort((a, b) => (b.marks || 0) - (a.marks || 0));
        
        setLowAttendanceStudents(lowAttendance);
        setTopPerformers(sortedByMarks.slice(0, 3));
        
        setStats({
          totalStudents: students.length,
          totalAssignments: assignments.length,
          totalLessons: lessons.length,
          assignmentsThisWeek: activeAssignments.length,
          lowAttendanceCount: lowAttendance.length,
          lowMarksCount: lowMarksStudents ? lowMarksStudents.length : 0,
        });
        
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initialize();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container max-w-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </header>
    
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardMetric 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users className="h-5 w-5" />} 
          trend={{ value: 12, direction: 'up', label: 'from last month' }}
        />
        <DashboardMetric 
          title="Total Assignments" 
          value={stats.totalAssignments} 
          icon={<FileText className="h-5 w-5" />} 
          trend={{ value: 8, direction: 'up', label: 'from last month' }}
        />
        <DashboardMetric 
          title="Total Lessons" 
          value={stats.totalLessons} 
          icon={<GraduationCap className="h-5 w-5" />} 
          trend={{ value: 2, direction: 'up', label: 'from last month' }}
        />
        <DashboardMetric 
          title="Assignments This Week" 
          value={stats.assignmentsThisWeek} 
          icon={<FolderKanban className="h-5 w-5" />} 
          trend={{ value: 3, direction: 'up', label: 'from last week' }}
        />
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard 
          title="Course Progress" 
          icon={<GraduationCap className="h-5 w-5" />}
        >
          <ProgressChart />
        </DashboardCard>
        
        <DashboardCard 
          title="Attendance Overview" 
          icon={<Calendar className="h-5 w-5" />}
        >
          <AttendanceChart />
        </DashboardCard>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Upcoming Deadlines" icon={<Calendar className="h-5 w-5" />}>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-sm">Assignment 2: Data Types</span>
              <span className="text-xs text-muted-foreground">Tomorrow</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Group Project: Neural Network</span>
              <span className="text-xs text-muted-foreground">In 3 days</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Case Study: Security</span>
              <span className="text-xs text-muted-foreground">In 5 days</span>
            </li>
          </ul>
        </DashboardCard>
        
        <DashboardCard title="Attendance Alerts" icon={<AlertTriangle className="h-5 w-5" />}>
          <div className="text-sm">
            <p className="mb-3">{stats.lowAttendanceCount} students below 75% attendance</p>
            {stats.lowAttendanceCount > 0 ? (
              <ul className="space-y-3">
                {lowAttendanceStudents.slice(0, 2).map((student, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{student.name}</span>
                    <span className="text-red-600">{student.attendance}%</span>
                  </li>
                ))}
                {stats.lowAttendanceCount > 2 && (
                  <li className="text-xs text-muted-foreground">
                    And {stats.lowAttendanceCount - 2} more students...
                  </li>
                )}
              </ul>
            ) : (
              <p>No students with low attendance.</p>
            )}
          </div>
        </DashboardCard>
        
        <DashboardCard title="Top Performers" icon={<Award className="h-5 w-5" />}>
          <ul className="space-y-4">
            {topPerformers.map((student, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-sm">{student.name}</span>
                <span className="text-xs">{student.marks}% marks</span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </section>
    </div>
  );
};

export default Dashboard;
