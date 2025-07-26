"use client";

import type React from "react";
import { useReducer, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { INITIAL_STATE, gigReducer } from "@/lib/gig-reducer";
import { UploadDropzone } from "@/lib/upload";

export default function AddGigPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [state, dispatch] = useReducer(gigReducer, {
    ...INITIAL_STATE,
    userId: session?.user.id, // Set userId from session
  });
  const [uploading, setUploading] = useState(false);

  const [descriptionLength, setDescriptionLength] = useState(
    state.description.length ?? 0,
  );

  const [shortDescLength, setShortDescLength] = useState(
    state.shortDesc.length ?? 0,
  );

  const createGigMutation = useMutation({
    mutationFn: async (gigData: typeof INITIAL_STATE) => {
      const response = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gigData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // assume backend sends zod issues as errorData.errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of errorData.errors) {
            if (issue.path && issue.path.length > 0) {
              fieldErrors[issue.path[0]] = issue.message;
            }
          }
          setErrors(fieldErrors);
          throw new Error("Validation failed");
        }

        throw new Error(errorData.error || "Failed to create gig");
      }

      return response.json();
    },
    onSuccess: () => {
      setErrors({}); // clear errors on success
      queryClient.invalidateQueries({ queryKey: ["myGigs"] });
      toast({
        title: "Success",
        description: "Gig created successfully!",
      });
      router.push("/my-gigs");
    },
    onError: (err: any) => {
      if (err.message !== "Validation failed") {
        toast({
          title: "Error",
          description: err.message || "Failed to create gig.",
          variant: "destructive",
        });
      }
    },
  });

  // Redirect if not authenticated or not a seller
  if (status === "loading")
    return (
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center">
        Loading...
      </div>
    );
  if (!session || !session.user.isSeller) {
    router.push("/"); // Redirect to home or login
    toast({
      title: "Unauthorized",
      description: "Only sellers can add new gigs.",
      variant: "destructive",
    });
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    const numericFields = ["price", "deliveryTime", "revisionNumber"];

    if (name === "description") {
      setDescriptionLength(value.length);
    }

    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: name as keyof typeof state,
        value: numericFields.includes(name) ? Number(value) : value,
      },
    });

    if (name === "shortDesc") {
      setShortDescLength(value.length);
    }
  };

  const handleFeature = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "featureInput",
    ) as HTMLInputElement;
    const feature = input.value.trim();
    if (feature && !state.features.includes(feature)) {
      dispatch({ type: "ADD_FEATURE", payload: feature });
      input.value = "";
    }
  };

  const handleRemoveFeature = (feature: string) => {
    dispatch({ type: "REMOVE_FEATURE", payload: feature });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* 
    if (!state.cover || state.images.length === 0) {
      toast({
        title: "Missing Images",
        description:
          "Please upload a cover image and at least one additional image.",
        variant: "destructive",
      });
      return;
    }

    if (state.features.length === 0) {
      toast({
        title: "Missing Features",
        description: "Please add at least one feature.",
        variant: "destructive",
      });
      return;
    }
    */

    createGigMutation.mutate(state);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Add New Gig
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. I will do something I'm really good at"
                  onChange={handleChange}
                  value={state.title}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={state.category}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "cat", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="digital-marketing">
                      Digital Marketing
                    </SelectItem>
                    <SelectItem value="writing-translation">
                      Writing & Translation
                    </SelectItem>
                    <SelectItem value="ai-services">AI Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                {/* cover image */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={(res) => {
                      setUploading(false);
                      dispatch({
                        type: "SET_COVER",
                        payload: res[0].url,
                      });
                      toast({ title: "Cover image uploaded!" });
                    }}
                    onUploadError={(error: Error) => {
                      setUploading(false);
                      toast({
                        title: "Error uploading cover image",
                        description: error.message,
                        variant: "destructive",
                      });
                    }}
                  />
                  {state.cover && (
                    <p className="text-sm text-gray-500">
                      Cover image uploaded: {state.cover.substring(0, 30)}...
                    </p>
                  )}
                  {errors.cover && (
                    <p className="mt-1 text-sm text-red-600">{errors.cover}</p>
                  )}
                </div>

                {/* additional images */}
                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const newImages = res.map((file) => file.url);
                      dispatch({
                        type: "ADD_ADDITIONAL_IMAGES",
                        payload: newImages,
                      });

                      toast({ title: "Additional image(s) uploaded!" });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        title: "Error uploading additional images",
                        description: error.message,
                        variant: "destructive",
                      });
                    }}
                  />
                  {state.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {state.images.map((img, index) => (
                        <span
                          key={index}
                          className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-500"
                        >
                          {img.substring(0, 20)}...
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief descriptions to introduce your service to customers"
                  rows={8}
                  onChange={handleChange}
                  value={state.description}
                />
                <p
                  className={`mt-1 text-sm ${
                    descriptionLength >= 50 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {descriptionLength} / 50 characters
                </p>

                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* shortTitle */}
              <div>
                <Label htmlFor="shortTitle">Service Title</Label>
                <Input
                  id="shortTitle"
                  name="shortTitle"
                  type="text"
                  placeholder="e.g. One-page web design"
                  onChange={handleChange}
                  value={state.shortTitle}
                />
                {errors.shortTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shortTitle}
                  </p>
                )}
              </div>

              {/* shortDesc */}
              <div>
                <Label htmlFor="shortDesc">Short Description</Label>
                <Textarea
                  id="shortDesc"
                  name="shortDesc"
                  placeholder="Short description of your service"
                  rows={4}
                  onChange={handleChange}
                  value={state.shortDesc}
                />
                <p
                  className={`mt-1 text-sm ${
                    shortDescLength >= 20 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {shortDescLength} / 20 characters
                </p>

                {errors.shortDesc && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shortDesc}
                  </p>
                )}
              </div>

              {/* deliveryTime */}
              <div>
                <Label htmlFor="deliveryTime">
                  Delivery Time (e.g. 3 days)
                </Label>
                <Input
                  id="deliveryTime"
                  name="deliveryTime"
                  type="number"
                  onChange={handleChange}
                  value={state.deliveryTime}
                />
                {errors.deliveryTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.deliveryTime}
                  </p>
                )}
              </div>

              {/* revisionNumber */}
              <div>
                <Label htmlFor="revisionNumber">Revision Number</Label>
                <Input
                  id="revisionNumber"
                  name="revisionNumber"
                  type="number"
                  onChange={handleChange}
                  value={state.revisionNumber}
                />
                {errors.revisionNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.revisionNumber}
                  </p>
                )}
              </div>

              {/* features */}
              <div>
                <Label htmlFor="features">Add Features</Label>
                <div
                  className="flex gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget.querySelector(
                        '[name="featureInput"]',
                      ) as HTMLInputElement;
                      const feature = input?.value.trim();
                      if (feature && !state.features.includes(feature)) {
                        dispatch({ type: "ADD_FEATURE", payload: feature });
                        input.value = "";
                      }
                    }
                  }}
                >
                  <Input
                    type="text"
                    placeholder="e.g. page design"
                    name="featureInput"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector(
                        '[name="featureInput"]',
                      ) as HTMLInputElement;
                      const feature = input?.value.trim();
                      if (feature && !state.features.includes(feature)) {
                        dispatch({ type: "ADD_FEATURE", payload: feature });
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {errors.features && (
                  <p className="mt-1 text-sm text-red-600">{errors.features}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-2">
                  {state.features.map((f) => (
                    <Button
                      key={f}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveFeature(f)}
                      className="flex items-center gap-1"
                    >
                      {f} <X className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* price */}
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  value={state.price}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={createGigMutation.isPending}
              >
                {createGigMutation.isPending ? "Creating..." : "Create Gig"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
