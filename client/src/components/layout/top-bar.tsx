import { Search, RefreshCw, Download, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
            data-testid="button-open-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">
              {subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Pesquisar..."
              className="w-64 pl-10"
              data-testid="input-search"
            />
          </div>
          
          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            title="Atualizar dados"
            data-testid="button-refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Exportar"
            data-testid="button-export"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Configurações"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
