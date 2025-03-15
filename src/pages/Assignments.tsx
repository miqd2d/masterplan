
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, Download, Filter, Plus, Search, XCircle } from 'lucide-react';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';

// Mock assignment data
const assignments = [
  {
    id: 1,
    title: 'Assignment 1: Introduction to Programming Concepts',
    course: 'CS101',
    dueDate: '2023-05-10',
    status: 'Completed',
    submissionRate: 95,
    averageScore: 85,
    description: 'Basic programming concepts and simple algorithms implementation.',
  },
  {
    id: 2,
    title: 'Assignment 2: Data Types and Functions',
    course: 'CS101',
    dueDate: '2023-05-20',
    status: 'Active',
    submissionRate: 60,
    averageScore: 78,
    description: 'Implementation of various data types and custom functions.',
  },
  {
    id: 3,
    title: 'Assignment 3: Algorithm Analysis',
    course: 'CS201',
    dueDate: '2023-05-15',
    status: 'Active',
    submissionRate: 45,
    averageScore: 72,
    description: 'Analysis of algorithm efficiency and big-O notation.',
  },
  {
    id: 4,
    title: 'Lab Report: Binary Trees',
    course: 'CS301',
    dueDate: '2023-05-17',
    status: 'Active',
    submissionRate: 30,
    averageScore: 68,
    description: 'Implementation and analysis of binary tree data structures.',
  },
  {
    id: 5,
    title: 'Final Project: Database Design',
    course: 'CS101',
    dueDate: '2023-05-30',
    status: 'Upcoming',
    submissionRate: 0,
    averageScore: 0,
    description: 'Design and implementation of a relational database system.',
  },
];

const AssignmentsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assignments..." className="pl-9 glass border-0" />
            </div>
            <Button variant="outline" className="glass border-0">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass border-0">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="glass mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {assignments
              .filter(assignment => assignment.status === 'Active')
              .map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {assignments
              .filter(assignment => assignment.status === 'Completed')
              .map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-6">
            {assignments
              .filter(assignment => assignment.status === 'Upcoming')
              .map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            {assignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface AssignmentCardProps {
  assignment: {
    id: number;
    title: string;
    course: string;
    dueDate: string;
    status: string;
    submissionRate: number;
    averageScore: number;
    description: string;
  };
}

const AssignmentCard = ({ assignment }: AssignmentCardProps) => {
  return (
    <GlassmorphismCard className="overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border/30">
        <div>
          <h3 className="text-lg font-medium">{assignment.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <AnimatedChip
              color={
                assignment.status === 'Completed' ? 'success' :
                assignment.status === 'Active' ? 'primary' :
                'secondary'
              }
            >
              {assignment.status}
            </AnimatedChip>
            <span className="text-sm text-muted-foreground">
              {assignment.course}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="glass border-0">
            <Clock className="h-4 w-4 mr-2" />
            Extend
          </Button>
          <Button size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Grade
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary/40 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-1">Due Date</h4>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{assignment.dueDate}</span>
            </div>
          </div>
          
          <div className="bg-secondary/40 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-1">Submission Rate</h4>
            <div className="flex items-center">
              <span className={
                assignment.submissionRate > 80 ? 'text-green-600' :
                assignment.submissionRate > 50 ? 'text-amber-600' :
                'text-red-600'
              }>
                {assignment.submissionRate}%
              </span>
              <span className="text-muted-foreground ml-2">of students</span>
            </div>
          </div>
          
          <div className="bg-secondary/40 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-1">Average Score</h4>
            <div className="flex items-center">
              <span className={
                assignment.averageScore > 80 ? 'text-green-600' :
                assignment.averageScore > 65 ? 'text-amber-600' :
                'text-red-600'
              }>
                {assignment.averageScore > 0 ? assignment.averageScore : 'N/A'}
              </span>
              {assignment.averageScore > 0 && (
                <span className="text-muted-foreground ml-2">out of 100</span>
              )}
            </div>
          </div>
        </div>
        
        {assignment.status === 'Active' && (
          <div className="bg-red-50 text-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 mr-2 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Missing Submissions</h4>
                <p className="text-sm mt-1">
                  {100 - assignment.submissionRate}% of students haven't submitted yet.
                  Consider sending a reminder.
                </p>
                <Button size="sm" variant="outline" className="mt-2 bg-white/50">
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassmorphismCard>
  );
};

export default AssignmentsPage;
