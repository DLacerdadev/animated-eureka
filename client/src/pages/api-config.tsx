import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useConnectionStatus, useUpdateAPIConfig } from "@/hooks/use-senior-api";
import { seniorAPI } from "@/lib/senior-api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Eye, EyeOff, Plug2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockEndpoints = [
  {
    module: "Folha",
    endpoint: "/platform/payroll/getPayrollData",
    status: "Ativo",
    lastSync: "há 5 min",
  },
  {
    module: "Pessoas",
    endpoint: "/platform/user/getEmployees",
    status: "Ativo",
    lastSync: "há 3 min",
  },
  {
    module: "Turnover",
    endpoint: "/platform/hr/getTurnoverData",
    status: "Pendente",
    lastSync: "há 15 min",
  },
  {
    module: "Absenteísmo",
    endpoint: "/platform/hr/getAbsenteeismData",
    status: "Ativo",
    lastSync: "há 8 min",
  },
  {
    module: "Demografia",
    endpoint: "/platform/hr/getDemographicsData",
    status: "Ativo",
    lastSync: "há 12 min",
  },
];

export default function APIConfig() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [config, setConfig] = useState(() => seniorAPI.getConfig());
  const { data: connectionStatus } = useConnectionStatus();
  const updateConfig = useUpdateAPIConfig();
  const { toast } = useToast();

  const handleTestConnection = async () => {
    try {
      const response = await seniorAPI.testConnection();
      if (response.success) {
        toast({
          title: "Conexão bem-sucedida",
          description: "A API Senior está respondendo corretamente.",
        });
      } else {
        toast({
          title: "Falha na conexão",
          description: response.error || "Não foi possível conectar com a API Senior.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao testar a conexão.",
        variant: "destructive",
      });
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateConfig.mutateAsync(config);
      toast({
        title: "Configuração salva",
        description: "As configurações da API foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card data-testid="api-config-form">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Configuração da API Senior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-url">URL da API</Label>
            <Input
              id="api-url"
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              className="mt-1"
              data-testid="input-api-url"
            />
          </div>
          
          <div>
            <Label htmlFor="api-key">Chave da API</Label>
            <div className="relative mt-1">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="pr-10"
                data-testid="input-api-key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
                data-testid="button-toggle-api-key"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="client-id">Client ID (Opcional)</Label>
            <Input
              id="client-id"
              type="text"
              value={config.clientId || ""}
              onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
              className="mt-1"
              placeholder="opus-dashboard"
              data-testid="input-client-id"
            />
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <Button
              onClick={handleTestConnection}
              disabled={updateConfig.isPending}
              data-testid="button-test-connection"
            >
              <Plug2 className="h-4 w-4 mr-2" />
              Testar Conexão
            </Button>

            <Button
              onClick={handleSaveConfig}
              disabled={updateConfig.isPending}
              variant="outline"
              data-testid="button-save-config"
            >
              Salvar Configuração
            </Button>
            
            <div className="flex items-center space-x-2 text-sm">
              {connectionStatus?.isConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-chart-2" />
                  <span className="text-chart-2">Conectado com sucesso</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">Desconectado</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Table */}
      <Card data-testid="api-endpoints-table">
        <CardHeader>
          <CardTitle className="text-md font-medium">Endpoints Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Módulo</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Endpoint</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Última Sync</th>
                </tr>
              </thead>
              <tbody>
                {mockEndpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-border" data-testid={`endpoint-row-${index}`}>
                    <td className="py-3 px-4 text-foreground">{endpoint.module}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                      {endpoint.endpoint}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={endpoint.status === "Ativo" ? "default" : "secondary"}
                        className={cn(
                          endpoint.status === "Ativo" 
                            ? "bg-chart-2 text-white" 
                            : "bg-chart-3 text-white"
                        )}
                      >
                        {endpoint.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{endpoint.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
