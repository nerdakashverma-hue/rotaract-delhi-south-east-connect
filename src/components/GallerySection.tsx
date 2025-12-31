import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GalleryPhoto {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  event_name: string | null;
  category: string | null;
}

const categories = [
  { key: "all", label: "All" },
  { key: "health", label: "Health" },
  { key: "environment", label: "Environment" },
  { key: "community", label: "Community" },
  { key: "education", label: "Education" },
  { key: "fellowship", label: "Fellowship" },
  { key: "events", label: "Events" },
];

export function GallerySection() {
  const [searchParams] = useSearchParams();
  const eventFilter = searchParams.get("event");
  
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    const categoryMatch = activeCategory === "all" || p.category === activeCategory;
    const eventMatch = !eventFilter || p.event_name?.toLowerCase().includes(eventFilter.toLowerCase().replace(/-/g, ' '));
    return categoryMatch && eventMatch;
  });

  const currentIndex = selectedPhoto 
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) 
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  return (
    <section id="gallery" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Camera className="w-4 h-4 inline mr-2" />
            Photo Gallery
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Moments</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {eventFilter 
              ? `Showing photos from: ${eventFilter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
              : "Capturing the joy, impact, and memories we create together."
            }
          </p>
        </div>

        {/* Category Filter */}
        {!eventFilter && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium transition-all text-sm",
                  activeCategory === cat.key
                    ? "gradient-bg text-primary-foreground shadow-lg"
                    : "bg-card hover:bg-muted border border-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Photo Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer hover-lift",
                  index === 0 && "md:col-span-2 md:row-span-2"
                )}
              >
                <div className={cn(
                  "aspect-[4/3]",
                  index === 0 && "md:aspect-square"
                )}>
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                    <h4 className="font-semibold text-sm md:text-base truncate">{photo.title}</h4>
                    {photo.event_name && (
                      <p className="text-xs md:text-sm opacity-80">{photo.event_name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPhotos.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No photos found.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-primary-foreground hover:bg-background/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-primary-foreground hover:bg-background/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentIndex < filteredPhotos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-primary-foreground hover:bg-background/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center text-primary-foreground">
                <h3 className="text-xl font-display font-bold">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-sm opacity-80 mt-1">{selectedPhoto.description}</p>
                )}
                {selectedPhoto.event_name && (
                  <p className="text-sm mt-2 opacity-60">{selectedPhoto.event_name}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
