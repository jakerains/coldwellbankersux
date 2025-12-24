import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteAgent } from "@/lib/types/site";
import { formatPhone } from "@/lib/utils/formatters";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface AgentCardProps {
  agent: SiteAgent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        {/* Agent Info */}
        <div className="text-center mb-4">
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-primary/10">
            {agent.photo ? (
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg">{agent.name}</h3>
          {agent.title && (
            <Badge variant="secondary" className="mt-1">
              {agent.title}
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {agent.phone && (
            <a
              href={`tel:${agent.phone.replace(/\D/g, "")}`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {formatPhone(agent.phone)}
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              {agent.email}
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {agent.phone && (
            <Button className="w-full" size="sm" asChild>
              <a href={`tel:${agent.phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </a>
            </Button>
          )}
          <Button variant="outline" className="w-full" size="sm" asChild>
            <Link href={`/agents/${agent.slug || generateSlug(agent.name)}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
