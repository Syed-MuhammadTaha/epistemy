'use server'

import { redirect } from 'next/navigation'
import { getTutor, getStudent } from '@/lib/data'

export async function selectRandomTutor() {
  console.log('🎲 Selecting random tutor...')
  
  // Get all tutors from the database
  const tutors = await getTutor()
  console.log('Found tutors:', tutors.length)
  
  // Select a random tutor
  const randomTutor = tutors[Math.floor(Math.random() * tutors.length)]
  console.log('✅ Selected tutor:', randomTutor.id)
  
  // Redirect to the selected tutor's dashboard
  redirect(`/tutor/${randomTutor.id}`)
}

export async function selectRandomStudent() {
  console.log('🎲 Selecting random student...')
  
  // Get all students from the database
  const students = await getStudent()
  console.log('Found students:', students.length)
  
  // Select a random student
  const randomStudent = students[Math.floor(Math.random() * students.length)]
  console.log('✅ Selected student:', randomStudent.id)

  // Redirect to the selected student's vault
  redirect(`/student/${randomStudent.id}`)
}
