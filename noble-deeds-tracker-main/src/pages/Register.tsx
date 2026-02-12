import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Heart, Loader2, Phone, Mail, User, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { z } from "zod";

// Validation schema for registration
const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number is too long")
    .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
  city: z.string().trim().min(2, "City is required").max(100, "City name is too long"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
  availability: z.string().min(1, "Please select your availability"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  bio: z.string().trim().max(500, "Bio must be less than 500 characters").optional(),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
});

const skillOptions = [
  "Healthcare",
  "Education",
  "Relief Work",
  "Administration",
  "IT & Technology",
  "Communications",
  "Fundraising",
  "Community Outreach",
  "Transportation",
  "Other",
];

const availabilityOptions = [
  { value: "weekdays", label: "Weekdays Only" },
  { value: "weekends", label: "Weekends Only" },
  { value: "flexible", label: "Flexible Schedule" },
  { value: "evenings", label: "Evenings Only" },
];

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    availability: "",
    skills: [] as string[],
    bio: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const validateForm = () => {
    try {
      registrationSchema.parse({
        ...formData,
        agreeToTerms: formData.agreeToTerms as true,
      });

      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            availability: formData.availability,
            skills: formData.skills,
            bio: formData.bio.trim(),
          },
        },
      });

      if (error) throw error;

      // Update profile with additional info
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            availability: formData.availability,
            skills: formData.skills,
            bio: formData.bio.trim(),
          })
          .eq("user_id", user.id);
      }

      toast({
        title: "Registration Successful!",
        description: "Welcome to Al-Khidmat Volunteer Portal. Redirecting to dashboard...",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-medium">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Become a Volunteer
            </h1>
            <p className="text-muted-foreground">
              Join our community of dedicated volunteers making a difference
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`input-focus ${errors.fullName ? "border-destructive" : ""}`}
                      disabled={loading}
                    />
                    {errors.fullName && (
                      <p className="text-destructive text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="city"
                        name="city"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`input-focus pl-10 ${errors.city ? "border-destructive" : ""}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-destructive text-sm">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-focus ${errors.email ? "border-destructive" : ""}`}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`input-focus pl-10 ${errors.phone ? "border-destructive" : ""}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-destructive text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-focus pr-10 ${errors.password ? "border-destructive" : ""}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`input-focus ${errors.confirmPassword ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Volunteer Details */}
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                  Volunteer Preferences
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, availability: value }));
                        if (errors.availability) {
                          setErrors((prev) => ({ ...prev, availability: "" }));
                        }
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className={`input-focus ${errors.availability ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.availability && (
                      <p className="text-destructive text-sm">{errors.availability}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Skills & Interests *</Label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            formData.skills.includes(skill)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {errors.skills && (
                      <p className="text-destructive text-sm">{errors.skills}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Tell us about yourself (Optional)</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Share your motivation for volunteering, previous experience, or anything else you'd like us to know..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="input-focus resize-none"
                      rows={4}
                      disabled={loading}
                    />
                    {errors.bio && (
                      <p className="text-destructive text-sm">{errors.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                  disabled={loading}
                />
                <div>
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-normal cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.agreeToTerms && (
                    <p className="text-destructive text-sm mt-1">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Register as Volunteer"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
