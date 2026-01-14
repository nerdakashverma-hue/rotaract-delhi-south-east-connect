import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, LogOut, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  display_order: number;
}

export default function AdminTeam() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!user && isAdmin,
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, photoUrl }: { id: string; photoUrl: string | null }) => {
      const { error } = await supabase
        .from("team_members")
        .update({ photo_url: photoUrl })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Photo updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update photo: " + error.message);
    },
  });

  const handleFileUpload = async (memberId: string, file: File) => {
    setUploadingId(memberId);

    try {
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("team-photos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("team-photos")
        .getPublicUrl(fileName);

      // Update the team member's photo_url
      await updatePhotoMutation.mutateAsync({ id: memberId, photoUrl: publicUrl });
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemovePhoto = async (memberId: string) => {
    await updatePhotoMutation.mutateAsync({ id: memberId, photoUrl: null });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((n) => !n.includes("Rtr.") && !n.includes("Rtn.") && !n.includes("IPP"))
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated or not admin
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
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Team Photo Manager</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage photos for each team member
          </p>
        </div>

        {/* Team Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="glass-card rounded-2xl p-6">
                {/* Current Photo/Avatar */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <span className="text-primary font-bold text-xl">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>

                {/* Upload Controls */}
                <div className="space-y-2">
                  <label className="block">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(member.id, file);
                      }}
                      disabled={uploadingId === member.id}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={uploadingId === member.id}
                      asChild
                    >
                      <span className="cursor-pointer">
                        {uploadingId === member.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {member.photo_url ? "Change Photo" : "Upload Photo"}
                          </>
                        )}
                      </span>
                    </Button>
                  </label>

                  {member.photo_url && (
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => handleRemovePhoto(member.id)}
                      disabled={uploadingId === member.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Photo
                    </Button>
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
