"use client";

import { createContext, useContext, ReactNode } from "react";
import { CommentData } from "@/components/tasks/announcements/comment";

interface ThreadContextType {
  post: any;
  comments: CommentData[];
  slug: string;
  loading: boolean;
  setComments: (comments: CommentData[]) => void;
  refetchComments: (options?: { silent: boolean }) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export const ThreadProvider = ({
  children,
  post,
  comments,
  slug,
  loading,
  setComments,
  refetchComments,
}: {
  children: ReactNode;
  post: any;
  comments: CommentData[];
  slug: string;
  loading: boolean;
  setComments: (comments: CommentData[]) => void;
  refetchComments: (options?: { silent: boolean }) => void;
}) => {
  return (
    <ThreadContext.Provider
      value={{ post, comments, slug, loading, setComments, refetchComments }}
    >
      {children}
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }
  return context;
};
