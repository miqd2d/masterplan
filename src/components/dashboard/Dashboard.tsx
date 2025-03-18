
import React, { useEffect, useState } from 'react';
import { seedDemoData } from '@/utils/seedData';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import AttendanceChart from './AttendanceChart';
import ProgressChart from './ProgressChart';
import DashboardCard from './DashboardCard';
import DashboardMetric from './DashboardMetric';
import ContextAI from '@/components/context-ai/ContextAI';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, FileText, Users, FolderKanban, GraduationCap, AlertTriangle, Award, Clock, Plus } from 'lucide-react';
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

  useEffect(() => {
    async function initialize() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if data exists
        const { data: existingStudents, error: checkError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
          
        if (checkError) {
          console.error('Error checking for existing data:', checkError);
        }
        
        // If no data exists, seed demo data
        if (!existingStudents || existingStudents.length === 0) {
          console.log('No existing data found, seeding demo data...');
          await seedDemoData(user.id);
          setDataSeeded(true);
        } else {
          console.log('Existing data found, skipping seed');
        }
        
        // Fetch stats
        const [studentsResult, assignmentsResult, lessonsResult] = await Promise.all([
          supabase.from('students').select('*').eq('user_id', user.id),
          supabase.from('assignments').select('*').eq('user_id', user.id),
          supabase.from('lessons').select('*').eq('user_id', user.id)
        ]);
        
        const students = studentsResult.data || [];
        const assignments = assignmentsResult.data || [];
        const lessons = lessonsResult.data || [];
        
        // Calculate stats
        const lowAttendanceStudents = students.filter(s => s.attendance < 75);
        const lowMarksStudents = students.filter(s => (s.marks || 0) < 60);
        const activeAssignments = assignments.filter(a => a.status === 'Active');
        
        setStats({
          totalStudents: students.length,
          totalAssignments: assignments.length,
          totalLessons: lessons.length,
          assignmentsThisWeek: activeAssignments.length,
          lowAttendanceCount: lowAttendanceStudents.length,
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
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-6">
        <section className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </section>
      
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart />
          <AttendanceChart />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Upcoming Deadlines" icon={<Calendar className="h-5 w-5" />}>
            <ul className="space-y-3">
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
              <p className="mb-2">{stats.lowAttendanceCount} students below 75% attendance</p>
              <ul className="space-y-2">
                {stats.lowAttendanceCount > 0 ? (
                  <>
                    <li className="flex justify-between">
                      <span>Priya Patel</span>
                      <span className="text-red-600">65%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Rahul Verma</span>
                      <span className="text-red-600">72%</span>
                    </li>
                    {stats.lowAttendanceCount > 2 && (
                      <li className="text-xs text-muted-foreground">
                        And {stats.lowAttendanceCount - 2} more students...
                      </li>
                    )}
                  </>
                ) : (
                  <li>No students with low attendance.</li>
                )}
              </ul>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Top Performers" icon={<Award className="h-5 w-5" />}>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-sm">Arjun Sharma</span>
                <span className="text-xs">96% marks</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Kavita Reddy</span>
                <span className="text-xs">94% marks</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Rajesh Khanna</span>
                <span className="text-xs">92% marks</span>
              </li>
            </ul>
          </DashboardCard>
        </section>
        
        <section className="grid grid-cols-1 gap-6">
          <div className="h-[400px]">
            <DashboardCard title="AI Assistant" icon={<Clock className="h-5 w-5" />} className="h-full">
              <div className="h-full">
                <ContextAI placeholder="Ask about your teaching data..." />
              </div>
            </DashboardCard>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
