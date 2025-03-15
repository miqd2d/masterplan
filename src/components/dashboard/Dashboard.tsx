
import React from 'react';
import { Users, Calendar, BookOpen, ClipboardCheck, AlertTriangle, BookMarked, PieChart } from 'lucide-react';
import DashboardCard from './DashboardCard';
import DashboardMetric from './DashboardMetric';
import AttendanceChart from './AttendanceChart';
import ProgressChart from './ProgressChart';
import AnimatedChip from '../ui-custom/AnimatedChip';
import { Button } from '@/components/ui/button';

// Mock data for attendance chart
const attendanceData = [
  { name: 'Above 90%', value: 65, color: 'rgba(34, 197, 94, 0.9)' },
  { name: '75-90%', value: 20, color: 'rgba(250, 204, 21, 0.7)' },
  { name: 'Below 75%', value: 15, color: 'rgba(239, 68, 68, 0.7)' },
];

// Mock data for progress chart
const progressData = [
  { name: 'CS101', completed: 12, remaining: 3 },
  { name: 'CS201', completed: 8, remaining: 7 },
  { name: 'CS301', completed: 5, remaining: 10 },
];

// Mock data for pending assignments
const pendingAssignments = [
  { id: 1, title: 'Assignment 3: Algorithm Analysis', dueDate: '2023-05-15', course: 'CS201', submissionsMissing: 5 },
  { id: 2, title: 'Lab Report: Binary Trees', dueDate: '2023-05-17', course: 'CS301', submissionsMissing: 7 },
  { id: 3, title: 'Final Project: Database Design', dueDate: '2023-05-20', course: 'CS101', submissionsMissing: 3 },
];

// Mock data for today's schedule
const todaySchedule = [
  { id: 1, title: 'CS101 Lecture', time: '09:00 - 10:30', location: 'Room 302' },
  { id: 2, title: 'Office Hours', time: '11:00 - 12:30', location: 'Room 401' },
  { id: 3, title: 'CS301 Lab Session', time: '14:00 - 16:00', location: 'Lab 201' },
  { id: 4, title: 'Faculty Meeting', time: '16:30 - 17:30', location: 'Conference Room' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Students" 
          icon={<Users className="h-4 w-4" />}
        >
          <DashboardMetric
            title="Enrolled Students"
            value="248"
            trend={{ value: "12", direction: "up", label: "vs last term" }}
          />
        </DashboardCard>
        
        <DashboardCard 
          title="Attendance Rate" 
          icon={<Calendar className="h-4 w-4" />}
        >
          <DashboardMetric
            title="Average Attendance"
            value="85%"
            trend={{ value: "3%", direction: "down", label: "vs last month" }}
          />
        </DashboardCard>
        
        <DashboardCard 
          title="Lesson Completion" 
          icon={<BookOpen className="h-4 w-4" />}
        >
          <DashboardMetric
            title="Progress"
            value="68%"
            trend={{ value: "5%", direction: "up", label: "this week" }}
          />
        </DashboardCard>
        
        <DashboardCard 
          title="Assignment Status" 
          icon={<ClipboardCheck className="h-4 w-4" />}
          badge={{ text: "15 Pending", color: "warning" }}
        >
          <DashboardMetric
            title="Submission Rate"
            value="78%"
            trend={{ value: "2%", direction: "up", label: "this week" }}
          />
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Student Attendance Distribution" 
          icon={<PieChart className="h-4 w-4" />}
          className="lg:col-span-1"
        >
          <AttendanceChart data={attendanceData} />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <AnimatedChip color="success" className="mb-1">65%</AnimatedChip>
              <span className="text-xs text-center">Above 90%</span>
            </div>
            <div className="flex flex-col items-center">
              <AnimatedChip color="warning" className="mb-1">20%</AnimatedChip>
              <span className="text-xs text-center">75-90%</span>
            </div>
            <div className="flex flex-col items-center">
              <AnimatedChip color="danger" className="mb-1">15%</AnimatedChip>
              <span className="text-xs text-center">Below 75%</span>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <Button variant="outline" size="sm" className="text-xs">
              View Details
            </Button>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Course Progress Tracker" 
          icon={<BookMarked className="h-4 w-4" />}
          description="Lessons completed vs remaining by course"
          className="lg:col-span-2"
        >
          <ProgressChart data={progressData} />
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard 
          title="Pending Assignments" 
          icon={<ClipboardCheck className="h-4 w-4" />}
          badge={{ text: "3 Due this week", color: "warning" }}
        >
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center p-3 rounded-lg bg-secondary/40 backdrop-blur-sm"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{assignment.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{assignment.course}</span>
                    <span className="mx-1">•</span>
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <AnimatedChip color="danger" animation="pulse">
                  {assignment.submissionsMissing} missing
                </AnimatedChip>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm">
              View All Assignments
            </Button>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Today's Schedule" 
          icon={<Calendar className="h-4 w-4" />}
          badge={{ text: "4 Events", color: "primary" }}
        >
          <div className="space-y-3">
            {todaySchedule.map((event) => (
              <div
                key={event.id}
                className="flex items-center p-3 rounded-lg bg-secondary/40 backdrop-blur-sm"
              >
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{event.time}</span>
                    <span className="mx-1">•</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm">
              View Full Calendar
            </Button>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Student Concerns" 
        icon={<AlertTriangle className="h-4 w-4" />}
        badge={{ text: "2 New", color: "danger" }}
      >
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatedChip color="primary">Assignment difficulty</AnimatedChip>
          <AnimatedChip color="primary">Grading clarification</AnimatedChip>
          <AnimatedChip color="primary">Material accessibility</AnimatedChip>
          <AnimatedChip color="danger" animation="pulse">Exam preparation</AnimatedChip>
          <AnimatedChip color="danger" animation="pulse">Lab equipment issues</AnimatedChip>
        </div>
        <p className="text-sm text-muted-foreground">
          Students have raised concerns about the difficulty of recent assignments and exam preparation materials. 
          There are also some reports about lab equipment issues affecting coursework completion.
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm">
            Review All Feedback
          </Button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
