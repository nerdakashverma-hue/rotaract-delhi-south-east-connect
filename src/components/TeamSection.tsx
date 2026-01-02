import { Linkedin, Instagram, Mail } from "lucide-react";

const teamMembers = [
  { name: "Rtr. Reet Sethi", role: "President" },
  { name: "Rtr. Gunpreet Singh", role: "Vice President" },
  { name: "Rtr. Aviral Sansi", role: "Secretary" },
  { name: "Rtr. Rohit Saini", role: "Treasurer" },
  { name: "Rtr. Aryan Sanjeev", role: "Joint Secretary" },
  { name: "Rtr. Sarthak Bansal", role: "Chief Aide To President" },
  { name: "IPP Rtr. Kartik Dawar", role: "Club Trainer" },
  { name: "Rtn. Rtr. Rishika Khanna", role: "Club Advisor" },
  { name: "Rtr. Prachi Oberoi", role: "Club Observer" },
  { name: "Rtr. Sanya Taneja", role: "Public Relations Officer" },
  { name: "Rtr. Pratyush Sinha", role: "Graphic Designer" },
  { name: "Rtr. Akash Verma", role: "Graphics Designer" },
  { name: "Rtr. Riddhi Gupta", role: "Club Supervisor" },
  { name: "Rtr. Hunar Khanna", role: "Club Administrator" },
  { name: "Rtr. Shweta Ghai", role: "Sergeant-At-Arms" },
  { name: "Rtr. Khushi Sethi", role: "Directorial Committee Chair" },
  { name: "Rtr. Ojassvi Sharma", role: "Community Services Director" },
  { name: "Rtr. Bhavya Mittal", role: "Community Services Co-Director" },
  { name: "Rtr. Shivansh Tiwari", role: "Vocational Services Director" },
  { name: "Rtr. Divina Khattar", role: "Vocational Services Co-Director" },
  { name: "Rtr. Kanav Bhatia", role: "Club Services Director" },
  { name: "Rtr. Manasvi Mittal", role: "Club Services Co-Director" },
  { name: "Rtr. Prashant Joshi", role: "International Services Director" },
  { name: "Rtr. Harshita Agarwal", role: "International Services Co-Director" },
  { name: "Rtr. Sanya Maini", role: "Video Editor" },
  { name: "Rtr. Naman Rusia", role: "Outreach Head" },
  { name: "Rtr. Uttpreksha Tyagi", role: "Creative Services Director" },
  { name: "Rtr. Sahib Singh", role: "Creative Services Director" },
  { name: "Rtr. Riya Yadav", role: "Club Editor" },
  { name: "Rtr. Rishabh Jain", role: "Rotaract-Interact Relations" },
];

export function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Team
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Meet the <span className="gradient-text">Changemakers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals driving our mission forward, one project at a time.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl p-6 text-center hover-lift group"
            >
              {/* Avatar with initials */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center relative z-10 border-2 border-primary/20">
                  <span className="text-primary font-bold text-lg">
                    {member.name.split(' ').filter(n => !n.includes('Rtr.') && !n.includes('Rtn.') && !n.includes('IPP')).map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-4">{member.role}</p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
