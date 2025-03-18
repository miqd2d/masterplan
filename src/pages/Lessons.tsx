
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Edit, Plus, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';

// Mock lesson data
const courses = [
  {
    id: 1,
    title: 'CS101: Introduction to Computer Science',
    progress: 80,
    lessonsCompleted: 12,
    totalLessons: 15,
    nextLesson: {
      title: 'Recursion and Recursive Algorithms',
      date: '2023-05-15',
      time: '09:00 - 10:30',
    },
    status: 'On track',
  },
  {
    id: 2,
    title: 'CS201: Data Structures and Algorithms',
    progress: 53,
    lessonsCompleted: 8,
    totalLessons: 15,
    nextLesson: {
      title: 'Graph Algorithms and Complexity Analysis',
      date: '2023-05-16',
      time: '11:00 - 12:30',
    },
    status: 'Slightly behind',
  },
  {
    id: 3,
    title: 'CS301: Database Systems',
    progress: 33,
    lessonsCompleted: 5,
    totalLessons: 15,
    nextLesson: {
      title: 'Normalization and Database Design',
      date: '2023-05-17',
      time: '14:00 - 15:30',
    },
    status: 'Behind schedule',
  },
];

const LessonsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search lessons..." className="pl-9 glass border-0" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Lesson
          </Button>
        </div>
        
        <div className="grid gap-6">
          {courses.map((course) => (
            <GlassmorphismCard key={course.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border/30">
                <div>
                  <h3 className="text-lg font-medium">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <AnimatedChip
                      color={
                        course.status === 'On track' ? 'success' :
                        course.status === 'Slightly behind' ? 'warning' :
                        'danger'
                      }
                    >
                      {course.status}
                    </AnimatedChip>
                    <span className="text-sm text-muted-foreground">
                      {course.lessonsCompleted} of {course.totalLessons} lessons completed
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm" className="glass border-0">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="glass border-0">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                
                <div className="bg-secondary/40 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Next Lesson: {course.nextLesson.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{course.nextLesson.date}</span>
                        <span className="mx-1">•</span>
                        <span>{course.nextLesson.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border/30 p-6">
                <h4 className="font-medium mb-3">Recent Lessons</h4>
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Lesson {course.lessonsCompleted - index}: {
                        index === 0 ? "Advanced Data Types" :
                        index === 1 ? "Control Structures and Loops" :
                        "Functions and Modularity"
                      }</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default LessonsPage;
