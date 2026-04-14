import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ClipboardList } from "lucide-react";

const defaultMajors = [
  "Management Information Systems",
  "Construction Management",
  "Nursing",
  "Marketing",
  "Agribusiness",
  "Computer Science",
  "Education",
];

const experienceProfiles = {
  foundational: {
    label: "Foundational",
    roleLevel: "entry-level",
    titleHint: "Starting Strong",
    description:
      "Focus on entry-level roles where employers expect foundational knowledge, professionalism, and the ability to learn quickly. At this level, the goal is to identify baseline skills and understand what it takes to get started in the field.",
    examples: "assistant, coordinator, junior analyst",
    analysisDepth: "identify and explain the most common required skills",
    deliverable: "guided analysis with clear sections and short recommendations",
  },
  applied: {
    label: "Applied",
    roleLevel: "mid-level",
    titleHint: "Building Momentum",
    description:
      "Focus on mid-level roles where individuals are expected to apply knowledge independently, solve problems, and contribute meaningfully to projects. This level emphasizes bridging classroom learning with real-world application.",
    examples: "project manager, analyst",
    analysisDepth: "compare skills and identify meaningful gaps",
    deliverable: "analytical memo or report",
  },
  professional: {
    label: "Professional",
    roleLevel: "senior-level",
    titleHint: "Leading the Field",
    description:
      "Focus on senior or leadership roles where expectations include strategic thinking, decision-making, and guiding others. This level emphasizes long-term career readiness and advanced skill development.",
    examples: "director, senior manager",
    analysisDepth: "evaluate advanced and leadership skill gaps",
    deliverable: "professional report or executive summary",
  },
};

const marketByMajor = {
  "Management Information Systems":
    "Organizations increasingly rely on data, systems integration, cybersecurity awareness, and digital decision-making. Employers seek individuals who can bridge business and technology, communicate across teams, and adapt to rapidly changing tools and platforms.",
  "Construction Management":
    "Construction employers emphasize project coordination, scheduling, budgeting, safety compliance, and communication across stakeholders. Many roles require balancing field knowledge with digital tools, documentation, and leadership skills.",
  Nursing:
    "Healthcare roles demand strong patient care skills, accurate documentation, teamwork, and adaptability. Employers increasingly value professionals who can work in high-pressure environments while integrating technology and maintaining quality care.",
  Marketing:
    "Marketing continues to evolve through digital platforms, analytics, content creation, and customer engagement strategies. Employers look for candidates who can combine creativity with data-driven decision-making and strategic thinking.",
  Agribusiness:
    "Agribusiness blends traditional agricultural knowledge with modern business practices, including logistics, markets, and technology. Employers value adaptability, communication, and the ability to connect operations with broader economic trends.",
  "Computer Science":
    "Computer science roles emphasize programming, problem solving, collaboration, and adaptability. Employers increasingly look for candidates who can work in teams, build scalable solutions, and continuously learn new technologies.",
  Education:
    "Education roles emphasize communication, planning, instructional design, and responsiveness to learner needs. Employers increasingly expect technology integration, flexibility, and leadership in dynamic learning environments.",
};

const levelByExperience = {
  foundational:
    "At the foundational level, employers emphasize baseline skills, professionalism, and the ability to learn and contribute in structured environments.",
  applied:
    "At the applied level, employers expect independence, the ability to translate knowledge into practice, and effective performance in real-world situations.",
  professional:
    "At the professional level, employers prioritize leadership, strategic thinking, and the ability to guide decisions, teams, or projects.",
};

function getInterestProfile(value: number) {
  if (value <= 33) {
    return {
      label: "More practical",
      tone: "straightforward and practical",
      framing: "Focus on clarity and usefulness.",
    };
  }
  if (value <= 66) {
    return {
      label: "Balanced",
      tone: "engaging and career-relevant",
      framing: "Connect to real-world application.",
    };
  }
  return {
    label: "Highly engaging",
    tone: "energizing and future-focused",
    framing: "Highlight opportunities and growth.",
  };
}

