import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle } from "@/components/NeonCard"; // Use NeonCard
import { NeonButton } from "@/components/NeonButton"; // Use NeonButton
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion";
import { UploadCloud, FileText } from "lucide-react";
import { cn } from '@/lib/utils';

interface ResumeUploadFormProps {
  onProcessResumes: (jobDescription: string, files: File[]) => void;
}

const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({ onProcessResumes }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Append new files instead of replacing existing ones
      setResumeFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
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
      <NeonCard className="w-full"> {/* Use NeonCard */}
        <NeonCardHeader> {/* Use NeonCardHeader */}
          <NeonCardTitle className="text-center">Hiralyze: Match Resumes to Jobs</NeonCardTitle> {/* Use NeonCardTitle */}
        </NeonCardHeader>
        <NeonCardContent> {/* Use NeonCardContent */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="grid w-full items-center gap-1.5">
              <Label htmlFor="job-description" className="text-primary text-neon-glow">Job Description</Label>
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
              <Label htmlFor="resumes" className="text-primary text-neon-glow">Upload Resumes (PDF/Text/Word)</Label>
              <div
                className={cn(
                  `border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors relative`,
                  isDragging ? "border-primary bg-primary/10 shadow-neon-glow" : "border-primary/50 hover:border-primary hover:shadow-primary/20",
                  "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
                  "hover:before:opacity-100"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resumes')?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-primary text-neon-glow mb-2" />
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
                  <p className="text-sm font-medium text-primary text-neon-glow">Selected Files:</p>
                  {resumeFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <NeonButton type="submit" className="w-full"> {/* Use NeonButton */}
                Process Resumes
              </NeonButton>
            </motion.div>
          </form>
        </NeonCardContent>
      </NeonCard>
    </motion.div>
  );
};

export default ResumeUploadForm;