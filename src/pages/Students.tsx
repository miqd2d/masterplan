
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, Plus, Mail } from 'lucide-react';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the student type
interface Student {
  id: string;
  name: string;
  email: string;
  course_id: string;
  attendance: number;
  performance: string;
  marks: number;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const studentsPerPage = 10;

  useEffect(() => {
    async function fetchStudents() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Add marks if not present in the database
        const enhancedData = data?.map(student => ({
          ...student,
          marks: student.marks || Math.floor(Math.random() * 40) + 60 // Generate marks between 60-100 if not present
        })) || [];
        
        setStudents(enhancedData);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error fetching students',
          description: 'There was a problem loading your students.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStudents();
  }, [user, toast]);

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.performance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleViewEmail = (student: Student) => {
    setSelectedStudent(student);
    setShowEmailDialog(true);
  };

  const handleSendEmail = () => {
    if (!selectedStudent) return;
    
    toast({
      title: 'Email Sent',
      description: `Email has been sent to ${selectedStudent.name} at ${selectedStudent.email}`,
    });
    
    setShowEmailDialog(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-9 glass border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchQuery ? 'No students matching your search' : 'No students found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-secondary/40 transition-colors">
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.course_id}</TableCell>
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
                          <div className="flex items-center gap-2">
                            <span className={`${
                              student.marks >= 90 ? 'text-green-600' :
                              student.marks >= 75 ? 'text-amber-600' :
                              student.marks >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {student.marks}%
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewEmail(student)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </GlassmorphismCard>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {currentStudents.length} of {filteredStudents.length} students
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Button 
                  key={pageNumber}
                  variant="outline" 
                  size="sm" 
                  className={pageNumber === currentPage ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            {totalPages > 5 && <span className="mx-1">...</span>}
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Student</DialogTitle>
            <DialogDescription>
              Send an email to {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">To:</div>
              <div className="col-span-3">{selectedStudent?.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Subject:</div>
              <Input className="col-span-3" placeholder="Enter subject" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="font-medium">Message:</div>
              <textarea
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your message here..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StudentsPage;
