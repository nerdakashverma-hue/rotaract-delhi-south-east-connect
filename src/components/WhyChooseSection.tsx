import { Heart, Users, Star, Laugh, Coffee, Trophy } from "lucide-react";

export function WhyChooseSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float animation-delay-400" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 hover:bg-primary/15 transition-colors">
            Why Us?
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">RAC DSE?</span> 💫
          </h2>
          <p className="text-xl text-muted-foreground">
            Because we're not just members… <span className="font-semibold text-foreground">We're family.</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up animation-delay-200">
          <div className="glass-card rounded-3xl p-8 md:p-12 hover:shadow-lg transition-shadow">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At RAC DSE, we don't just plan events—we live them. Together, we've shed tears over last-minute deadlines, cribbed about 8 a.m. calls (and still showed up!), laughed till our stomachs hurt, and danced like nobody's watching after every project success.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We're a group of passionate misfits who believe in creating change and making memories. From crazy brainstorming sessions to wholesome chai breaks, from sleepless prep nights to standing ovations—every moment here becomes a story you'll carry forever.
            </p>
            <p className="text-lg font-medium text-foreground">
              Join us not just to grow as a leader, but to gain a home, a hype squad, and friendships that go way beyond club meetings.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: "Genuine Bonds", desc: "Friendships that last a lifetime, not just a tenure", delay: 0 },
            { icon: Users, title: "Supportive Fam", desc: "A hype squad that lifts you up, always", delay: 100 },
            { icon: Star, title: "Real Impact", desc: "Projects that make tangible differences", delay: 200 },
            { icon: Laugh, title: "Fun Vibes", desc: "Work hard, party harder (responsibly!)", delay: 300 },
            { icon: Coffee, title: "Chai Breaks", desc: "The best ideas happen over chai and chill", delay: 400 },
            { icon: Trophy, title: "Growth Path", desc: "From shy to confident, one project at a time", delay: 500 },
          ].map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover-lift group animate-scale-in"
              style={{ animationDelay: `${300 + item.delay}ms` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform animate-bounce-subtle" style={{ animationDelay: `${item.delay}ms` }}>
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="text-center mt-16 animate-slide-up animation-delay-600">
          <p className="text-xl md:text-2xl font-display text-foreground">
            So, why RAC DSE? Because here, you're not just joining a club…
          </p>
          <p className="text-2xl md:text-3xl font-display font-bold gradient-text mt-2 animate-shimmer">
            You're becoming part of something real. Something unforgettable. Something beautifully chaotic. 🎉
          </p>
        </div>
      </div>
    </section>
  );
}