import Link from "next/link";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils/formatters";

interface AgentContactCardProps {
  agent: {
    name: string;
    phone?: string;
    email?: string;
    company?: string;
  };
  listingAddress: string;
}

export function AgentContactCard({ agent, listingAddress }: AgentContactCardProps) {
  const emailSubject = encodeURIComponent(`Inquiry about ${listingAddress}`);
  const emailBody = encodeURIComponent(
    `Hi ${agent.name},\n\nI am interested in learning more about the property at ${listingAddress}.\n\nPlease contact me at your earliest convenience.\n\nThank you!`
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contact Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold">{agent.name}</p>
          {agent.company && (
            <p className="text-sm text-muted-foreground">{agent.company}</p>
          )}
          {!agent.company && (
            <p className="text-sm text-muted-foreground">
              Coldwell Banker Associated Brokers Realty
            </p>
          )}
        </div>

        <div className="space-y-2">
          {agent.phone && (
            <a
              href={`tel:${agent.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {formatPhone(agent.phone)}
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {agent.email}
            </a>
          )}
        </div>

        <div className="space-y-2 pt-2">
          {agent.phone && (
            <Button className="w-full" asChild>
              <a href={`tel:${agent.phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call Agent
              </a>
            </Button>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/contact?property=${encodeURIComponent(listingAddress)}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Info
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
