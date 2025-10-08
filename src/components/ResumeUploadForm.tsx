import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";

interface ResumeUploadFormProps {
  onProcessResumes: (jobDescription: string, files: File[]) => void;
}

const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({ onProcessResumes }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!jobDescription.trim()) {
      showError("Please enter a job description.");
      return;
    }
    if (resumeFiles.length === 0) {
      showError("Please upload at least one resume.");
      return;
    }
    onProcessResumes(jobDescription, resumeFiles);
    showSuccess("Resumes and job description submitted for processing!");
    // Optionally clear form after submission
    setJobDescription("");
    setResumeFiles([]);
    if (event.target instanceof HTMLFormElement) {
      event.target.reset(); // Reset file input
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Hiralyze: Match Resumes to Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="resize-y"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="resumes">Upload Resumes (PDF/Text)</Label>
            <Input
              id="resumes"
              type="file"
              accept=".pdf,.txt"
              multiple
              onChange={handleFileChange}
              className="file:text-primary file:border-primary file:hover:bg-primary/10"
            />
            {resumeFiles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {resumeFiles.map(file => file.name).join(", ")}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Process Resumes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadForm;