import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAgents,
  getAgentBySlug,
  generateAgentSlug,
} from "@/lib/data/site-content";
import { AgentProfile } from "@/components/agents";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all agents
export async function generateStaticParams() {
  const agents = getAgents();
  return agents.map((agent) => ({
    slug: agent.slug || generateAgentSlug(agent.name),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    return {
      title: "Agent Not Found | Coldwell Banker Associated Brokers Realty",
    };
  }

  return {
    title: `${agent.name} - ${agent.title} | Coldwell Banker Associated Brokers Realty`,
    description: agent.bio
      ? agent.bio.slice(0, 160)
      : `${agent.name} is a ${agent.title} at Coldwell Banker Associated Brokers Realty serving Sioux City and the greater Siouxland area.`,
    openGraph: {
      title: `${agent.name} - ${agent.title}`,
      description: `Contact ${agent.name} for all your real estate needs in Siouxland.`,
      images: agent.photo ? [agent.photo] : [],
    },
  };
}

export default async function AgentPage({ params }: PageProps) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    notFound();
  }

  return <AgentProfile agent={agent} />;
}
