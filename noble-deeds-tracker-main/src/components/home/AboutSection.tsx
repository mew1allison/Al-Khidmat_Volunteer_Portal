import { CheckCircle, Target, Users, Heart } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To serve humanity through organized volunteer efforts, providing relief and support to those in need.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Building stronger communities by connecting passionate volunteers with meaningful service opportunities.",
    },
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every volunteer brings compassion and dedication, making a real difference in people's lives.",
    },
  ];

  const benefits = [
    "Flexible volunteering schedules",
    "Training and skill development",
    "Recognition and certificates",
    "Network with like-minded people",
    "Make a real community impact",
    "Personal growth opportunities",
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              About Al-Khidmat Foundation
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Empowering Communities Through{" "}
              <span className="gradient-text">Volunteer Service</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Al-Khidmat Foundation is one of Pakistan's largest humanitarian organizations. 
              Our volunteer portal connects dedicated individuals with opportunities to serve 
              in healthcare, education, disaster relief, and community development programs.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success shrink-0" />
                  <span className="text-foreground/80 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50 shadow-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
