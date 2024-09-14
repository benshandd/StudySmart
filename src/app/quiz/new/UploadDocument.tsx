"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress, message } from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles

const UploadDocument = () => {
  const [document, setDocument] = useState<Blob | File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev)); // Slowly increase the progress up to 90%
      }, 100); // Adjust the interval time as needed
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload a document first");
      return;
    }
    setIsLoading(true);
    setProgress(10); // Start progress when button is clicked

    const formData = new FormData();
    formData.append("pdf", document as Blob);

    try {
      setProgress(30); // Update progress after preparing the request
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 200) {
        const { quizId } = await res.json(); // Assume the response includes the quizId
        const quizLink = `/quiz/${quizId}`;
        message.success(
          <>
            Quiz generated successfully!{" "}
            <a href={quizLink} className="text-blue-500 underline">
              View your quiz here
            </a>.
          </>,
          10 // Display the message for 10 seconds
        );
        setProgress(100); // Jump to 100% when the quiz is successfully generated
      } else {
        message.error("Error generating quiz", 5); // Show error message for 5 seconds
        setProgress(0); // Reset progress on error
      }
    } catch (e) {
      message.error("Error while generating quiz", 5); // Show error message for 5 seconds
      setProgress(0); // Reset progress on error
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <label
          htmlFor="document"
          className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
        >
          <div className="absolute inset-0 m-auto flex justify-center items-center">
            {document && document?.name ? document.name : "Drag your document here"}{" "}
          </div>
          <input
            type="file"
            id="document"
            className="relative block w-full h-full z-50 opacity-0"
            onChange={(e) => setDocument(e?.target?.files?.[0])}
          />
        </label>
        {error ? <p className="text-red-500">{error}</p> : null}
        <Button size="lg" className="mt-2" type="submit" disabled={isLoading}>
          Generate Quiz
        </Button>
      </form>
      {isLoading && (
        <div className="mt-4 w-full flex justify-center">
          <Progress
            percent={progress}
            status={progress < 100 ? "active" : "success"}
            strokeWidth={16} // Increase the thickness of the progress bar
            style={{ width: "100%" }} // Adjust the width to fit the container
            format={(percent) => (
              <span style={{ color: 'white' }}>{`${percent}%`}</span>
            )} // Make the text white
          />
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
