import { useConnectionStatus } from "@/hooks/use-senior-api";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { data: status, isLoading } = useConnectionStatus();

  return (
    <div className="p-4 bg-muted rounded-lg" data-testid="connection-status">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">API Senior</span>
        <div className="flex items-center space-x-1">
          {isLoading ? (
            <>
              <Loader2 className="w-2 h-2 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Verificando...</span>
            </>
          ) : status?.isConnected ? (
            <>
              <CheckCircle className="w-2 h-2 text-chart-2" />
              <span className="text-xs text-chart-2">Conectado</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-2 h-2 text-destructive" />
              <span className="text-xs text-destructive">Desconectado</span>
            </>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        api-senior.tecnologiagrupoopus.com.br
      </p>
      {status?.error && (
        <p className="text-xs text-destructive mt-1">
          Erro: {status.error}
        </p>
      )}
      {status?.lastSync && (
        <p className="text-xs text-muted-foreground mt-1">
          Última verificação: {new Date(status.lastSync).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
