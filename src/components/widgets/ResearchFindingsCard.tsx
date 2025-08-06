import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckCircle, ExternalLink, Users, Phone, Mail, Linkedin, Swords, Calendar } from "lucide-react";

interface ResearchFindingsCardProps {
  researchFindings: any;
  sources?: any[];
  messageId: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onCitationClick?: (messageId: string, sourceId: number) => void;
  highlightedSource?: number | null;
}

const renderTextWithCitations = (
  text: string, 
  messageId: string, 
  onCitationClick?: (messageId: string, sourceId: number) => void
) => {
  if (!onCitationClick) return text;
  
  const citationPattern = /\[(\d+)\]/g;
  const parts = text.split(citationPattern);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const sourceId = parseInt(part);
      return (
        <button
          key={index}
          onClick={() => onCitationClick(messageId, sourceId)}
          className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded border border-primary/20 hover:border-primary/40 transition-colors mx-0.5 align-baseline"
          title={`View source ${sourceId}`}
        >
          {sourceId}
        </button>
      );
    }
    return part;
  });
};

const getRelevanceColor = (relevance: string): string => {
  switch (relevance) {
    case "high": return "text-green-600 bg-green-50 border-green-200";
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low": return "text-gray-600 bg-gray-50 border-gray-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "article": return <div className="w-4 h-4">📄</div>;
    case "press_release": return <div className="w-4 h-4">📢</div>;
    case "report": return <div className="w-4 h-4">📊</div>;
    case "social": return <div className="w-4 h-4">👥</div>;
    case "company_page": return <div className="w-4 h-4">🏢</div>;
    case "news": return <div className="w-4 h-4">🌐</div>;
    default: return <div className="w-4 h-4">🌐</div>;
  }
};

export function ResearchFindingsCard({ 
  researchFindings, 
  sources, 
  messageId, 
  activeTab = "findings", 
  onTabChange = () => {}, 
  onCitationClick = () => {},
  highlightedSource 
}: ResearchFindingsCardProps) {
  return (
    <Card className="bg-background border w-full">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex items-center justify-between p-4 pb-0">
            <h3 className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {researchFindings.title}
            </h3>
            <TabsList className="grid w-auto grid-cols-2 bg-muted/50">
              <TabsTrigger value="findings" className="text-xs">
                Findings
              </TabsTrigger>
              <TabsTrigger value="sources" className="text-xs">
                Sources
                {sources && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {sources.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="findings" className="p-4 pt-4">
            <div className="space-y-4">
              {researchFindings.items.map((item: any, index: number) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h4 className="text-foreground mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                  
                  {item.contact && (
                    <div className="bg-accent/30 rounded p-3 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{item.contact.name} - {item.contact.role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{item.contact.email}</span>
                          </div>
                        )}
                        {item.contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{item.contact.phone}</span>
                          </div>
                        )}
                        {item.contact.linkedin && (
                          <div className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            <span>{item.contact.linkedin}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {item.valueProps && (
                    <div className="space-y-3 mb-2">
                      {item.valueProps.map((valueProp: any, vpIndex: number) => (
                        <div key={vpIndex} className="bg-primary/5 rounded p-3 border-l-4 border-l-primary">
                          <div className="flex items-center gap-2 mb-2">
                            <Swords className="w-4 h-4 text-primary" />
                            <span className="text-sm">{valueProp.ourAdvantage}</span>
                            <Badge variant="outline" className="text-xs">vs {valueProp.competitor}</Badge>
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">Key Talking Points:</p>
                            <ul className="text-xs space-y-0.5">
                              {valueProp.talkingPoints.map((point: string, pointIndex: number) => (
                                <li key={pointIndex} className="flex items-start gap-1">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{renderTextWithCitations(point, messageId, onCitationClick)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {valueProp.objectionHandling && (
                            <div className="bg-accent/50 rounded p-2">
                              <p className="text-xs text-muted-foreground mb-1">Objection Handling:</p>
                              <p className="text-xs">{renderTextWithCitations(valueProp.objectionHandling, messageId, onCitationClick)}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.details && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.details.map((detail: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{renderTextWithCitations(detail, messageId, onCitationClick)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="p-4 pt-4">
            <div className="space-y-4">
              {sources && sources.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Sources ({sources.length})
                    </h4>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {sources.filter(s => s.relevance === "high").length} High
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {sources.filter(s => s.relevance === "medium").length} Medium
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {sources.filter(s => s.relevance === "low").length} Low
                      </Badge>
                    </div>
                  </div>
                  
                  {sources.map((source) => (
                    <Card 
                      key={source.id} 
                      className={`hover:shadow-md transition-all duration-300 ${
                        highlightedSource === source.id 
                          ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
                          : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded bg-accent/50 flex items-center justify-center">
                              {getTypeIcon(source.type)}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="hover:text-primary transition-colors">
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    {source.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </h5>
                                <p className="text-xs text-muted-foreground">{source.domain}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs capitalize ${getRelevanceColor(source.relevance)}`}
                                >
                                  {source.relevance}
                                </Badge>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {source.type.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{source.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">{source.id}</span>
                                Citation #{source.id}
                              </span>
                              {source.publishedDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {source.publishedDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h4>No Sources Available</h4>
                  <p className="text-muted-foreground">
                    Sources for this research will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 