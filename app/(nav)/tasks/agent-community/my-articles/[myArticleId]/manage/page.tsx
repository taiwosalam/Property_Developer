"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  PropertyRequestFirstSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { deleteMyArticle, getMyArticlesDetails, updateMyArticle } from "../../data";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { CommentProps } from "@/components/tasks/announcements/comment";
import { AuthForm } from "@/components/Auth/auth-components";

const desc =
  "#Commercial and retail real estate fundamentals are expected to remain strong due to the scarcity of new construction deliveries, prompting compelling opportunities for investors amid high interest rates and inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic headwinds and challenges with obtaining building permits, experts predict that the demand for housing will remain strong, and the market will see a steady increase in property values this year. There are also opportunities available for high-quality properties that meet the needs of investors and tenants, while low mortgage rates and government incentives will likely contribute to this optimistic outlook as inflation may remain a concern in 2024, affecting both home prices and mortgage rates.";

  interface ArticleResponse {
    post: any;
    company_summary: any;
    contributor: any;
    comments: CommentProps[];
  }
  
const ManageMyArticle = () => {
  const router = useRouter();
  const { myArticleId } = useParams();
  const slug = myArticleId as string;
  const { data, error, loading } = useFetch<ArticleResponse>(`/agent_community/${slug}`);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [article, setArticle] = useState(null)
  const [id, setId] = useState<number | null>(null);

  const handleDeleteMyArticle = async ({ slug }: { slug: string }) => {
    setIsDeleting(true);
    const response = await deleteMyArticle(slug);
    if (response) {
      toast.success("Article deleted successfully");
      router.push("/tasks/agent-community/my-articles");
    } else {
      toast.error("Failed to delete article");
    }
    setIsDeleting(false);
  };

  
  useEffect(() => {
    if (data) {
      setArticle(data.post.post);
      setId(data.post.post.id)
    }
  }, [data]);
  
  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      if (!id) {
        toast.error("Article ID not found");
        return;
      }
      const response = await updateMyArticle(id, data);
      if (response) {
        toast.success("Article updated successfully");
      }
    } catch (error) {
      console.error("Error updating my article:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="wra mb-16">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            Manage Article
          </h1>
        </div>
      </div>

    <AuthForm onFormSubmit={handleUpdate}>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestFirstSection
            placeholderText="Rent Increase & Maintenance"
            desc={desc}
            data={article}
            loading={loading}
          />
        </div>

        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <SecondSection data={article} loading={loading} />
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
        <button
          type="button"
          className="py-2 px-7 bg-[#FDE9EA] text-[#E9212E] rounded-[4px] text-sm font-medium"
          onClick={() => handleDeleteMyArticle({ slug })}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          type="submit"
          className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </FixedFooter>
      </AuthForm>
    </div>
  );
};

export default ManageMyArticle;

const SecondSection = ({ data, loading }: { data: any, loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
        {/* Skeleton for AddPhotoAndVideo */}
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>

        {/* Skeleton for StateAndLocalGovt */}
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
      <AddPhotoAndVideo editing={true} data={data} />
      <StateAndLocalGovt data={data} />
    </div>
  );
};
