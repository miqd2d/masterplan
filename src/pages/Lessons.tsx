
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Edit, Plus, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import AnimatedChip from '@/components/ui-custom/AnimatedChip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the lesson type
interface Lesson {
  id: string;
  title: string;
  progress: number;
  lessons_completed: number;
  total_lessons: number;
  next_lesson_title: string;
  next_lesson_date: string;
  next_lesson_time: string;
  status: string;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLessons() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setLessons(data || []);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        toast({
          title: 'Error fetching lessons',
          description: 'There was a problem loading your lessons.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLessons();
  }, [user, toast]);

  // Filter lessons based on search query
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search lessons..." 
              className="pl-9 glass border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Lesson
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No lessons matching your search.' : 'No lessons found. Create your first lesson!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredLessons.map((lesson) => (
              <GlassmorphismCard key={lesson.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border/30">
                  <div>
                    <h3 className="text-lg font-medium">{lesson.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <AnimatedChip
                        color={
                          lesson.status === 'On track' ? 'success' :
                          lesson.status === 'Slightly behind' ? 'warning' :
                          'danger'
                        }
                      >
                        {lesson.status}
                      </AnimatedChip>
                      <span className="text-sm text-muted-foreground">
                        {lesson.lessons_completed} of {lesson.total_lessons} lessons completed
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
                      <span className="text-sm font-medium">{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-2" />
                  </div>
                  
                  <div className="bg-secondary/40 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Next Lesson: {lesson.next_lesson_title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{lesson.next_lesson_date}</span>
                          <span className="mx-1">•</span>
                          <span>{lesson.next_lesson_time}</span>
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
                        <span className="text-sm">Lesson {lesson.lessons_completed - index}: {
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
        )}
      </div>
    </Layout>
  );
};

export default LessonsPage;
