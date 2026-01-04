import { Heart, Instagram, Linkedin, Facebook, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-lg px-2 py-1 shadow-lg">
                <img src="/logo.png" alt="RaC Delhi South East" className="h-14 w-auto" />
              </div>
            </div>
            <p className="text-background/70 max-w-md mb-6">
              Where passion meets purpose, and youth meets action. Join our family of changemakers creating lasting impact through service, leadership, and friendship.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Mail, label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:gradient-bg transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Our Team", "Events", "FAQs", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-background/70 hover:text-background transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Rotary Family */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Rotary Family</h4>
            <ul className="space-y-3">
              {[
                { name: "Rotary International", url: "https://rotary.org" },
                { name: "Rotaract Global", url: "https://rotaract.org" },
                { name: "District 3011", url: "#" },
                { name: "Our Parent Rotary Club", url: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Rotaract Club of Delhi South East. All rights reserved.
            </p>
            <p className="text-background/60 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by RaC DSE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
