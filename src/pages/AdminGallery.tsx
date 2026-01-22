import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit2,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";

interface GalleryPhoto {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  event_name: string | null;
  description: string | null;
  created_at: string;
}

interface GalleryForm {
  title: string;
  category: string;
  event_name: string;
  description: string;
}

const emptyForm: GalleryForm = {
  title: "",
  category: "",
  event_name: "",
  description: "",
};

function getStoragePathFromPublicUrl(publicUrl: string) {
  // URL looks like: https://.../storage/v1/object/public/<bucket>/<path>
  const marker = "/storage/v1/object/public/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  const rest = publicUrl.slice(idx + marker.length);
  const parts = rest.split("/");
  if (parts.length < 2) return null;
  const bucket = parts[0];
  const path = parts.slice(1).join("/");
  return { bucket, path };
}

export default function AdminGallery() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addFileRef = useRef<HTMLInputElement | null>(null);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["admin-gallery-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GalleryPhoto[];
    },
    enabled: !!user && isAdmin,
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (payload: Omit<GalleryPhoto, "id" | "created_at">) => {
      const { error } = await supabase.from("gallery_photos").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-page"] });
      toast.success("Photo added to gallery!");
      setIsAdding(false);
      setForm(emptyForm);
      if (addFileRef.current) addFileRef.current.value = "";
    },
    onError: (error) => toast.error("Failed to add photo: " + error.message),
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<GalleryPhoto> & { id: string }) => {
      const { error } = await supabase.from("gallery_photos").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-page"] });
      toast.success("Gallery photo updated!");
      setEditingId(null);
    },
    onError: (error) => toast.error("Failed to update photo: " + error.message),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async ({ id, image_url }: { id: string; image_url: string }) => {
      // delete DB row first
      const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
      if (error) throw error;

      // Best-effort cleanup of the file (if URL format matches). If it fails, we still keep DB consistent.
      const parsed = getStoragePathFromPublicUrl(image_url);
      if (parsed?.bucket === "gallery-images" && parsed.path) {
        await supabase.storage.from("gallery-images").remove([parsed.path]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-page"] });
      toast.success("Photo removed from gallery");
    },
    onError: (error) => toast.error("Failed to delete photo: " + error.message),
  });

  const handleUploadNew = async (file: File) => {
    setUploadingId("new");
    try {
      if (!form.title.trim()) {
        toast.error("Title is required");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery-images").getPublicUrl(fileName);

      await createPhotoMutation.mutateAsync({
        title: form.title.trim(),
        image_url: publicUrl,
        category: form.category.trim() || null,
        event_name: form.event_name.trim() || null,
        description: form.description.trim() || null,
      });
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleReplaceImage = async (photo: GalleryPhoto, file: File) => {
    setUploadingId(photo.id);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${photo.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery-images").getPublicUrl(fileName);

      await updatePhotoMutation.mutateAsync({ id: photo.id, image_url: publicUrl });
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const editingPhoto = useMemo(() => photos.find((p) => p.id === editingId) ?? null, [editingId, photos]);

  const [editForm, setEditForm] = useState<GalleryForm>(emptyForm);

  useEffect(() => {
    if (!editingPhoto) return;
    setEditForm({
      title: editingPhoto.title || "",
      category: editingPhoto.category || "",
      event_name: editingPhoto.event_name || "",
      description: editingPhoto.description || "",
    });
  }, [editingPhoto]);

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
              to="/admin/events"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Title & Add */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Gallery Manager</h1>
            <p className="text-muted-foreground mt-2">
              Upload, replace, and manage gallery images displayed on the website ({photos.length} photos)
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">New Gallery Photo</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAdding(false);
                  setForm(emptyForm);
                  if (addFileRef.current) addFileRef.current.value = "";
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Photo title"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. community"
                />
              </div>
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input
                  value={form.event_name}
                  onChange={(e) => setForm((p) => ({ ...p, event_name: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <Input
                  ref={addFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadNew(file);
                  }}
                  disabled={uploadingId === "new" || createPhotoMutation.isPending}
                />
                <Button variant="outline" className="w-full" asChild>
                  <span className="cursor-pointer">
                    {uploadingId === "new" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image & Upload
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsAdding(false);
                  setForm(emptyForm);
                  if (addFileRef.current) addFileRef.current.value = "";
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No gallery photos yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="glass-card rounded-2xl p-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="mt-3">
                  {editingId === photo.id ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Title *</Label>
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Input
                          value={editForm.category}
                          onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Event Name</Label>
                        <Input
                          value={editForm.event_name}
                          onChange={(e) => setEditForm((p) => ({ ...p, event_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            updatePhotoMutation.mutate({
                              id: photo.id,
                              title: editForm.title.trim(),
                              category: editForm.category.trim() || null,
                              event_name: editForm.event_name.trim() || null,
                              description: editForm.description.trim() || null,
                            })
                          }
                          disabled={updatePhotoMutation.isPending}
                        >
                          {updatePhotoMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold leading-snug">{photo.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {photo.category || "Uncategorized"}
                            {photo.event_name ? ` • ${photo.event_name}` : ""}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(photo.id)}>
                          <Edit2 className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>

                      {photo.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {photo.description}
                        </p>
                      )}

                      <div className="mt-3 space-y-2">
                        <label className="block">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReplaceImage(photo, file);
                            }}
                            disabled={uploadingId === photo.id}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled={uploadingId === photo.id}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {uploadingId === photo.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Change Image
                                </>
                              )}
                            </span>
                          </Button>
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingId(photo.id);
                              setEditForm({
                                title: photo.title || "",
                                category: photo.category || "",
                                event_name: photo.event_name || "",
                                description: photo.description || "",
                              });
                            }}
                          >
                            Edit Details
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deletePhotoMutation.mutate({ id: photo.id, image_url: photo.image_url })}
                            disabled={deletePhotoMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
