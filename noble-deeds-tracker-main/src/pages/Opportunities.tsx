import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  max_volunteers: number | null;
  current_volunteers: number | null;
  status: string | null;
  category: string | null;
  image_url: string | null;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9e2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
];

const Opportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userAssignments, setUserAssignments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch open activities
        const { data: activitiesData } = await supabase
          .from("volunteer_activities")
          .select("*")
          .eq("status", "open")
          .order("start_date", { ascending: true });

        if (activitiesData) {
          setActivities(activitiesData);
        }

        // Fetch user's current assignments
        if (user) {
          const { data: assignmentsData } = await supabase
            .from("volunteer_assignments")
            .select("activity_id")
            .eq("user_id", user.id)
            .eq("status", "active");

          if (assignmentsData) {
            setUserAssignments(assignmentsData.map((a) => a.activity_id));
          }
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleJoinActivity = async (activityId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to join activities.",
      });
      return;
    }

    setJoiningId(activityId);

    try {
      const { error } = await supabase.from("volunteer_assignments").insert({
        user_id: user.id,
        activity_id: activityId,
        status: "active",
      });

      if (error) throw error;

      setUserAssignments((prev) => [...prev, activityId]);
      
      toast({
        title: "Successfully Joined!",
        description: "You have been added to this volunteer activity.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Join",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-64 bg-muted rounded-lg" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-xl" />
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
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Open Opportunities
          </h1>
          <p className="text-muted-foreground text-lg">
            Find meaningful volunteer opportunities and make a difference in your community.
          </p>
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                No Open Opportunities
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are currently no open volunteer opportunities. Check back soon for new activities!
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => {
              const isJoined = userAssignments.includes(activity.id);
              const spotsLeft = (activity.max_volunteers || 10) - (activity.current_volunteers || 0);
              const isFull = spotsLeft <= 0;

              return (
                <Card key={activity.id} className="activity-card overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.image_url || defaultImages[index % defaultImages.length]}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="badge-primary">
                        {activity.category || "General"}
                      </Badge>
                      {isFull && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {activity.description || "Join us for this volunteer activity."}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      {activity.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(activity.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "No spots left"}</span>
                      </div>
                    </div>

                    {isJoined ? (
                      <Button disabled className="w-full" variant="secondary">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Already Joined
                      </Button>
                    ) : isFull ? (
                      <Button disabled className="w-full" variant="outline">
                        Activity Full
                      </Button>
                    ) : user ? (
                      <Button
                        className="w-full btn-hero"
                        onClick={() => handleJoinActivity(activity.id)}
                        disabled={joiningId === activity.id}
                      >
                        {joiningId === activity.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            Join Activity
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full btn-hero" asChild>
                        <Link to="/register">
                          Register to Join
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Opportunities;
