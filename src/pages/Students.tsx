
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, Plus } from 'lucide-react';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';

// Mock student data
const students = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', course: 'CS101', attendance: 94, performance: 'Excellent' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', course: 'CS201', attendance: 87, performance: 'Good' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', course: 'CS301', attendance: 72, performance: 'Needs Improvement' },
  { id: 4, name: 'Diana Prince', email: 'diana.prince@example.com', course: 'CS101', attendance: 96, performance: 'Excellent' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan.hunt@example.com', course: 'CS201', attendance: 83, performance: 'Good' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona.g@example.com', course: 'CS301', attendance: 65, performance: 'At Risk' },
  { id: 7, name: 'George Wilson', email: 'george.wilson@example.com', course: 'CS101', attendance: 91, performance: 'Excellent' },
  { id: 8, name: 'Hannah Montana', email: 'hannah.m@example.com', course: 'CS201', attendance: 88, performance: 'Good' },
];

const StudentsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 glass border-0" />
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
              Add Student
            </Button>
          </div>
        </div>
        
        <GlassmorphismCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-secondary/40 transition-colors">
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`${
                          student.attendance >= 90 ? 'text-green-600' :
                          student.attendance >= 75 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {student.attendance}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AnimatedChip
                        color={
                          student.performance === 'Excellent' ? 'success' :
                          student.performance === 'Good' ? 'primary' :
                          student.performance === 'Needs Improvement' ? 'warning' :
                          'danger'
                        }
                      >
                        {student.performance}
                      </AnimatedChip>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Email</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </GlassmorphismCard>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing 1-8 of 248 students
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentsPage;