function getFallbackMarketUpdate(major: string, experience: keyof typeof levelByExperience) {
  const majorMarket =
    marketByMajor[major as keyof typeof marketByMajor] || `${major} continues to evolve with changing expectations.`;
  const levelMarket = levelByExperience[experience];
  return `${majorMarket} ${levelMarket}`;
}

async function generateAIMarketUpdate(major: string, experience: string) {
  const response = await fetch("/api/market-update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ major, experience }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate AI market update.");
  }

  const data = await response.json();
  return data.marketUpdate as string;
}

function buildAssignment({
  major,
  experience,
  interest,
  studentName,
  customContext,
  marketUpdate,
}: {
  major: string;
  experience: keyof typeof experienceProfiles;
  interest: number;
  studentName: string;
  customContext: string;
  marketUpdate: string;
}) {
  const exp = experienceProfiles[experience];
  const intr = getInterestProfile(interest);

  let engagementHeading = "Structured approach";
  let engagementPrompt = "Follow the provided steps closely and keep your response focused.";

  if (interest > 33 && interest <= 66) {
    engagementHeading = "Career Connection";
    engagementPrompt = "Connect your analysis to your own goals or possible career direction.";
  } else if (interest > 66) {
    engagementHeading = "Personal strategy";
    engagementPrompt = "Choose a specific role that excites you and tailor your analysis around it.";
  }

  let experienceDirections: string[] = [];

if (experience === "foundational") {
  experienceDirections = [
    "Use clear examples from the job postings to explain what employers are looking for.",
    "Focus on identifying baseline skills and describing why they matter.",
    "Keep your analysis organized and easy to follow."
  ];
} else if (experience === "applied") {
  experienceDirections = [
    "Compare skill expectations across postings and explain where meaningful patterns appear.",
    "Show how classroom learning connects to real workplace expectations.",
    "Use your analysis to identify practical gaps a student could work on closing."
  ];
} else if (experience === "professional") {
  experienceDirections = [
    "Focus on advanced or leadership-oriented expectations in the postings.",
    "Discuss how strategic, communication, and decision-making skills appear in these roles.",
    "Frame your recommendations in a professional, career-ready way."
  ];
}

const instructions = [
  `Use the provided job market update for ${major} as context for your analysis.`,
  `Find 3 to 5 recent ${exp.roleLevel} job postings in ${major}.`,
  `Identify the most common technical and professional skills required.`,
  `Analyze the postings to ${exp.analysisDepth}.`,
  ...experienceDirections,
  `Suggest how a student in ${major} could better prepare for these roles.`,
  `${engagementPrompt}`,
  `Write your response in a way that feels ${intr.tone}. ${intr.framing}`,
];
  
 

  const deliverable = `Create a ${exp.deliverable}. Include the job market context, summary of postings, skills analysis, and recommendations.`;

  const rubric = [
    {
      category: "Job Market Understanding",
      excellent: "Clearly explains and uses job market context.",
      proficient: "Explains the job market with some connection.",
      developing: "Mentions job market with limited explanation.",
    },
    {
      category: "Use of Job Postings",
      excellent: "Uses multiple relevant postings effectively.",
      proficient: "Uses appropriate postings with some connection.",
      developing: "Uses limited or weak postings.",
    },
    {
      category: "Skills Gap Analysis",
      excellent: "Strong and well-supported analysis of gaps.",
      proficient: "Basic analysis of gaps.",
      developing: "Limited or unclear analysis.",
    },
    {
      category: "Recommendations",
      excellent: "Clear, realistic, and well supported.",
      proficient: "General recommendations.",
      developing: "Weak or missing recommendations.",
    },
    {
      category: "Clarity and Organization",
      excellent: "Well organized and clear.",
      proficient: "Generally clear with minor issues.",
      developing: "Difficult to follow.",
    },
  ];

  return {
    title: `${exp.titleHint}: Exploring the ${major} Skills Gap`,
    scenario: `${studentName ? studentName + ", y" : "Y"}ou are exploring ${exp.roleLevel} roles in ${major}. Your goal is to identify skill gaps between preparation and employer expectations. ${
      customContext ? `Focus on ${customContext}.` : ""
    }`,
    marketUpdate,
    engagementHeading,
    instructions,
    deliverable,
    rubric,
  };
}

