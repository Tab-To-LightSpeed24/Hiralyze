import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion";
import { UploadCloud, FileText } from "lucide-react";

interface ResumeUploadFormProps {
  onProcessResumes: (jobDescription: string, files: File[]) => void;
}

const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({ onProcessResumes }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeFiles(Array.from(event.target.files));
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file =>
        file.type === 'application/pdf' ||
        file.type === 'text/plain' ||
        file.type === 'application/msword' || // .doc
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
      );
      setResumeFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.dataTransfer.clearData();
    }
  }, []);

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
    setJobDescription("");
    setResumeFiles([]);
    // Reset file input if it exists
    const fileInput = document.getElementById("resumes") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Hiralyze: Match Resumes to Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="grid w-full items-center gap-1.5">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="resize-y"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="grid w-full items-center gap-1.5">
              <Label htmlFor="resumes">Upload Resumes (PDF/Text/Word)</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resumes')?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Drag & drop resumes here, or click to select files</p>
                <Input
                  id="resumes"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                  className="hidden" // Hide the default input
                />
              </div>
              {resumeFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {resumeFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full">
                Process Resumes
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeUploadForm;