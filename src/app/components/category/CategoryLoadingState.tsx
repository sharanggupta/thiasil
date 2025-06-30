"use client";
import React from 'react';
import LoadingState from "@/app/components/ui/LoadingState";

export default function CategoryLoadingState() {
  return (
    <LoadingState
      title="Loading Category..."
      message="Please wait while we load the category data."
      showBackground={true}
      fullScreen={true}
      size="large"
      spinnerColor="white"
    />
  );
}