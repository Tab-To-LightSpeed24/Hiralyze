import React from 'react';
import { motion } from 'framer-motion';
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle } from '@/components/NeonCard'; // Use NeonCard
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center p-4 md:p-8 bg-background text-foreground min-h-[calc(100vh-64px)]"
    >
      <NeonCard className="w-full max-w-3xl"> {/* Use NeonCard */}
        <NeonCardHeader> {/* Use NeonCardHeader */}
          <NeonCardTitle className="text-center">About Our Advanced Matching System</NeonCardTitle> {/* Use NeonCardTitle */}
        </NeonCardHeader>
        <NeonCardContent className="space-y-6 text-muted-foreground"> {/* Use NeonCardContent */}
          <motion.section variants={itemVariants}>
            <h3 className={cn("text-xl font-semibold mb-2 text-primary text-neon-glow")}>How It Works</h3>
            <p>
              The Smart Resume Screener employs a sophisticated Large Language Model (LLM) at its core to intelligently parse resumes and match them against job descriptions. Our system goes beyond simple keyword matching to understand the nuances of both the candidate's profile and the job's requirements.
            </p>
          </motion.section>

          <Separator className="bg-primary/30" />

          <motion.section variants={itemVariants}>
            <h3 className={cn("text-xl font-semibold mb-2 text-primary text-neon-glow")}>Advanced Resume & Job Description Parsing</h3>
            <p>
              Our LLM is designed to perform deep semantic analysis. For resumes, it extracts not just explicit skills and experience, but also infers soft skills, career progression, and potential growth areas. For job descriptions, it dissects the core responsibilities, required qualifications, and desired attributes, even when ambiguously phrased.
            </p>
            <p className="mt-2">
              <span className="font-bold text-primary text-neon-glow">Leveraging Internet Sources:</span> To achieve a wider understanding, the LLM can dynamically query and integrate information from various internet sources. For instance, if a job description mentions a niche technology or a specific industry trend, the LLM can research its relevance, typical applications, and associated skills to enrich its understanding and improve matching accuracy. This allows for more informed suggestions and a broader range of job role recommendations.
            </p>
          </motion.section>

          <Separator className="bg-primary/30" />

          <motion.section variants={itemVariants}>
            <h3 className={cn("text-xl font-semibold mb-2 text-primary text-neon-glow")}>Multi-Factor Scoring System</h3>
            <p>
              The match score is not a simple sum but a weighted calculation based on multiple critical factors:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>
                <span className="text-primary text-neon-glow">Skill Alignment:</span> Direct and inferred relevance of candidate skills to job requirements.
              </li>
              <li>
                <span className="text-primary text-neon-glow">Experience Depth & Relevance:</span> How closely past roles and responsibilities align with the job's demands, considering seniority and impact.
              </li>
              <li>
                <span className="text-primary text-neon-glow">Educational Background:</span> The relevance and prestige of academic qualifications.
              </li>
              <li>
                <span className="text-primary text-neon-glow">Keyword Density & Context:</span> Beyond simple presence, the contextual usage and frequency of important terms.
              </li>
              <li>
                <span className="text-primary text-neon-glow">Soft Skills Inference:</span> Analysis of resume language to infer communication, leadership, and teamwork abilities.
              </li>
              <li>
                <span className="text-primary text-neon-glow">Career Trajectory:</span> Assessment of career progression and potential fit for future growth within the role.
              </li>
            </ul>
            <p className="mt-2">
              Each factor contributes to a comprehensive score, providing a holistic view of a candidate's suitability.
            </p>
          </motion.section>

          <Separator className="bg-primary/30" />

          <motion.section variants={itemVariants}>
            <h3 className={cn("text-xl font-semibold mb-2 text-primary text-neon-glow")}>Job Role Suggestions</h3>
            <p>
              Based on the deep analysis of a candidate's resume and the broader market context (informed by internet sources), the system can suggest alternative or complementary job roles where the candidate might also excel. This feature helps both recruiters identify versatile talent and candidates discover new opportunities.
            </p>
          </motion.section>
        </NeonCardContent>
      </NeonCard>
    </motion.div>
  );
};

export default About;