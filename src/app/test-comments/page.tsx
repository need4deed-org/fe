"use client";

import { CommentsList } from "@/components/core/comment";
import { useMutationQuery } from "@/hooks/useMutationQuery";

export default function TestCommentsPage() {
  // Mock data matching Figma design
  const mockComments = [
    {
      id: "1",
      userId: "user1",
      userName: "Kalima",
      text: "Leni works as a social worker with special-needs children, supporting learning development",
      timestamp: new Date("2024-08-04T13:14:00").toISOString(),
    },
    {
      id: "2",
      userId: "user2",
      userName: "Kalima",
      text: "Comment example here. An emergency with the appointment.",
      timestamp: new Date("2024-09-01T12:12:00").toISOString(),
    },
  ];

  // Mock functions - replace with real API calls
  const handlePatch = async (commentId: string, updatedText: string) => {
    console.log("PATCH:", commentId, updatedText);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleDelete = async (commentId: string) => {
    console.log("DELETE:", commentId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleAdd = async (text: string) => {
    console.log("ADD:", text);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Comments Component Test</h1>
      <CommentsList
        comments={mockComments}
        onPatch={handlePatch}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}

