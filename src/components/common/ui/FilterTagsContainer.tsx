"use client";
import * as React from "react";
import { FilterTags } from "./FilterTags";
import { useGetAllCategoriesWithSubcategoriesQuery } from "@/lib/redux/features/course/category/categoryApi";

const defaultTags = [
  "Data Science",
  "IT Certifications",
  "Leadership",
  "Web Development",
  "Communication",
  "Business Analytics & Intelligence"
];

interface FilterTagsContainerProps {
  tags?: string[];
  defaultSelectedTag?: string;
  onTagChange?: (selectedTag: string) => void;
}

export const FilterTagsContainer: React.FC<FilterTagsContainerProps> = ({
  tags,
  defaultSelectedTag = "Web Development",
  onTagChange
}) => {
  const { data, isLoading } = useGetAllCategoriesWithSubcategoriesQuery();

  // Prefer props.tags if provided; otherwise use API; fallback to defaults
  const apiTags = React.useMemo(() => {
    const list = (data as any)?.categories ?? [];
    return Array.isArray(list)
      ? list.map((c: any) => String(c?.title ?? "")).filter((t: string) => t.length > 0)
      : [];
  }, [data]);

  const effectiveTags = React.useMemo(() => {
    if (Array.isArray(tags) && tags.length > 0) return tags;
    if (!isLoading && apiTags.length > 0) return apiTags;
    return defaultTags;
  }, [tags, apiTags, isLoading]);

  const initialSelected = React.useMemo(() => {
    if (defaultSelectedTag && effectiveTags.includes(defaultSelectedTag)) return defaultSelectedTag;
    return effectiveTags[0] ?? defaultTags[0];
  }, [defaultSelectedTag, effectiveTags]);

  const [selectedTag, setSelectedTag] = React.useState<string>(initialSelected);

  // Keep selected tag valid when tag list changes
  React.useEffect(() => {
    if (!effectiveTags.includes(selectedTag)) {
      setSelectedTag(effectiveTags[0] ?? "");
    }
  }, [effectiveTags, selectedTag]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    onTagChange?.(tag);
  };

  return (
    <FilterTags
      tags={effectiveTags}
      selectedTag={selectedTag}
      onTagSelect={handleTagSelect}
    />
  );
};

export default FilterTagsContainer;
