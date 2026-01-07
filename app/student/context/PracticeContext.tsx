'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PracticeData {
  subject: string;
  exercise_question: string;
  difficulty?: string;
  improve_suggestion?: string;
  source?: 'teacher_comment' | 'recent_test'; // Nguồn dữ liệu
  topic?: string; // Topic từ recent test
}

interface PracticeContextType {
  practiceData: PracticeData | null;
  setPracticeData: (data: PracticeData) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider = ({ children }: { children: ReactNode }) => {
  const [practiceData, setPracticeData] = useState<PracticeData | null>(null);

  return (
    <PracticeContext.Provider value={{ practiceData, setPracticeData }}>
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
