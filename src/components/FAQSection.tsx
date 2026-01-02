import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Rotaract?",
    answer: "Rotaract is a global movement of young changemakers (ages 18–30+) backed by Rotary International. It's where leadership meets service, and fun meets impact. Basically, we do good in the world while having a great time doing it!"
  },
  {
    question: "How is Rotaract different from Rotary?",
    answer: "Rotary is the OG—think experienced professionals and community leaders. Rotaract is the youth wing, full of energetic, passionate young adults who are just as committed to service, but with a fresh (and slightly chaotic) twist!"
  },
  {
    question: "What does RaC DSE do?",
    answer: "We host projects that matter—whether it's spreading awareness, organizing donation drives, educating children, protecting the environment, or just spreading joy. We also do fellowships, speaker sessions, games, treks, and the occasional \"let's-just-vibe\" meetups."
  },
  {
    question: "Do I need prior experience to join?",
    answer: "Nope! Just bring your passion, your ideas, and your chai preferences. We'll handle the rest. No experience needed—just a big heart and the willingness to grow."
  },
  {
    question: "Is it all work and no play?",
    answer: "Absolutely not! We work hard and we party harder (responsibly, of course). Think fun retreats, spontaneous celebrations, late-night gossip, and friendships that feel like home."
  },
  {
    question: "Will I get opportunities for leadership or growth?",
    answer: "100% yes. RaC DSE is a launchpad for leaders. You'll get hands-on experience, lead teams, manage projects, and even represent us on national and international platforms!"
  },
  {
    question: "How do I become a member?",
    answer: "Just slide into our DMs or fill out our membership form. We'll take it from there. (Warning: Joining may lead to serious amounts of joy and unforgettable memories.)"
  },
  {
    question: "What if I'm shy or unsure?",
    answer: "Perfect. We love turning shy humans into confident leaders. You'll find a supportive fam here that lifts you up, one project (and one dance-off) at a time."
  },
  {
    question: "Does it help in professional life too?",
    answer: "Absolutely! You'll build communication, teamwork, leadership, and event management skills—all while networking with some amazing folks. Plus, it looks great on your resume."
  },
  {
    question: "Why should I choose Rotaract Club of Delhi South East?",
    answer: "Because we aren't just a club. We're a family. We crib together, cry together, pull off miracles together—and in the end, we always laugh and celebrate together. 💛"
  },
];

export function FAQSection() {
  return (
    <section id="faqs" className="py-20 md:py-32 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            FAQs
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've got answers! Here are some frequently asked questions about Rotaract and RaC DSE.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-2xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  <span className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-12">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
