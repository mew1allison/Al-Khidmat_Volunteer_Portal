import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart, Globe } from "lucide-react";
const HeroSection = () => {
  return <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="section-container relative py-16 md:py-24 lg:py-32 bg-[#005fad]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left stagger-children">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Making a difference together</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Volunteer Management{" "}
              <span className="text-accent">System</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-xl mx-auto lg:mx-0">
              Join Al-Khidmat Foundation's community of dedicated volunteers. Together, we serve humanity and create lasting positive change in communities across Pakistan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="btn-cta text-base px-8" asChild>
                <Link to="/register">
                  Become a Volunteer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white text-base px-8" asChild>
                <Link to="/login">Volunteer Login</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="glass-card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center animate-float">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
              <div className="text-sm text-primary-foreground/70">Active Volunteers</div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center animate-float" style={{
            animationDelay: "0.5s"
          }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-sm text-primary-foreground/70">Projects Completed</div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center animate-float" style={{
            animationDelay: "1s"
          }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
              <div className="text-sm text-primary-foreground/70">Cities Covered</div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center animate-float" style={{
            animationDelay: "1.5s"
          }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">1M+</div>
              <div className="text-sm text-primary-foreground/70">Lives Impacted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background" />
        </svg>
      </div>
    </section>;
};
export default HeroSection;