import { Check } from "lucide-react";

interface PropertyFeaturesProps {
  features: string[];
}

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Property Features</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
