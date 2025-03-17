
import { supabase } from "@/integrations/supabase/client";

export async function seedDemoData(userId: string) {
  try {
    console.log("Seeding data for user:", userId);
    
    // First check if data already exists
    const { data: existingStudents } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (existingStudents && existingStudents.length > 0) {
      console.log('Demo data already exists');
      return;
    }
    
    // Seed students
    const studentsData = [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com', course_id: 'CS101', attendance: 94, performance: 'Excellent', user_id: userId },
      { name: 'Bob Smith', email: 'bob.smith@example.com', course_id: 'CS201', attendance: 87, performance: 'Good', user_id: userId },
      { name: 'Charlie Brown', email: 'charlie.brown@example.com', course_id: 'CS301', attendance: 72, performance: 'Needs Improvement', user_id: userId },
      { name: 'Diana Prince', email: 'diana.prince@example.com', course_id: 'CS101', attendance: 96, performance: 'Excellent', user_id: userId },
      { name: 'Ethan Hunt', email: 'ethan.hunt@example.com', course_id: 'CS201', attendance: 83, performance: 'Good', user_id: userId },
      { name: 'Fiona Gallagher', email: 'fiona.g@example.com', course_id: 'CS301', attendance: 65, performance: 'At Risk', user_id: userId },
      { name: 'George Wilson', email: 'george.wilson@example.com', course_id: 'CS101', attendance: 91, performance: 'Excellent', user_id: userId },
      { name: 'Hannah Montana', email: 'hannah.m@example.com', course_id: 'CS201', attendance: 88, performance: 'Good', user_id: userId },
    ];
    
    const { error: studentsError } = await supabase.from('students').insert(studentsData);
    if (studentsError) {
      console.error("Error seeding students:", studentsError);
      throw studentsError;
    }
    
    // Seed lessons
    const lessonsData = [
      {
        title: 'CS101: Introduction to Computer Science',
        progress: 80,
        lessons_completed: 12,
        total_lessons: 15,
        next_lesson_title: 'Recursion and Recursive Algorithms',
        next_lesson_date: '2023-05-15',
        next_lesson_time: '09:00 - 10:30',
        status: 'On track',
        user_id: userId
      },
      {
        title: 'CS201: Data Structures and Algorithms',
        progress: 53,
        lessons_completed: 8,
        total_lessons: 15,
        next_lesson_title: 'Graph Algorithms and Complexity Analysis',
        next_lesson_date: '2023-05-16',
        next_lesson_time: '11:00 - 12:30',
        status: 'Slightly behind',
        user_id: userId
      },
      {
        title: 'CS301: Database Systems',
        progress: 33,
        lessons_completed: 5,
        total_lessons: 15,
        next_lesson_title: 'Normalization and Database Design',
        next_lesson_date: '2023-05-17',
        next_lesson_time: '14:00 - 15:30',
        status: 'Behind schedule',
        user_id: userId
      }
    ];
    
    const { error: lessonsError } = await supabase.from('lessons').insert(lessonsData);
    if (lessonsError) {
      console.error("Error seeding lessons:", lessonsError);
      throw lessonsError;
    }
    
    // Seed assignments
    const assignmentsData = [
      {
        title: 'Assignment 1: Introduction to Programming Concepts',
        course: 'CS101',
        due_date: '2023-05-10',
        status: 'Completed',
        submission_rate: 95,
        average_score: 85,
        description: 'Basic programming concepts and simple algorithms implementation.',
        user_id: userId
      },
      {
        title: 'Assignment 2: Data Types and Functions',
        course: 'CS101',
        due_date: '2023-05-20',
        status: 'Active',
        submission_rate: 60,
        average_score: 78,
        description: 'Implementation of various data types and custom functions.',
        user_id: userId
      },
      {
        title: 'Assignment 3: Algorithm Analysis',
        course: 'CS201',
        due_date: '2023-05-15',
        status: 'Active',
        submission_rate: 45,
        average_score: 72,
        description: 'Analysis of algorithm efficiency and big-O notation.',
        user_id: userId
      },
      {
        title: 'Lab Report: Binary Trees',
        course: 'CS301',
        due_date: '2023-05-17',
        status: 'Active',
        submission_rate: 30,
        average_score: 68,
        description: 'Implementation and analysis of binary tree data structures.',
        user_id: userId
      },
      {
        title: 'Final Project: Database Design',
        course: 'CS101',
        due_date: '2023-05-30',
        status: 'Upcoming',
        submission_rate: 0,
        average_score: 0,
        description: 'Design and implementation of a relational database system.',
        user_id: userId
      }
    ];
    
    const { error: assignmentsError } = await supabase.from('assignments').insert(assignmentsData);
    if (assignmentsError) {
      console.error("Error seeding assignments:", assignmentsError);
      throw assignmentsError;
    }
    
    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
