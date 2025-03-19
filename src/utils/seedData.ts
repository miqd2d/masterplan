
import { supabase } from '@/integrations/supabase/client';

// Function to seed demo data for a new user
export const seedDemoData = async (userId: string) => {
  console.log('Seeding demo data for user:', userId);
  
  try {
    // 1. Create Students with non-English names
    const students = [
      {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        course_id: 'CS101',
        attendance: 96,
        marks: 96,
        performance: 'Excellent',
        user_id: userId
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        course_id: 'CS101',
        attendance: 65,
        marks: 72,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Amit Sharma',
        email: 'amit.sharma@example.com',
        course_id: 'CS102',
        attendance: 72,
        marks: 68,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        course_id: 'CS102',
        attendance: 88,
        marks: 85,
        performance: 'Excellent',
        user_id: userId
      },
      {
        name: 'Raj Malhotra',
        email: 'raj.malhotra@example.com',
        course_id: 'CS201',
        attendance: 91,
        marks: 89,
        performance: 'Excellent',
        user_id: userId
      },
      {
        name: 'Ananya Desai',
        email: 'ananya.desai@example.com',
        course_id: 'CS201',
        attendance: 94,
        marks: 94,
        performance: 'Excellent',
        user_id: userId
      },
      {
        name: 'Sanjay Patel',
        email: 'sanjay.patel@example.com',
        course_id: 'CS301',
        attendance: 78,
        marks: 75,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Meera Reddy',
        email: 'meera.reddy@example.com',
        course_id: 'CS301',
        attendance: 89,
        marks: 82,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Vijay Kapoor',
        email: 'vijay.kapoor@example.com',
        course_id: 'CS202',
        attendance: 92,
        marks: 92,
        performance: 'Excellent',
        user_id: userId
      },
      {
        name: 'Sunita Joshi',
        email: 'sunita.joshi@example.com',
        course_id: 'CS202',
        attendance: 86,
        marks: 81,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Krishna Rao',
        email: 'krishna.rao@example.com',
        course_id: 'CS101',
        attendance: 82,
        marks: 78,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Lakshmi Nair',
        email: 'lakshmi.nair@example.com',
        course_id: 'CS302',
        attendance: 76,
        marks: 70,
        performance: 'Needs Improvement',
        user_id: userId
      },
      {
        name: 'Arjun Menon',
        email: 'arjun.menon@example.com',
        course_id: 'CS302',
        attendance: 73,
        marks: 65,
        performance: 'Needs Improvement',
        user_id: userId
      },
      {
        name: 'Divya Choudhary',
        email: 'divya.choudhary@example.com',
        course_id: 'CS101',
        attendance: 84,
        marks: 81,
        performance: 'Good',
        user_id: userId
      },
      {
        name: 'Rajesh Khanna',
        email: 'rajesh.khanna@example.com',
        course_id: 'CS202',
        attendance: 90,
        marks: 88,
        performance: 'Excellent',
        user_id: userId
      }
    ];

    const { error: studentsError } = await supabase
      .from('students')
      .insert(students);

    if (studentsError) {
      throw new Error(`Error inserting students: ${studentsError.message}`);
    }

    // 2. Create Assignments
    const assignments = [
      {
        title: 'Introduction to Programming',
        description: 'Basic concepts of programming and algorithms',
        course: 'CS101',
        status: 'Completed',
        submission_rate: 95,
        average_score: 88,
        user_id: userId,
        due_date: '2023-09-15'
      },
      {
        title: 'Data Types and Variables',
        description: 'Understanding different data types and how to use variables',
        course: 'CS101',
        status: 'Active',
        submission_rate: 85,
        average_score: 82,
        user_id: userId,
        due_date: '2023-09-22'
      },
      {
        title: 'Control Structures',
        description: 'Conditional statements and loops in programming',
        course: 'CS101',
        status: 'Upcoming',
        submission_rate: 0,
        average_score: 0,
        user_id: userId,
        due_date: '2023-09-29'
      },
      {
        title: 'Database Fundamentals',
        description: 'Introduction to database concepts and SQL',
        course: 'CS201',
        status: 'Completed',
        submission_rate: 92,
        average_score: 85,
        user_id: userId,
        due_date: '2023-09-12'
      },
      {
        title: 'Entity-Relationship Diagrams',
        description: 'Creating ER diagrams for database design',
        course: 'CS201',
        status: 'Active',
        submission_rate: 75,
        average_score: 78,
        user_id: userId,
        due_date: '2023-09-25'
      },
      {
        title: 'Neural Networks',
        description: 'Introduction to neural network architectures and applications',
        course: 'CS302',
        status: 'Active',
        submission_rate: 45,
        average_score: 72,
        user_id: userId,
        due_date: '2023-09-18'
      },
      {
        title: 'Computer Networks',
        description: 'Understanding network protocols and architectures',
        course: 'CS202',
        status: 'Completed',
        submission_rate: 88,
        average_score: 80,
        user_id: userId,
        due_date: '2023-09-10'
      },
      {
        title: 'Security Fundamentals',
        description: 'Basic concepts of cybersecurity and threat protection',
        course: 'CS202',
        status: 'Upcoming',
        submission_rate: 0,
        average_score: 0,
        user_id: userId,
        due_date: '2023-10-05'
      }
    ];

    const { error: assignmentsError } = await supabase
      .from('assignments')
      .insert(assignments);

    if (assignmentsError) {
      throw new Error(`Error inserting assignments: ${assignmentsError.message}`);
    }

    // 3. Create Lessons
    const lessons = [
      {
        title: 'Introduction to Computer Science',
        progress: 100,
        lessons_completed: 12,
        total_lessons: 12,
        next_lesson_title: 'None',
        next_lesson_date: '2023-10-01',
        next_lesson_time: '10:00 AM',
        status: 'completed',
        user_id: userId
      },
      {
        title: 'Data Structures and Algorithms',
        progress: 75,
        lessons_completed: 9,
        total_lessons: 12,
        next_lesson_title: 'Graph Algorithms',
        next_lesson_date: '2023-09-16',
        next_lesson_time: '11:30 AM',
        status: 'on track',
        user_id: userId
      },
      {
        title: 'Database Systems',
        progress: 60,
        lessons_completed: 6,
        total_lessons: 10,
        next_lesson_title: 'SQL Joins and Subqueries',
        next_lesson_date: '2023-09-18',
        next_lesson_time: '2:00 PM',
        status: 'slightly behind',
        user_id: userId
      },
      {
        title: 'Web Development',
        progress: 40,
        lessons_completed: 4,
        total_lessons: 10,
        next_lesson_title: 'JavaScript Basics',
        next_lesson_date: '2023-09-15',
        next_lesson_time: '9:00 AM',
        status: 'behind schedule',
        user_id: userId
      },
      {
        title: 'Artificial Intelligence',
        progress: 30,
        lessons_completed: 3,
        total_lessons: 10,
        next_lesson_title: 'Machine Learning Fundamentals',
        next_lesson_date: '2023-09-17',
        next_lesson_time: '3:30 PM',
        status: 'behind schedule',
        user_id: userId
      }
    ];

    const { error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessons);

    if (lessonsError) {
      throw new Error(`Error inserting lessons: ${lessonsError.message}`);
    }

    console.log('Demo data seeded successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }
};
