
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
    
    // Seed students (now 48 total)
    const studentsData = [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com', course_id: 'CS101', attendance: 94, performance: 'Excellent', user_id: userId },
      { name: 'Bob Smith', email: 'bob.smith@example.com', course_id: 'CS201', attendance: 87, performance: 'Good', user_id: userId },
      { name: 'Charlie Brown', email: 'charlie.brown@example.com', course_id: 'CS301', attendance: 72, performance: 'Needs Improvement', user_id: userId },
      { name: 'Diana Prince', email: 'diana.prince@example.com', course_id: 'CS101', attendance: 96, performance: 'Excellent', user_id: userId },
      { name: 'Ethan Hunt', email: 'ethan.hunt@example.com', course_id: 'CS201', attendance: 83, performance: 'Good', user_id: userId },
      { name: 'Fiona Gallagher', email: 'fiona.g@example.com', course_id: 'CS301', attendance: 65, performance: 'At Risk', user_id: userId },
      { name: 'George Wilson', email: 'george.wilson@example.com', course_id: 'CS101', attendance: 91, performance: 'Excellent', user_id: userId },
      { name: 'Hannah Montana', email: 'hannah.m@example.com', course_id: 'CS201', attendance: 88, performance: 'Good', user_id: userId },
      { name: 'Ian Gallagher', email: 'ian.g@example.com', course_id: 'CS301', attendance: 78, performance: 'Good', user_id: userId },
      { name: 'Jennifer Lawrence', email: 'jennifer.l@example.com', course_id: 'CS101', attendance: 92, performance: 'Excellent', user_id: userId },
      { name: 'Kevin Hart', email: 'kevin.h@example.com', course_id: 'CS201', attendance: 85, performance: 'Good', user_id: userId },
      { name: 'Lisa Simpson', email: 'lisa.s@example.com', course_id: 'CS301', attendance: 97, performance: 'Excellent', user_id: userId },
      { name: 'Michael Scott', email: 'michael.s@example.com', course_id: 'CS101', attendance: 79, performance: 'Good', user_id: userId },
      { name: 'Nina Dobrev', email: 'nina.d@example.com', course_id: 'CS201', attendance: 93, performance: 'Excellent', user_id: userId },
      { name: 'Oliver Queen', email: 'oliver.q@example.com', course_id: 'CS301', attendance: 81, performance: 'Good', user_id: userId },
      { name: 'Penny Hoffstader', email: 'penny.h@example.com', course_id: 'CS101', attendance: 84, performance: 'Good', user_id: userId },
      { name: 'Quincy Jones', email: 'quincy.j@example.com', course_id: 'CS201', attendance: 95, performance: 'Excellent', user_id: userId },
      { name: 'Rachel Green', email: 'rachel.g@example.com', course_id: 'CS301', attendance: 86, performance: 'Good', user_id: userId },
      { name: 'Steve Rogers', email: 'steve.r@example.com', course_id: 'CS101', attendance: 98, performance: 'Excellent', user_id: userId },
      { name: 'Tony Stark', email: 'tony.s@example.com', course_id: 'CS201', attendance: 89, performance: 'Good', user_id: userId },
      { name: 'Uma Thurman', email: 'uma.t@example.com', course_id: 'CS301', attendance: 77, performance: 'Good', user_id: userId },
      { name: 'Victor Stone', email: 'victor.s@example.com', course_id: 'CS101', attendance: 82, performance: 'Good', user_id: userId },
      { name: 'Wanda Maximoff', email: 'wanda.m@example.com', course_id: 'CS201', attendance: 94, performance: 'Excellent', user_id: userId },
      { name: 'Xavier Woods', email: 'xavier.w@example.com', course_id: 'CS301', attendance: 71, performance: 'Needs Improvement', user_id: userId },
      { name: 'Yasmine Ali', email: 'yasmine.a@example.com', course_id: 'CS101', attendance: 90, performance: 'Excellent', user_id: userId },
      { name: 'Zach Morris', email: 'zach.m@example.com', course_id: 'CS201', attendance: 80, performance: 'Good', user_id: userId },
      { name: 'Amber Heard', email: 'amber.h@example.com', course_id: 'CS301', attendance: 69, performance: 'At Risk', user_id: userId },
      { name: 'Bruce Wayne', email: 'bruce.w@example.com', course_id: 'CS101', attendance: 91, performance: 'Excellent', user_id: userId },
      { name: 'Chloe Sullivan', email: 'chloe.s@example.com', course_id: 'CS201', attendance: 88, performance: 'Good', user_id: userId },
      { name: 'Derek Morgan', email: 'derek.m@example.com', course_id: 'CS301', attendance: 76, performance: 'Good', user_id: userId },
      { name: 'Emma Swan', email: 'emma.s@example.com', course_id: 'CS101', attendance: 93, performance: 'Excellent', user_id: userId },
      { name: 'Fernando Alonso', email: 'fernando.a@example.com', course_id: 'CS201', attendance: 85, performance: 'Good', user_id: userId },
      { name: 'Gina Linetti', email: 'gina.l@example.com', course_id: 'CS301', attendance: 74, performance: 'Needs Improvement', user_id: userId },
      { name: 'Harry Potter', email: 'harry.p@example.com', course_id: 'CS101', attendance: 89, performance: 'Good', user_id: userId },
      { name: 'Iris West', email: 'iris.w@example.com', course_id: 'CS201', attendance: 92, performance: 'Excellent', user_id: userId },
      { name: 'Jake Peralta', email: 'jake.p@example.com', course_id: 'CS301', attendance: 81, performance: 'Good', user_id: userId },
      { name: 'Kara Danvers', email: 'kara.d@example.com', course_id: 'CS101', attendance: 95, performance: 'Excellent', user_id: userId },
      { name: 'Leonard Hofstadter', email: 'leonard.h@example.com', course_id: 'CS201', attendance: 84, performance: 'Good', user_id: userId },
      { name: 'Meredith Grey', email: 'meredith.g@example.com', course_id: 'CS301', attendance: 79, performance: 'Good', user_id: userId },
      { name: 'Nick Miller', email: 'nick.m@example.com', course_id: 'CS101', attendance: 77, performance: 'Good', user_id: userId },
      { name: 'Olivia Pope', email: 'olivia.p@example.com', course_id: 'CS201', attendance: 90, performance: 'Excellent', user_id: userId },
      { name: 'Peter Parker', email: 'peter.p@example.com', course_id: 'CS301', attendance: 86, performance: 'Good', user_id: userId },
      { name: 'Quinn Fabray', email: 'quinn.f@example.com', course_id: 'CS101', attendance: 82, performance: 'Good', user_id: userId },
      { name: 'Raymond Holt', email: 'raymond.h@example.com', course_id: 'CS201', attendance: 94, performance: 'Excellent', user_id: userId },
      { name: 'Sheldon Cooper', email: 'sheldon.c@example.com', course_id: 'CS301', attendance: 99, performance: 'Excellent', user_id: userId },
      { name: 'Ted Mosby', email: 'ted.m@example.com', course_id: 'CS101', attendance: 87, performance: 'Good', user_id: userId },
      { name: 'Veronica Lodge', email: 'veronica.l@example.com', course_id: 'CS201', attendance: 83, performance: 'Good', user_id: userId },
    ];
    
    const { error: studentsError } = await supabase.from('students').insert(studentsData);
    if (studentsError) {
      console.error("Error seeding students:", studentsError);
      throw studentsError;
    }
    
    // Seed lessons (now 8 total)
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
      },
      {
        title: 'CS401: Web Development',
        progress: 67,
        lessons_completed: 10,
        total_lessons: 15,
        next_lesson_title: 'Advanced JavaScript Patterns',
        next_lesson_date: '2023-05-18',
        next_lesson_time: '10:00 - 11:30',
        status: 'On track',
        user_id: userId
      },
      {
        title: 'CS501: Machine Learning',
        progress: 40,
        lessons_completed: 6,
        total_lessons: 15,
        next_lesson_title: 'Neural Networks and Deep Learning',
        next_lesson_date: '2023-05-19',
        next_lesson_time: '13:00 - 14:30',
        status: 'Slightly behind',
        user_id: userId
      },
      {
        title: 'CS601: Software Engineering',
        progress: 87,
        lessons_completed: 13,
        total_lessons: 15,
        next_lesson_title: 'Agile Development and Scrum',
        next_lesson_date: '2023-05-20',
        next_lesson_time: '09:00 - 10:30',
        status: 'On track',
        user_id: userId
      },
      {
        title: 'CS701: Computer Security',
        progress: 60,
        lessons_completed: 9,
        total_lessons: 15,
        next_lesson_title: 'Cryptography and Secure Communications',
        next_lesson_date: '2023-05-21',
        next_lesson_time: '11:00 - 12:30',
        status: 'On track',
        user_id: userId
      },
      {
        title: 'CS801: Artificial Intelligence',
        progress: 27,
        lessons_completed: 4,
        total_lessons: 15,
        next_lesson_title: 'Knowledge Representation and Reasoning',
        next_lesson_date: '2023-05-22',
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
    
    // Seed assignments (now 10 total)
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
      },
      {
        title: 'Quiz 1: JavaScript Fundamentals',
        course: 'CS401',
        due_date: '2023-05-12',
        status: 'Completed',
        submission_rate: 92,
        average_score: 81,
        description: 'A comprehensive quiz covering JavaScript basics and DOM manipulation.',
        user_id: userId
      },
      {
        title: 'Group Project: Neural Network Implementation',
        course: 'CS501',
        due_date: '2023-05-25',
        status: 'Active',
        submission_rate: 50,
        average_score: 75,
        description: 'Group project requiring implementation of a basic neural network from scratch.',
        user_id: userId
      },
      {
        title: 'Case Study: Security Vulnerabilities',
        course: 'CS701',
        due_date: '2023-05-18',
        status: 'Active',
        submission_rate: 65,
        average_score: 79,
        description: 'Analysis of real-world security breaches and vulnerability mitigation strategies.',
        user_id: userId
      },
      {
        title: 'Midterm Exam: Software Development Lifecycle',
        course: 'CS601',
        due_date: '2023-05-15',
        status: 'Completed',
        submission_rate: 100,
        average_score: 88,
        description: 'Comprehensive exam covering software development methodologies and practices.',
        user_id: userId
      },
      {
        title: 'Research Paper: Future of AI',
        course: 'CS801',
        due_date: '2023-06-01',
        status: 'Upcoming',
        submission_rate: 10,
        average_score: 0,
        description: 'Research paper on emerging trends and future directions in artificial intelligence.',
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
