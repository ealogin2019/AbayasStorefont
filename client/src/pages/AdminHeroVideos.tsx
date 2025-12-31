import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Video, Image as ImageIcon } from "lucide-react";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  type: "video" | "image";
  video?: string;
  image?: string;
  order: number;
}

export default function AdminHeroVideos() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: 1,
      title: "Arab Abayas",
      subtitle: "Modern Luxury, Timeless Elegance",
      cta: "Explore Collection",
      ctaLink: "#featured",
      type: "video",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      order: 1,
    },
    {
      id: 2,
      title: "New Season",
      subtitle: "Discover Our Latest Designs",
      cta: "Shop Now",
      ctaLink: "/shop",
      type: "image",
      image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
      order: 2,
    },
  ]);

  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    cta: "",
    ctaLink: "",
    type: "video" as "video" | "image",
    video: "",
    image: "",
  });

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      ctaLink: slide.ctaLink,
      type: slide.type,
      video: slide.video || "",
      image: slide.image || "",
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      cta: "",
      ctaLink: "",
      type: "video",
      video: "",
      image: "",
    });
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newSlide: HeroSlide = {
        id: Math.max(...slides.map(s => s.id), 0) + 1,
        ...formData,
        order: slides.length + 1,
      };
      setSlides([...slides, newSlide]);
      toast.success("Hero slide added successfully");
    } else if (editingSlide) {
      setSlides(slides.map(s =>
        s.id === editingSlide.id
          ? { ...s, ...formData }
          : s
      ));
      toast.success("Hero slide updated successfully");
    }
    handleCancel();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      setSlides(slides.filter(s => s.id !== id));
      toast.success("Hero slide deleted successfully");
    }
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setIsAddingNew(false);
    setFormData({
      title: "",
      subtitle: "",
      cta: "",
      ctaLink: "",
      type: "video",
      video: "",
      image: "",
    });
  };

  const moveSlide = (id: number, direction: "up" | "down") => {
    const index = slides.findIndex(s => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
    
    // Update order
    newSlides.forEach((slide, idx) => {
      slide.order = idx + 1;
    });
    
    setSlides(newSlides);
    toast.success("Slide order updated");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Carousel Management</h1>
            <p className="text-gray-600 mt-1">Manage homepage hero slides with videos and images</p>
          </div>
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="border-gray-300"
          >
            Back to Admin
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slides List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Slides</CardTitle>
                  <CardDescription>Drag to reorder, click to edit</CardDescription>
                </div>
                <Button onClick={handleAddNew} className="bg-[#B8860B] hover:bg-[#9A7209]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {slides.sort((a, b) => a.order - b.order).map((slide, index) => (
                    <div
                      key={slide.id}
                      className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {slide.type === "video" ? (
                            <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <Video className="w-8 h-8 text-gray-400" />
                            </div>
                          ) : (
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {slide.type}
                                </span>
                                <span className="text-xs text-gray-500">Order: {slide.order}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveSlide(slide.id, "up")}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveSlide(slide.id, "down")}
                                disabled={index === slides.length - 1}
                              >
                                ↓
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(slide)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(slide.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {slides.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No slides yet. Click "Add Slide" to create one.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-1">
            {(editingSlide || isAddingNew) && (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>{isAddingNew ? "Add New Slide" : "Edit Slide"}</CardTitle>
                  <CardDescription>
                    {isAddingNew ? "Create a new hero slide" : "Update slide details"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as "video" | "image" })}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="video">
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </TabsTrigger>
                      <TabsTrigger value="image">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="videoUrl">Video URL</Label>
                        <Input
                          id="videoUrl"
                          placeholder="https://example.com/video.mp4"
                          value={formData.video}
                          onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="image" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      placeholder="Enter subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta">CTA Button Text</Label>
                    <Input
                      id="cta"
                      placeholder="Shop Now"
                      value={formData.cta}
                      onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ctaLink">CTA Link</Label>
                    <Input
                      id="ctaLink"
                      placeholder="/shop"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-[#B8860B] hover:bg-[#9A7209]"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
