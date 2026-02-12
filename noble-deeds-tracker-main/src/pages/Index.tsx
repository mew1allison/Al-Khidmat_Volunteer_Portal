import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ActivitiesSection from "@/components/home/ActivitiesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