export default function SkillsGapAssignmentBuilder() {
  const [studentName, setStudentName] = useState("");
  const [major, setMajor] = useState(defaultMajors[0]);
  const [customMajor, setCustomMajor] = useState("");
  const [experience, setExperience] = useState<keyof typeof experienceProfiles>("foundational");
  const [interest, setInterest] = useState([55]);
  const [customContext, setCustomContext] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [marketUpdate, setMarketUpdate] = useState(getFallbackMarketUpdate(defaultMajors[0], "foundational"));
  const [marketStatus, setMarketStatus] = useState("Using built-in summary.");

  const activeMajor = customMajor.trim() || major;

  useEffect(() => {
    let cancelled = false;

    async function loadMarketUpdate() {
      const fallback = getFallbackMarketUpdate(activeMajor, experience);

      if (!useAI) {
        setMarketUpdate(fallback);
        setMarketStatus("Using built-in summary.");
        return;
      }

      setMarketUpdate(fallback);
      setMarketStatus("Generating AI job market update...");

      try {
        const aiText = await generateAIMarketUpdate(activeMajor, experience);
        if (!cancelled) {
          setMarketUpdate(aiText || fallback);
          setMarketStatus("Using AI-generated summary.");
        }
      } catch {
        if (!cancelled) {
          setMarketUpdate(fallback);
          setMarketStatus("AI unavailable. Using built-in summary.");
        }
      }
    }

    loadMarketUpdate();

    return () => {
      cancelled = true;
    };
  }, [activeMajor, experience, useAI]);

  const assignment = useMemo(() => {
    return buildAssignment({
      major: activeMajor,
      experience,
      interest: interest[0],
      studentName,
      customContext,
      marketUpdate,
    });
  }, [activeMajor, experience, interest, studentName, customContext, marketUpdate]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 shadow-sm border">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Build Your Assignment</CardTitle>
                <CardDescription>
                  Choose your major, experience level, and engagement. You can also toggle AI on for a live job market summary.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              placeholder="Student name (optional)"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <Select value={major} onValueChange={setMajor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {defaultMajors.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Or custom major"
              value={customMajor}
              onChange={(e) => setCustomMajor(e.target.value)}
            />

            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(experienceProfiles).map(([k, p]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setExperience(k as keyof typeof experienceProfiles)}
                  className={`p-4 rounded-xl border text-left transition ${
                    experience === k ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-medium">{p.label}</div>
                  <div className="text-xs mt-1">{p.roleLevel}</div>
                  <p className="text-xs mt-2 leading-5 opacity-90">{p.description}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Slider value={interest} onValueChange={setInterest} max={100} />
              <div className="flex justify-between text-xs text-slate-600">
                <span>Practical</span>
                <span className="font-medium text-slate-900">{getInterestProfile(interest[0]).label}</span>
                <span>Exciting</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label htmlFor="ai-toggle" className="font-medium">
                  Use AI for job market update
                </Label>
                <p className="text-xs text-slate-600 mt-1">Vercel serverless function required for public deployment.</p>
              </div>
              <Switch id="ai-toggle" checked={useAI} onCheckedChange={setUseAI} />
            </div>

            <Textarea
              placeholder="Optional focus"
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Assignment</CardTitle>
            <CardDescription>{marketStatus}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold">{assignment.title}</h2>
            <p>{assignment.scenario}</p>

            <div className="p-3 border rounded">
              <strong>Job Market</strong>
              <p className="mt-2">{assignment.marketUpdate}</p>
            </div>

            <div className="p-3 border rounded">
              <strong>{assignment.engagementHeading}</strong>
            </div>

            <ol className="space-y-2 list-decimal pl-5">
              {assignment.instructions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>

            <p>
              <strong>Deliverable:</strong> {assignment.deliverable}
            </p>

            {assignment.rubric.map((r, i) => (
              <div key={i} className="border p-3 rounded">
                <strong>{r.category}</strong>
                <div className="mt-1">Excellent: {r.excellent}</div>
                <div>Proficient: {r.proficient}</div>
                <div>Developing: {r.developing}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
