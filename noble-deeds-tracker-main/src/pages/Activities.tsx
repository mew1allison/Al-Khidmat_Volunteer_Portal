import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  category: string | null;
  status: string | null;
}

interface Assignment {
  id: string;
  status: string | null;
  assigned_at: string;
  volunteer_activities: Activity;
}

const Activities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from("volunteer_assignments")
          .select(`
            id,
            status,
            assigned_at,
            volunteer_activities (
              id,
              title,
              description,
              location,
              start_date,
              end_date,
              category,
              status
            )
          `)
          .eq("user_id", user.id)
          .order("assigned_at", { ascending: false });

        if (data) {
          setAssignments(data as unknown as Assignment[]);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  const handleCancelAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from("volunteer_assignments")
        .update({ status: "cancelled" })
        .eq("id", assignmentId);

      if (error) throw error;

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, status: "cancelled" } : a
        )
      );

      toast({
        title: "Activity Cancelled",
        description: "You have been removed from this activity.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to cancel activity.",
      });
    }
  };

  const activeAssignments = assignments.filter((a) => a.status === "active");
  const completedAssignments = assignments.filter((a) => a.status === "completed");
  const cancelledAssignments = assignments.filter((a) => a.status === "cancelled");

  const ActivityCard = ({
    assignment,
    showActions = false,
  }: {
    assignment: Assignment;
    showActions?: boolean;
  }) => (
    <Card className="border-border/50 hover:shadow-soft transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="badge-primary text-xs">
                {assignment.volunteer_activities.category || "General"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  assignment.status === "active"
                    ? "badge-success"
                    : assignment.status === "completed"
                    ? "badge-primary"
                    : "text-muted-foreground"
                }
              >
                {assignment.status === "active"
                  ? "Active"
                  : assignment.status === "completed"
                  ? "Completed"
                  : "Cancelled"}
              </Badge>
            </div>

            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              {assignment.volunteer_activities.title}
            </h3>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {assignment.volunteer_activities.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {assignment.volunteer_activities.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {assignment.volunteer_activities.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(assignment.volunteer_activities.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                Joined {new Date(assignment.assigned_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {showActions && assignment.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => handleCancelAssignment(assignment.id)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="section-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-64 bg-muted rounded-lg" />
            <div className="h-12 bg-muted rounded-lg" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Activities
            </h1>
            <p className="text-muted-foreground">
              Track your volunteer activities and assignments.
            </p>
          </div>
          <Button className="btn-hero" asChild>
            <Link to="/opportunities">
              Find More Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6">
            <TabsTrigger value="active" className="flex-1 sm:flex-none">
              Active ({activeAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">
              Completed ({completedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">
              Cancelled ({cancelledAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeAssignments.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Active Activities
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't joined any volunteer activities yet. Start making a difference today!
                  </p>
                  <Button className="btn-hero" asChild>
                    <Link to="/opportunities">Browse Opportunities</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeAssignments.map((assignment) => (
                  <ActivityCard key={assignment.id} assignment={assignment} showActions />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedAssignments.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Completed Activities
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Completed activities will appear here once they're finished.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedAssignments.map((assignment) => (
                  <ActivityCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelledAssignments.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <XCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Cancelled Activities
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    You haven't cancelled any activities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cancelledAssignments.map((assignment) => (
                  <ActivityCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Activities;
