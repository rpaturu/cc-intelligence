import React from "react";
import { Users, Mail, Linkedin, Phone, MapPin, Calendar, Briefcase, Star, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { decisionMakers } from "./data/decision-makers-data";

export const DecisionMakersContent: React.FC = () => {

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "C-Level": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "VP": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Director": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "Manager": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">3 High-Influence Decision Makers Identified</h1>
          <p className="text-muted-foreground">Complete profiles with contact details, buying signals, and outreach opportunities</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Key Decision Makers</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">C-Level Executives</p>
              </div>
              <Star className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">$3.5M+</p>
                <p className="text-sm text-muted-foreground">Combined Budget</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">High Influence</p>
              </div>
              <ChevronRight className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Makers Grid */}
      <div className="space-y-6">
        {decisionMakers.map((person) => (
          <Card key={person.id} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {person.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                        <p className="text-muted-foreground">{person.role}</p>
                        <p className="text-sm text-muted-foreground">{person.background}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(person.level)}>
                          {person.level}
                        </Badge>
                        <Badge className={getInfluenceColor(person.influence)}>
                          {person.influence} Influence
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {person.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{person.email}</span>
                        </div>
                      )}
                      {person.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{person.phone}</span>
                        </div>
                      )}
                      {person.linkedin && (
                        <div className="flex items-center gap-1">
                          <Linkedin className="w-4 h-4" />
                          <span>{person.linkedin}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{person.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tenure: {person.tenure}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>Budget: {person.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Tabs */}
                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="interests">Key Interests</TabsTrigger>
                    <TabsTrigger value="signals">Buying Signals</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="mt-4">
                    <div className="space-y-2">
                      {person.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm text-foreground">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interests" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {person.keyInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signals" className="mt-4">
                    <div className="space-y-2">
                      {person.buyingSignals.map((signal, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                          <span className="text-sm text-foreground">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="connections" className="mt-4">
                    <div className="space-y-2">
                      {person.connectionOpportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-sm text-foreground">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button className="btn-hover-lift">
          <Mail className="w-4 h-4 mr-2" />
          Create Outreach Campaign
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Briefcase className="w-4 h-4 mr-2" />
          Export Contact List
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Users className="w-4 h-4 mr-2" />
          Research Additional Contacts
        </Button>
      </div>
    </div>
  );
};