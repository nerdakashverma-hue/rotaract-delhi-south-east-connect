import { Target, Users, Award, Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-float animation-delay-300" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 hover:bg-primary/15 transition-colors">
            About Us
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Hola <span className="gradient-text">Amigos!</span> 👋
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't worry, we're not Spanish… but we are proudly part of the global Rotary and Rotaract family! 🌍✨
          </p>
        </div>

        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 animate-slide-up animation-delay-200">
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              What is <span className="gradient-text">Rotaract?</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the world of Rotaract – where passion meets purpose, and youth meets action! Backed by Rotary International, Rotaract brings together young minds who are crazy enough to believe they can change the world – and then actually do it. 💥
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether it's community service, leadership adventures, professional growth, or just vibing with like-minded changemakers – Rotaract is where it all happens. From local projects to global impact, we don't just dream big, we do big.
            </p>
            <p className="text-lg font-medium gradient-text">
              Let's serve, grow, and glow – together! 🚀
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: "Our Mission", desc: "Creating lasting impact through meaningful service", delay: 0 },
              { icon: Users, title: "Community", desc: "A family of passionate changemakers", delay: 100 },
              { icon: Award, title: "Leadership", desc: "Developing tomorrow's leaders today", delay: 200 },
              { icon: Sparkles, title: "Growth", desc: "Personal and professional development", delay: 300 },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover-lift group animate-scale-in"
                style={{ animationDelay: `${300 + item.delay}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About RAC DSE */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 animate-slide-up animation-delay-400 hover:shadow-lg transition-shadow">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
            About <span className="gradient-text">RAC Delhi South East</span>
          </h3>
          <p className="text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
            The Rotaract Club of Delhi South East, part of Rotaract District 3011, is committed to making a positive impact on society through meaningful social service and community-driven initiatives. We have consistently initiated and executed various projects aimed at uplifting marginalized communities and addressing critical social issues. Our key accomplishments include a plantation drive with 450+ saplings, a blood donation and health camp collecting 50+ units and aiding more than 800+ underprivileged individuals, and a pad donation drive distributing 4,000+ sanitary pads. Additionally, we launched Amulya, an initiative where we visited an old age home to seek blessings from senior citizens as we embarked on our new tenure.
          </p>
        </div>

        {/* Vision */}
        <div className="text-center animate-slide-up animation-delay-500">
          <div className="inline-block gradient-bg rounded-2xl p-8 md:p-12 max-w-3xl animate-glow">
            <span className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">Our Vision</span>
            <p className="text-xl md:text-2xl font-display text-primary-foreground mt-4 leading-relaxed">
              "Together, we embark on a journey where we adapt and evolve to create a lasting impact. We find purpose, grow personally and thrive collectively."
            </p>
            <p className="text-primary-foreground font-bold mt-4 text-lg">Adapt to Impact.</p>
          </div>
        </div>
      </div>
    </section>
  );
}