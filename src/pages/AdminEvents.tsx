import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import { toast } from "sonner";
import {
  Upload,
  LogOut,
  ArrowLeft,
  Loader2,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  MapPin,
  Users,
  Edit2,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";

type EventStatus = "ongoing" | "upcoming" | "past";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  attendees: number;
  status: EventStatus;
  image_url: string | null;
  display_order: number;
}

interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string;
  status: EventStatus;
}

const emptyForm: EventForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  attendees: "0",
  status: "upcoming",
};

export default function AdminEvents() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<EventForm>(emptyForm);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user && isAdmin,
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<Event, "id" | "image_url" | "display_order">) => {
      const { error } = await supabase.from("events").insert({
        ...eventData,
        display_order: events.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully!");
      setIsAdding(false);
      setForm(emptyForm);
    },
    onError: (error) => {
      toast.error("Failed to create event: " + error.message);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Event> & { id: string }) => {
      const { error } = await supabase
        .from("events")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully!");
      setEditingId(null);
    },
    onError: (error) => {
      toast.error("Failed to update event: " + error.message);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete event: " + error.message);
    },
  });

  const handleFileUpload = async (eventId: string, file: File) => {
    setUploadingId(eventId);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${eventId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("event-images").getPublicUrl(fileName);

      await updateEventMutation.mutateAsync({ id: eventId, image_url: publicUrl });
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveImage = async (eventId: string) => {
    await updateEventMutation.mutateAsync({ id: eventId, image_url: null });
  };

  const handleEditEvent = (event: Event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      date: event.date,
      location: event.location || "",
      attendees: String(event.attendees),
      status: event.status,
    });
  };

  const handleSaveEvent = async (eventId: string) => {
    await updateEventMutation.mutateAsync({
      id: eventId,
      title: form.title,
      description: form.description || null,
      date: form.date,
      location: form.location || null,
      attendees: parseInt(form.attendees) || 0,
      status: form.status,
    });
  };

  const handleCreateEvent = async () => {
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    await createEventMutation.mutateAsync({
      title: form.title,
      description: form.description || null,
      date: form.date,
      location: form.location || null,
      attendees: parseInt(form.attendees) || 0,
      status: form.status,
    });
  };

  const statusColors = {
    ongoing: "bg-green-500/10 text-green-600 border-green-500/30",
    upcoming: "bg-secondary/10 text-secondary border-secondary/30",
    past: "bg-muted text-muted-foreground border-muted-foreground/30",
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin permissions to access this page.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/team"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </Link>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Title & Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Event Manager</h1>
            <p className="text-muted-foreground mt-2">
              Add, edit, and manage events displayed on the website
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Add New Event Form */}
        {isAdding && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">New Event</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAdding(false);
                  setForm(emptyForm);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  placeholder="e.g. January 15, 2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Event location"
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Attendees</Label>
                <Input
                  type="number"
                  value={form.attendees}
                  onChange={(e) => setForm((p) => ({ ...p, attendees: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((p) => ({ ...p, status: v as EventStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">🔥 Currently Active</SelectItem>
                    <SelectItem value="upcoming">📅 Upcoming</SelectItem>
                    <SelectItem value="past">✅ Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Events List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events yet. Add your first event!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl p-6">
                {editingId === event.id ? (
                  /* Edit Mode */
                  <div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={form.title}
                          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <Input
                          value={form.date}
                          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={form.location}
                          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Attendees</Label>
                        <Input
                          type="number"
                          value={form.attendees}
                          onChange={(e) => setForm((p) => ({ ...p, attendees: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={form.status}
                          onValueChange={(v) =>
                            setForm((p) => ({ ...p, status: v as EventStatus }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">🔥 Currently Active</SelectItem>
                            <SelectItem value="upcoming">📅 Upcoming</SelectItem>
                            <SelectItem value="past">✅ Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={form.description}
                          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveEvent(event.id)}
                        disabled={updateEventMutation.isPending}
                      >
                        {updateEventMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-48 flex-shrink-0">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                      )}
                      <div className="mt-2 space-y-1">
                        <label className="block">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(event.id, file);
                            }}
                            disabled={uploadingId === event.id}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={uploadingId === event.id}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {uploadingId === event.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-1" />
                                  {event.image_url ? "Change" : "Upload"}
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                        {event.image_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => handleRemoveImage(event.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display text-xl font-bold">{event.title}</h3>
                          <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[event.status]}`}
                          >
                            {event.status === "ongoing"
                              ? "🔥 Currently Active"
                              : event.status === "upcoming"
                              ? "📅 Upcoming"
                              : "✅ Completed"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteEventMutation.mutate(event.id)}
                            disabled={deleteEventMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          {event.date}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          {event.attendees}+ Participants
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
