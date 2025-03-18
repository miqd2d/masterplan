
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, Download, Filter, Plus, Search, XCircle } from 'lucide-react';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the assignment type
interface Assignment {
  id: string;
  title: string;
  course: string;
  due_date: string;
  status: string;
  submission_rate: number;
  average_score: number;
  description: string;
}

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAssignments() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setAssignments(data || []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast({
          title: 'Error fetching assignments',
          description: 'There was a problem loading your assignments.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAssignments();
  }, [user, toast]);

  // Filter assignments based on search query and active tab
  const filteredAssignments = assignments
    .filter(assignment => 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(assignment => {
      if (activeTab === 'all') return true;
      return assignment.status?.toLowerCase() === activeTab.toLowerCase();
    });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assignments..." 
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
              Create Assignment
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="glass mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              {['active', 'completed', 'upcoming', 'all'].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-6">
                  {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery ? 'No assignments matching your search.' : `No ${tab !== 'all' ? tab : ''} assignments found.`}
                      </p>
                    </div>
                  ) : (
                    filteredAssignments.map(assignment => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))
                  )}
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

interface AssignmentCardProps {
  assignment: Assignment;
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
              <span>{assignment.due_date}</span>
            </div>
          </div>
          
          <div className="bg-secondary/40 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-1">Submission Rate</h4>
            <div className="flex items-center">
              <span className={
                assignment.submission_rate > 80 ? 'text-green-600' :
                assignment.submission_rate > 50 ? 'text-amber-600' :
                'text-red-600'
              }>
                {assignment.submission_rate}%
              </span>
              <span className="text-muted-foreground ml-2">of students</span>
            </div>
          </div>
          
          <div className="bg-secondary/40 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-1">Average Score</h4>
            <div className="flex items-center">
              <span className={
                assignment.average_score > 80 ? 'text-green-600' :
                assignment.average_score > 65 ? 'text-amber-600' :
                'text-red-600'
              }>
                {assignment.average_score > 0 ? assignment.average_score : 'N/A'}
              </span>
              {assignment.average_score > 0 && (
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
                  {100 - assignment.submission_rate}% of students haven't submitted yet.
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
