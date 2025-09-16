import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description?: string;
}

export function ModulePlaceholder({ 
  title, 
  description = "Este módulo será implementado quando as queries do Power BI forem integradas." 
}: ModulePlaceholderProps) {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
