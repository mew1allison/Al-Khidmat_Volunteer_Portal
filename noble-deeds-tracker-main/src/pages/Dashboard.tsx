import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  CheckCircle,
  Target,
  Star,
} from "lucide-react";

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

interface Profile {
  full_name: string;
  skills: string[] | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, skills")
          .eq("user_id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch assignments with activities
        const { data: assignmentData } = await supabase
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
          .eq("status", "active")
          .order("assigned_at", { ascending: false });

        if (assignmentData) {
          setAssignments(assignmentData as unknown as Assignment[]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    {
      icon: Target,
      label: "Active Assignments",
      value: assignments.length,
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: 0,
      color: "text-success",
    },
    {
      icon: Clock,
      label: "Hours Volunteered",
      value: 0,
      color: "text-accent",
    },
    {
      icon: Star,
      label: "Impact Score",
      value: 0,
      color: "text-primary",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="section-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 rounded-2xl p-6 md:p-8 text-primary-foreground mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name || "Volunteer"}! 👋
            </h1>
            <p className="text-primary-foreground/80 max-w-xl">
              Thank you for being part of our volunteer community. Your dedication makes a real difference in people's lives.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile?.skills?.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-white/20 text-white border-0">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Activities */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">My Active Activities</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/activities" className="text-primary">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No Active Activities</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      You haven't joined any activities yet.
                    </p>
                    <Button className="btn-hero" asChild>
                      <Link to="/opportunities">Browse Opportunities</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="badge-primary text-xs">
                                {assignment.volunteer_activities.category || "General"}
                              </Badge>
                              <Badge variant="outline" className="badge-success text-xs">
                                Active
                              </Badge>
                            </div>
                            <h3 className="font-medium text-foreground mb-1">
                              {assignment.volunteer_activities.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/opportunities">
                    <Target className="w-4 h-4 mr-2 text-primary" />
                    Find New Opportunities
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/profile">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Update Profile
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/activities">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    View Schedule
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="border-border/50 bg-secondary/30">
              <CardHeader>
                <CardTitle className="font-display text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming events scheduled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
