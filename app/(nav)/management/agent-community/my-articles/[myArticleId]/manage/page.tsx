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
import {
  deleteMyArticle,
  getMyArticlesDetails,
  transformFormUpdateArticleData,
  updateMyArticle,
} from "../../data";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { CommentData } from "@/components/tasks/announcements/comment";
import { AuthForm } from "@/components/Auth/auth-components";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import {
  DeleteArticleModal,
  DeleteArticleModalSuccess,
  DeleteInventoryModal,
  DeleteInventoryModalSuccess,
} from "@/components/Modal/delete-inventory";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { Article, ArticleResponse, transformMyArticleResponse } from "./data";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import BackButton from "@/components/BackButton/back-button";
import { ManageArticleSecondSection, SecondSectionLoader } from "./components";

const desc =
  "#Commercial and retail real estate fundamentals are expected to remain strong due to the scarcity of new construction deliveries, prompting compelling opportunities for investors amid high interest rates and inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic headwinds and challenges with obtaining building permits, experts predict that the demand for housing will remain strong, and the market will see a steady increase in property values this year. There are also opportunities available for high-quality properties that meet the needs of investors and tenants, while low mortgage rates and government incentives will likely contribute to this optimistic outlook as inflation may remain a concern in 2024, affecting both home prices and mortgage rates.";

const ManageMyArticle = () => {
  const router = useRouter();
  const { myArticleId } = useParams();
  const slug = myArticleId as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [id, setId] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [retainMedia, setRetainMedia] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data, error, loading, silentLoading, isNetworkError, refetch } =
    useFetch<ArticleResponse>(`/agent_community/${slug}`);

  const handleDeleteMyArticle = async ({ slug }: { slug: string }) => {
    setIsDeleting(true);
    const response = await deleteMyArticle(slug);
    if (response) {
      toast.success("Article deleted successfully");
      setShowSuccessModal(true);
    } else {
      toast.error("Failed to delete article");
    }
    setIsDeleting(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/management/agent-community/my-articles");
  };

  useEffect(() => {
    if (data) {
      const transformedData = transformMyArticleResponse(data);
      setArticle(transformedData.article);
      setId(transformedData.article.id);
    }
  }, [data]);

  const handleUpdate = async (formData: FormData) => {
    // console.log("formData before processing:", formData)
    const targetAudience = formData.get("target_audience");
    if (typeof targetAudience === "string") {
      const audienceArray = targetAudience.split(",").slice(0, 60); // Split into an array and limit to 60 items
      audienceArray.forEach((audience) =>
        formData.append("target_audience[]", audience.trim())
      );
    }
    // console.log("retainMedia", retainMedia)
    // console.log("imageFiles", imageFiles)
    retainMedia.forEach((media) => formData.append("retain_media[]", media));

    imageFiles.forEach((file) => formData.append("pictures[]", file));
    formData.append("_method", "patch");
    const transformedData = transformFormUpdateArticleData(formData);
    // console.log("Submitting:", transformedData);
    setIsUpdating(true);
    try {
      const success = await updateMyArticle(formData, slug);
      if (success) {
        toast.success("Article updated successfully!");
        router.push(`/management/agent-community/my-articles`);
      } else {
        toast.error("Failed to update the article.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the article.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="wra mb-16 overflow-visible">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <BackButton>Manage Article </BackButton>
      </div>

      <AuthForm onFormSubmit={handleUpdate} returnType="form-data">
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
            <ManageArticleSecondSection
              retainMedia={retainMedia}
              setRetainMedia={setRetainMedia}
              data={article}
              loading={loading}
              setImageFiles={setImageFiles}
            />
          </div>
        </div>
        <FixedFooter className="flex gap-6 justify-end">
          <Modal>
            <ModalTrigger asChild>
              <Button
                size="sm_medium"
                variant="blank"
                className="py-2 px-7 text-status-error-primary bg-status-error-1"
              >
                delete
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteArticleModal
                handleDelete={() => handleDeleteMyArticle({ slug })}
              />
            </ModalContent>
          </Modal>
          {showSuccessModal && (
            <DeleteArticleModalSuccess
              open={showSuccessModal}
              handleClose={handleCloseSuccessModal}
            />
          )}
          <Button
            type="submit"
            size="base_medium"
            className="py-2 px-8"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </div>
  );
};

export default ManageMyArticle;

