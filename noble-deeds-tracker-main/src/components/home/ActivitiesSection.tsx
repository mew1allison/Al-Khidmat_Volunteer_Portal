import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Community Health Camp",
    description: "Provide free medical checkups and health awareness in underserved communities.",
    location: "Karachi, Pakistan",
    date: "Feb 15, 2026",
    volunteers: 25,
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Education Support Program",
    description: "Help underprivileged children with tutoring and educational resources.",
    location: "Lahore, Pakistan",
    date: "Feb 20, 2026",
    volunteers: 15,
    category: "Education",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Food Distribution Drive",
    description: "Distribute essential food packages to families affected by economic hardship.",
    location: "Islamabad, Pakistan",
    date: "Feb 25, 2026",
    volunteers: 30,
    category: "Relief",
    image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9e2?auto=format&fit=crop&w=600&q=80",
  },
];

const ActivitiesSection = () => {
  return (
    <section id="activities" className="py-16 md:py-24 bg-muted/30">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Featured Activities
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ongoing Volunteer{" "}
            <span className="gradient-text">Opportunities</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover meaningful ways to contribute to your community. From healthcare to education, 
            find the perfect opportunity that matches your skills and passion.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {activities.map((activity) => (
            <article key={activity.id} className="activity-card group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge-primary text-xs font-medium px-3 py-1 rounded-full">
                    {activity.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{activity.volunteers} volunteers needed</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                  <Link to="/register">
                    Join Activity
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="btn-hero" asChild>
            <Link to="/register">
              View All Opportunities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
