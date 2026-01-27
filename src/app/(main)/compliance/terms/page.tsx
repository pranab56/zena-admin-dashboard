"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateCMSMutation,
  useGetCMSQuery,
} from "../../../../features/CMS/CMSApi";
import TipTapEditor from "../../../../TipTapEditor/TipTapEditor";
import { RTKError } from '../../../../utils/types';

const TermsConditionsPage = () => {
  const [content, setContent] = useState<string>("");
  const [title] = useState<string>("Terms and Conditions");
  const [hasDataLoaded, setHasDataLoaded] = useState<boolean>(false);

  // Fetch CMS data
  const {
    data,
    isLoading: isFetching,
    isError,
    refetch,
  } = useGetCMSQuery({});

  // Update mutation
  const [updateCMS, { isLoading: isUpdating }] = useCreateCMSMutation();

  useEffect(() => {
    if (data?.success && data?.data?.termsOfService) {
      setContent(data.data.termsOfService);
      setHasDataLoaded(true);
    }
  }, [data]);

  const isContentEmpty = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  };

  const handleUpdate = async () => {
    if (isContentEmpty(content)) {
      toast.error("Terms content cannot be empty");
      return;
    }

    try {
      const response = await updateCMS({
        termsOfService: content,
      }).unwrap();

      toast.success(response.message || "Terms updated successfully");
      refetch();
    } catch (error: unknown) {
      const err = error as RTKError;
      toast.error(err?.data?.message || "Failed to update terms");
    }

  };

  if (isFetching) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Loading terms...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-64">
            <p className="text-red-500 mb-4">Failed to load terms</p>
            <Button onClick={refetch}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
      <div className="px-1 pt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Compliance & Policies</h1>
        <p className="text-gray-500 text-sm md:text-base mt-2">Manage your salon&apos;s legal and regulatory documentation.</p>
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-8 pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <div className="space-y-8">
            {/* ✅ Only render editor when data has loaded */}
            {hasDataLoaded ? (
              <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-white/50">
                <TipTapEditor
                  description={content}
                  handleJobDescription={setContent}
                  minHeight="400px"
                  maxHeight="650px"
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[500px] bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <Loader2 className="h-10 w-10 animate-spin text-[#A8D5BA] mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Initializing Editor...</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isUpdating}
                className="py-6 px-8 rounded-2xl border-gray-100 text-gray-500 font-bold hover:bg-gray-50 order-2 sm:order-1"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating || isContentEmpty(content)}
                className="py-6 px-10 rounded-2xl bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-black shadow-lg shadow-green-100 transition-all hover:translate-y-[-2px] active:translate-y-0 order-1 sm:order-2"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Synchronizing...</span>
                  </div>
                ) : (
                  "Update Policy"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditionsPage;